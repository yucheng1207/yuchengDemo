
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@ones-design/core';
import * as Sentry from "@sentry/react";
import { SpanStatus, SpanStatusType } from '@sentry/tracing';

const transaction2 = Sentry.startTransaction({ name: "SentryTest 测试2" });
// const span = transaction.startChild({ op: "functionX" });

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

class ErrorBoundary extends React.Component<any, any> {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // 更新 state 使下一次渲染能够显示降级后的 UI
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // 你同样可以将错误日志上报给服务器
      console.log('zyc componentDidCatch', this.props.id, error, errorInfo)
    }
  
    render() {
      if (this.state.hasError) {
        // 你可以自定义降级后的 UI 并渲染
        return <h1>Something went wrong.{this.props.id}</h1>;
      }
  
      return this.props.children; 
    }
  }

class Item extends React.Component {
    componentDidMount(): void {
        
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log('componentDidCatch', error)
    }
    render(): React.ReactNode {
        throw new Error('render error')
        return <div>Item</div>
    }
}

const SentryTest: React.FunctionComponent<{}> = function (props) {
	const [loading, setLoading] = useState(false)
    const [showItem, setShowItem] = useState(false)
    const displayItem = useCallback(() => {
        setShowItem(!showItem)
    }, [showItem])
	const handleClick = useCallback(async () => {
		setLoading(true)
        const params = { name: 'zyc' }
        const transaction = Sentry.getCurrentHub()?.getScope()?.getTransaction()
        if (transaction) {
            console.log('transaction', transaction)
            if (transaction) {
                const span = transaction.startChild({
                    op: 'click',
                    description: 'handle click event',
                    data: { params },
                })
                const subSpan = span.startChild({
                    op: 'subClick',
                    description: 'handle sub click event',
                    data: { params },
                })
                await mockRequest(params)
                subSpan.finish()
                span.finish()
                setLoading(false)
            }
        }
	}, [])

    const handleSentToSentry = useCallback(() => {
        const transaction = Sentry.getCurrentHub().getScope().getTransaction()
        console.log('handleSentToSentry', transaction, transaction2)
        if (transaction) {
            transaction.finish()
        }
        if (transaction2) {
            transaction2.finish()
        }
    }, [])

    const throwError = useCallback(() => {
        throw new Error('zyc error')
    }, [])

    const initComponent = useCallback(() => {
        const transaction = Sentry.startTransaction({ name: "SentryTest 测试" });
        Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
        const span = transaction.startChild({
            op: 'init',
            description: `init component`,
          });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // do something
                // span.setStatus(SpanStatus.Ok);
                span.finish()
                // transaction.finish()
                Sentry.startTransaction({ name: "SentryTest 测试3" });
                resolve(true)
            }, 2000)
        })
    }, [])

    const testCorsFetch = useCallback(() => {
        console.log('zyc do fetch')
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

    const handleCrossOriginError = useCallback((error) => {
        console.log('zyc error', error)
    }, [])

    useEffect(() => {
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
		<div style={{fontFamily: 'PingFang SC,"微软雅黑",Arial'}}>
            <ErrorBoundary id={1}>
                <Button loading={loading} onClick={handleClick}>Sent Request</Button>
                <Button onClick={handleSentToSentry}>Sent To Sentry</Button>
                <Button onClick={throwError}>Throw Error</Button>
                <Button onClick={displayItem}>Show Item</Button>
                <Button onClick={testCorsFetch}>Test Fetch CORS</Button>
                <Button onClick={testCorsXHR}>Test XHR CORS</Button>
                {
                    showItem ? <ErrorBoundary id={2}>
                        <Item />
                    </ErrorBoundary> : null
                }
            </ErrorBoundary>
		</div>
	)
}

export default SentryTest

