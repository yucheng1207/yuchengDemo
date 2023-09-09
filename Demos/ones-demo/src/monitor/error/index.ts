import { captureException, ErrorBoundary } from '@sentry/react';

/**
 * 通过 window.addEventListener 收集资源加载错误
 */
const collectResourceLoadError = () => {
  window.addEventListener(
    'error',
    (event) => {
      try {
        const target = event.target;
        // 捕获下载CSS资源失败错误
        if (target && target instanceof HTMLElement && ['LINK', 'SCRIPT', 'IMG'].indexOf(target.nodeName) !== -1) {
          // @ts-ignore
          const src = target.src || target.href;
          if (src) {
            captureException(new Error(`Loading ${src} failed.`));
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('window addEventListener error:', err);
      }
    },
    true
  );
}

/**
 * 通过 service worker 收集网络崩溃错误
 */
const collectWebCrashError = () => {
    if (navigator.serviceWorker.controller !== null) {
        const HEARTBEAT_INTERVAL = 5 * 1000; // 每五秒发一次心跳
        const sessionId = new Date().getTime();
        const heartbeat = function () {
            if (navigator?.serviceWorker?.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'heartbeat',
                    id: sessionId,
                    data: {} // 附加信息，如果页面 crash，上报的附加数据
                });
            }
        }
        window.addEventListener("beforeunload", () => {
            if (navigator?.serviceWorker?.controller) {
                console.log('zyc serviceWorker info:', window.location.href)
                navigator.serviceWorker.controller.postMessage({
                    type: 'heartbeat',
                    id: sessionId,
                    data: {} // 附加信息，如果页面 crash，上报的附加数据
                });
            }
        });
        setInterval(heartbeat, HEARTBEAT_INTERVAL);
        heartbeat();
    }
}

export const initErrorCollector = () => {
    collectResourceLoadError();
    collectWebCrashError();
};

export { ErrorBoundary }
