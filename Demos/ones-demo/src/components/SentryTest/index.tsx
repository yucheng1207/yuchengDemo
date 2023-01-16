
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

const SentryTest: React.FunctionComponent<{}> = function (props) {
	const [loading, setLoading] = useState(false)
	const handleClick = useCallback(async () => {
		setLoading(true)
        const params = { name: 'zyc' }
        const transaction = Sentry.getCurrentHub().getScope().getTransaction()
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

    useEffect(() => {
        initComponent()
    }, [])

	return (
		<div style={{fontFamily: 'PingFang SC,"微软雅黑",Arial'}}>
			<Button loading={loading} onClick={handleClick}>Sent Request</Button>
            <Button onClick={handleSentToSentry}>Sent To Sentry</Button>
		</div>
	)
}

export default SentryTest

