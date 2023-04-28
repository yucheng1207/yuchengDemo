import { addInstrumentationHandler } from '@sentry/utils';
import type { XHRData, FetchData } from '@sentry/tracing/types/browser/request';
import type { SpanStatusType } from '@sentry/tracing';
import urlJoin from 'url-join';
import { requestTransactionInstance } from './instance';
import { perfMonitorEvents, perfMonitorEventType } from './event';
import { filterLeadingSlash, extractQueryInUrl, replaceStartStringWithPrefix } from './utils';

interface IFetchData extends FetchData {
  fetchData?: {
    method: string;
    url: string;
    __span?: string;
    __span_ones?: string;
  };
}

interface IXHRData extends XHRData {
  xhr?: {
    __sentry_xhr__?: {
      method: string;
      url: string;
      status_code: number;
      data: Record<string, any>;
    };
    __sentry_xhr_span_id__?: string; // 供 @sentry/tracing（BrowserTracing）使用，主要用于缓存 spanId ，其他地方不应该使用该字段
    __sentry_xhr_span_id_ones__?: string; // 参考 @sentry/tracing（BrowserTracing）方案新增了”__sentry_xhr_span_id_ones__“字段
    setRequestHeader?: (key: string, val: string) => void;
    getRequestHeader?: (key: string) => string;
    __sentry_own_request__?: boolean;
  };
}

const parametricMap = {};
const setParametricMap = (originKey: string, originValue: string) => {
  let key = originKey;
  let value = originValue;

  // 统一格式，去掉开头的“/”
  key = filterLeadingSlash(key);
  value = filterLeadingSlash(value);

  // 过滤掉 query 参数
  key = extractQueryInUrl(key).urlWithoutSearch;
  value = extractQueryInUrl(value).urlWithoutSearch;

  // 使用 url-join 格式化 key 和 value，处理多个/的情况，如 api/project//bbb
  key = urlJoin(key);
  value = urlJoin(value);

  parametricMap[key] = value;
};

/**
 * 初始化性能监控事件
 */
const initPerfMonitorEvent = () => {
  // 通过监听 collectParameterizedUrl 事件来收集需要参数化的url
  // data.key: 值为原始url，如 user/123456/info；data.value：值为参数化url，如 user/{0}/info
  perfMonitorEvents.addListener(
    perfMonitorEventType.COLLECT_PARAMETERIZED_URL,
    (data: { key: string; value: string }) => {
      try {
        const { key, value } = data;
        setParametricMap(key, value);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Performance Monitor collectParameterizedUrl event error:', error);
      }
    }
  );
};

const prefixConfig = [
  {
    matchStr: 'api/project/team/',
    prefix: 'api/project/team/:teamUUID',
  },
  {
    matchStr: 'api/project/organization/',
    prefix: 'api/project/organization/:orgUUID',
  },
  {
    matchStr: 'api/wiki/team/',
    prefix: 'api/wiki/team/:teamUUID',
  },
];

/**
 * 用于处理一些未参数化的接口
 * 有些接口是开放平台调用的，在当前工程无法参数化，这里通过设置白名单来参数化
 */
const whitelist = [
  {
    reg: /api\/project\/team\/\w{1,}\/project\/task\/\w{1,}\/init\/condition/,
    display: 'api/project/team/:teamUUID/project/task/{0}/init/condition',
  },
  {
    reg: /api\/project\/team\/\w{1,}\/project\/\w{1,}\/stamps\/data/,
    display: 'api/project/team/:teamUUID/project/{0}/stamps/data',
  },
];

/**
 * 通过匹配 parametricMap 中的值来 参数化 pathname， 如将 "api/project/team/XpAw8kgp/user/RDjYMhKq" 转化成 "api/project/team/:teamUUID/user/:uuid"
 * @param pathname
 * @returns 参数化后的 pathname
 */
const parameterizePath = (pathname: string) => {
  // 获取 parametricMapKey（去掉 url 开头部分字段，以便在 parametricMap 找到匹配的值）
  let currPrefix = '';
  let parametricMapKey = pathname;
  let result = pathname;
  for (const item of prefixConfig) {
    if (pathname.startsWith(item.matchStr)) {
      // 匹配到 prefixConfig 中的值，使用 replaceStartStringWithPrefix 替换相应的字符串
      const { pathname: processedStr, remainingStr } = replaceStartStringWithPrefix(
        pathname,
        item.prefix
      );
      result = processedStr; // 参数化 teamUUID 或 orgUUID
      parametricMapKey = remainingStr;
      currPrefix = item.prefix;
      break;
    }
  }

  // 有些接口是开放平台调用的，在当前工程无法参数化，这里通过设置白名单来参数化
  if (parametricMap[parametricMapKey]) {
    // parametricMap 中找到对应的值，该值为参数化后的string
    return `${currPrefix}/${parametricMap[parametricMapKey]}`;
  }

  // 有些接口是开放平台调用的，在当前工程无法参数化，这里通过设置白名单来参数化
  for (const item of whitelist) {
    if (item.reg.test(pathname)) {
      result = item.display;
      break;
    }
  }

  return result;
};

/**
 * 获取 Span 名称，该名称为 参数化后的url："api/project/team/AeqzcFqX" -> "api/project/team/:teamUUID"
 * @param url
 * @returns span name（值为参数化后的pathname）
 */
const getRequestSpanName = (url: string) => {
  const isProjectUrl = url.includes('api/project');
  const isWikiUrl = url.includes('api/wiki');

  // 处理 project 或 wiki 请求
  if (isProjectUrl || isWikiUrl) {
    // 获取 url path 和 query
    const { urlWithoutSearch, search } = extractQueryInUrl(url);
    let pathname = urlWithoutSearch;

    // 获取 “api/“ 后及以后的字符串 */
    if (isProjectUrl) {
      pathname = pathname.substring(pathname.indexOf('api/project'));
    } else if (isWikiUrl) {
      pathname = pathname.substring(pathname.indexOf('api/wiki'));
    }

    // 参数化 pathname
    const parameterizedPathname = parameterizePath(pathname);

    const isGraphqlUrl = /\/graphql$/.test(pathname);
    const isStampUrl = /\/stamps\/data$/.test(pathname);
    // graphql 接口和 stamp 接口保留 query 参数
    if (isGraphqlUrl || isStampUrl) {
      return `${parameterizedPathname}${search}`;
    }

    return parameterizedPathname;
  }

  return url;
};

/**
 * Create and track fetch request spans
 * Reference：@sentry/tracing/src/browser/request instrumentOutgoingRequests
 */
function fetchCallback(handlerData: IFetchData, shouldCreateSpan: (url: string) => boolean): void {
  if (!(handlerData.fetchData && shouldCreateSpan(handlerData.fetchData.url))) {
    return;
  }

  if (handlerData.endTimestamp) {
    // eslint-disable-next-line no-underscore-dangle
    const spanId = handlerData.fetchData.__span_ones;
    if (!spanId) return;

    const data: {
      httpStatus?: number;
      spanStatus?: SpanStatusType;
    } = {};
    if (handlerData.response) {
      data.httpStatus = handlerData.response.status;
    } else if (handlerData.error) {
      data.spanStatus = 'internal_error';
    }
    requestTransactionInstance.finishSpan({ spanId, data });
    return;
  }

  // if not, create a new span to track it
  const span = requestTransactionInstance.startSpan({
    name: getRequestSpanName(handlerData.fetchData.url),
    data: {
      ...handlerData.fetchData,
      type: 'fetch',
      method: handlerData.fetchData.method,
      url: handlerData.fetchData.url,
    },
  });

  // 参考 @sentry/tracing（BrowserTracing）使用 __span_ones 来缓存 spanId，以便接口完成触发回调时可以从 __span_ones 获取到 spanId
  // 直接对 handlerData.fetchData.__span_ones 赋值不是个好的方案，暂时没想到好的办法，先这么处理
  // eslint-disable-next-line no-underscore-dangle, no-param-reassign
  handlerData.fetchData.__span_ones = span.spanId;
}

/**
 * Create and track xhr request spans
 * Reference：@sentry/tracing/src/browser/request instrumentOutgoingRequests
 */
function xhrCallback(handlerData: IXHRData, shouldCreateSpan: (url: string) => boolean): void {
  // eslint-disable-next-line no-underscore-dangle
  if (!(handlerData.xhr?.__sentry_xhr__ && shouldCreateSpan(handlerData.xhr.__sentry_xhr__.url))) {
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  const xhr = handlerData.xhr.__sentry_xhr__;

  // check first if the request has finished and is tracked by an existing span which should now end
  if (handlerData.endTimestamp) {
    // eslint-disable-next-line no-underscore-dangle
    const spanId = handlerData.xhr.__sentry_xhr_span_id_ones__;
    if (!spanId) return;

    requestTransactionInstance.finishSpan({
      spanId,
      data: {
        httpStatus: xhr.status_code,
      },
    });
    return;
  }

  // if not, create a new span to track it
  const span = requestTransactionInstance.startSpan({
    name: getRequestSpanName(xhr.url),
    data: {
      ...xhr.data,
      type: 'xhr',
      method: xhr.method,
      url: xhr.url,
      locationHref: window.location.href,
    },
  });

  // 参考 @sentry/tracing（BrowserTracing）使用 __sentry_xhr_span_id_ones__ 来缓存 spanId，以便接口完成触发回调时可以从 __sentry_xhr_span_id_ones__ 获取到 spanId
  // 直接对 handlerData.xhr.__sentry_xhr_span_id_ones__ 赋值不是个好的方案，暂时没想到好的办法，先这么处理
  // eslint-disable-next-line no-underscore-dangle, no-param-reassign
  handlerData.xhr.__sentry_xhr_span_id_ones__ = span.spanId;
}

/**
 * 初始化 Request，通过 addInstrumentationHandler 监控 fetch、xhr 请求
 * Reference：@sentry/tracing/src/browser/request instrumentOutgoingRequests
 * @param options
 */
export const initRequest = (options: { shouldCreateSpanForRequest?(url: string): boolean }) => {
  initPerfMonitorEvent();

  const { shouldCreateSpanForRequest } = options;
  const shouldCreateSpan =
    typeof shouldCreateSpanForRequest === 'function' ? shouldCreateSpanForRequest : () => true;

  addInstrumentationHandler('fetch', (handlerData: IFetchData) => {
    try {
      fetchCallback(handlerData, shouldCreateSpan);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('preference monitor error:', error);
    }
  });

  addInstrumentationHandler('xhr', (handlerData: IXHRData) => {
    try {
      xhrCallback(handlerData, shouldCreateSpan);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('preference monitor error:', error);
    }
  });
};
