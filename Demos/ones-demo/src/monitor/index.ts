import {
    init as sentryInit,
    Integrations,
    reactRouterV5Instrumentation,
    setUser,
    makeBrowserOfflineTransport,
    makeFetchTransport,
} from '@sentry/react';
import { BrowserTracing } from "@sentry/tracing";
import { initErrorCollector, ErrorBoundary } from "./error";
import { initPage } from './page';
import { initRequest } from './request';
import { initRequestHeaders } from './request_headers';
import { initFrame } from './frame';
import { initComponent } from './component';
import { perfMonitorEvents, perfMonitorEventType } from './event';
import { generateTransactionInstance } from './instance';

const isProduction = process.env.NODE_ENV === 'production';

const shouldCreateSpanForRequest = (url: string) => {
    return true;
};

function setInfo() {
    perfMonitorEvents.addListener(perfMonitorEventType.USER, (user) => {
      setUser(user);
    });
}

/**
 * 初始化 Sentry
 */
const initSentry = (config: {
    dsn: string;
    tracesSampleRate: number;
    sampleRate: number;
    history: any;
    version?: string;
}) => {
    try {
        const { dsn, history, tracesSampleRate, sampleRate, version = '' } = config;
        if (!dsn) return;
        console.log('init sentry', config)

        initPage();

        initRequest({
            shouldCreateSpanForRequest,
        });

        initRequestHeaders();

        initFrame();

        initComponent();

        sentryInit({
            dsn,
            transport: makeBrowserOfflineTransport(makeFetchTransport),
            integrations: [
              new BrowserTracing({
                tracePropagationTargets: ['*'],
                routingInstrumentation: reactRouterV5Instrumentation(history),
                shouldCreateSpanForRequest,
              }),
              // 默认的 Breadcrumbs 拦截了 console，使得通过 console 排查问题变得困难。其次 breadcrumbs 的 console 能力用处不大。
              // 于是禁用，只开放生产环境。
              new Integrations.Breadcrumbs({
                console: isProduction,
              }),
            ],
            release: version,
            environment: process.env.NODE_ENV,
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate,
            sampleRate,
        });

        setInfo();

        initErrorCollector();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Sentry error: 初始化失败', error);
    }
};
  
const initMonitor = initSentry;

export { initMonitor, ErrorBoundary, generateTransactionInstance };