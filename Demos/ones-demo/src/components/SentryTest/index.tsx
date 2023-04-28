
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@ones-design/core';
import * as Sentry from "@sentry/react";
import styles from './index.module.scss';
import { generateTransactionInstance } from '../../monitor';
import MemoryLeakComponent from './MemoryLeakComponent';
import ErrorBoundaryTest, { ErrorItem } from './ErrorBoundaryTest';
import IndexDBTest from './IndexDBTest';

const normal_transaction = generateTransactionInstance('Sentry Test', 'Sentry Test')

function mockRequest (params) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data: 123,
                params
            })
        }, 2000)
    })
}

const SentryTest: React.FunctionComponent<{}> = function (props) {
	const [loading, setLoading] = useState(false)
  const [errorItemDisplay, setErrorItemDisplay] = useState(false)
  const [subErrorItemDisplay, setSubErrorItemDisplay] = useState(false)
  const displayErrorItem = useCallback(() => {
    setErrorItemDisplay(!errorItemDisplay)
  }, [errorItemDisplay])
  const displaySubErrorItem = useCallback(() => {
    setSubErrorItemDisplay(!subErrorItemDisplay)
  }, [subErrorItemDisplay])

	const handleClick = useCallback(async () => {
		setLoading(true)
        const params = { name: 'zyc' }
        const transaction = normal_transaction
        console.log('zyc transaction', transaction)
        if (transaction) {
          const span = transaction.startSpan({
            op: 'click',
            description: 'handle click event',
            data: { params },
          })
          // const subSpan = span.startChild({
          //   op: 'subClick',
          //   description: 'handle sub click event',
          //   data: { params },
          // })
          await mockRequest(params)
          // subSpan.finish()
          // span.finish()
          transaction.finishSpan({
            spanId: span.spanId
          })
          setLoading(false)
        }
	}, [])

    const handleSentToSentry = useCallback(() => {
        const transaction = normal_transaction
        console.log('handleSentToSentry', transaction)
        if (transaction) {
            transaction.finishTransaction()
        }
    }, [])

    const throwError = useCallback(() => {
        throw new Error('sentry test error')
    }, [])

    const initComponent = useCallback(() => {
        const transaction = normal_transaction.startTransaction()
        Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
        const span = transaction.startChild({
            op: 'init',
            description: `init component`,
          });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // do something
                span.finish()
                resolve(true)
            }, 2000)
        })
    }, [])

    const testCorsFetch = useCallback(() => {
        fetch('https://cors-anywhere.herokuapp.com/')
          .then(data => {
            console.log('zyc success', data)
            if (!data.ok) {
                // 收集跨域错误  
                console.log('zyc error cors', data)
            }
          })
          .catch(error => console.error('zyc error', error));
    }, [])

    const testCorsXHR = useCallback(() => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://cors-anywhere.herokuapp.com/');

        xhr.onload = function() {
            console.log(xhr.status);  // 200,如果允许跨域
            console.log(xhr.response);
        }

        xhr.onerror = function() {
            console.log('跨域失败');
        }

        xhr.onloadend = function() {
            console.log('请求结束', xhr.status);  
            if (xhr.status === 0) {
                console.log('zyc xhr cors')
            }
        }

        xhr.send();
    }, [])

    useEffect(() => {
        const handleCrossOriginError = (error) => {
          console.log('handleCrossOriginError', error)
        }
        window.onunhandledrejection = function(e) {
            // 收集跨域 Promise 错误
            handleCrossOriginError(e.reason); 
        }
        
        window.onerror = function(message, source, lineno, colno, error) {
        // 收集未处理的异步错误(可能跨域错误)
            handleCrossOriginError(error); 
        }
        // initComponent()
    }, [])

	return (
		<div className={styles.container} style={{fontFamily: 'PingFang SC,"微软雅黑",Arial'}}>
            <ErrorBoundaryTest id={1}>
                <Button loading={loading} onClick={handleClick}>Sent Request</Button>
                <Button onClick={handleSentToSentry}>Sent To Sentry</Button>
                <Button onClick={throwError}>Throw Error</Button>
                <Button onClick={displayErrorItem}>Display Error Item</Button>
                <Button onClick={displaySubErrorItem}>Display Sub Error Item</Button>
                <Button onClick={testCorsFetch}>Test Fetch CORS</Button>
                <Button onClick={testCorsXHR}>Test XHR CORS</Button>
                <IndexDBTest />
                {
                    subErrorItemDisplay ? <ErrorBoundaryTest id={2}>
                        <ErrorItem />
                    </ErrorBoundaryTest> : null
                }
                {/* <MemoryLeakComponent /> */}
            </ErrorBoundaryTest>
            {
              errorItemDisplay ? <ErrorItem /> : null
            }
		</div>
	)
}

export default SentryTest

