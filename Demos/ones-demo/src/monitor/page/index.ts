import React from 'react';
import { Route } from 'react-router';
import { withSentryRouting } from '@sentry/react';
import { pageMap } from './map';
import type { TransactionEvent } from '@sentry/types';

const SentryRoute = withSentryRouting(Route);

/**
 * 将所有的 Route 替换成 SentryRoute
 */
const replaceRouteWithSentryRoute = () => {
  const origCreateElement = React.createElement;

  const customCreateElement = function (origType, ...rest) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const isRouteInSentryRoute = rest?.[0]?.__in_sentry_route;
      // @ts-ignore withSentryRouting 的问题，所以先屏蔽掉
      const isSentryRoute = origType.displayName === SentryRoute.displayName;

      // 如果是 Route 且没有被标记过才需要替换
      // 或者是 SentryRoute，则标记里面的 Route 不用替换
      if ((origType === Route && !isRouteInSentryRoute) || isSentryRoute) {
        // 怎么标记处理过的 Route？
        // 目前仅想到通过给 SentryRoute 传 props __in_sentry_route 从而传递给 Route ，以此来标记 Route 是否要被处理。
        const element = origCreateElement.apply(React, [
          SentryRoute,
          {
            __in_sentry_route: true,
            ...rest[0],
          },
          ...rest.slice(1),
        ]);
        return element;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    const element = origCreateElement.apply(React, [origType, ...rest]);
    return element;
  };
  React.createElement = customCreateElement as any;
};

function beforeSendTransaction(event: TransactionEvent) {
  try {
    const { transaction = '' } = event;

    // 如果是默认设置的页面名字才替换
    if (transaction.startsWith('/')) {
      const newName = pageMap[transaction];
      if (newName) {
        // 保留 transaction，方便做仪表盘的搜索用。会影响体验，但是问题不大。
        // eslint-disable-next-line no-param-reassign
        event.transaction = `Page ${newName} ${transaction}`;
      } else {
        // eslint-disable-next-line no-param-reassign
        event.transaction = `Page ${transaction}`;
      }
    }

    return event;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  return event;
}

const initPage = () => {
  replaceRouteWithSentryRoute();
};

export { initPage, beforeSendTransaction, SentryRoute };
