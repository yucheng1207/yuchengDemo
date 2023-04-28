import React from 'react';
import { Route, matchPath } from 'react-router';

// 记录当前匹配的 path
let currentPath = '';

function proxyRoute() {
  const origCreateElement = React.createElement;

  function customCreateElement(origType, ...rest) {
    // 非常重要，try catch 保护好
    try {
      // 记录当前的 path
      if (origType === Route) {
        const computedMatch = rest[0]?.computedMatch;
        if (computedMatch?.isExact) {
          currentPath = computedMatch.path;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    return origCreateElement.apply(React, [origType, ...rest]);
  }

  React.createElement = customCreateElement as any;
}

function isCrossDomainRequest(url: string) {
  return url.startsWith('http') && !url.startsWith(window.location.origin);
}

function getFetchUrl(fetchArgs: any[] = []): string {
  if (typeof fetchArgs[0] === 'string') {
    return fetchArgs[0];
  }
  if (window.Request && fetchArgs[0] instanceof window.Request) {
    return fetchArgs[0].url;
  }
  return String(fetchArgs[0]);
}

function proxyFetch(getHeaders) {
  const origFetch = window.fetch as any;

  function customFetch(...args: any[]) {
    // 非常重要，try catch 保护好
    try {
      const url = getFetchUrl(args);
      if (!isCrossDomainRequest(url)) {
        const headers = getHeaders();
        const newArgs = [...args];
        headers.forEach((header) => {
          if (args[1]) {
            newArgs[1].headers = newArgs[1].headers || {};
            newArgs[1].headers[header.key] = header.value;
          }
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    return origFetch.apply(window, args);
  }

  window.fetch = customFetch;
}

function proxyXHR(getHeaders) {
  const origOpen = window.XMLHttpRequest.prototype.open as any;
  const origSend = window.XMLHttpRequest.prototype.send as any;

  function customOpen(...args) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const request = this;
    // 非常重要，try catch 保护好
    try {
      // eslint-disable-next-line no-underscore-dangle
      request.__ones_xhr_url__ = args[1];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    return origOpen.apply(request, args);
  }

  function customSend(...args) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const request = this;
    // 非常重要，try catch 保护好
    try {
      // eslint-disable-next-line no-underscore-dangle
      if (!isCrossDomainRequest(request.__ones_xhr_url__)) {
        const headers = getHeaders();
        headers.forEach((header) => {
          request.setRequestHeader(header.key, header.value);
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    return origSend.apply(request, args);
  }

  window.XMLHttpRequest.prototype.open = customOpen;
  window.XMLHttpRequest.prototype.send = customSend;
}

function doGetHeaders() {
  const headers: { key: string; value: string }[] = [];
  const hash = window.location.hash || '';
  const page = hash.slice(1);

  headers.push({
    key: 'ONES-Monitor-Url',
    value: page,
  });

  // 地址栏存在 url，且 Route 还没渲染之前，是没法获得 currentPath。此时不上报 path
  if (currentPath) {
    // 存在可能切换路由发的请求和 url 不一致的，做多层匹配，确保 currentPath 的正确性。
    const match = matchPath(page, {
      path: currentPath,
      // 完全匹配
      exact: true,
      strict: false,
    });
    if (match) {
      headers.push({
        key: 'ONES-Monitor-Path',
        value: currentPath,
      });
    }
  }

  return headers;
}

export function initRequestHeaders() {
  proxyRoute();
  proxyFetch(doGetHeaders);
  proxyXHR(doGetHeaders);
}
