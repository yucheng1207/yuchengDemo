import React from 'react';
import withProfilerRef from './with_profiler_ref';
import nameMap from './while_list';

/**
 * 组件性能监控，通过 displayName + 白名单来实现。
 *
 * 为什么使用白名单？
 * 1 避免可能存在的风险。因为有 displayName 的组件很多，导致影响范围太大，风险不好控制。比如有些组件依赖了 children 组件的层级，如果因为 HOC 多了一层组件，会导致逻辑判断不对。比如 Menu Select。
 * 2 避免全部监控。全部监控可能有性能消耗。所以只监控关键组件。
 *
 * 于是增加白名单，需要严格评估过。
 */

function initComponent() {
  // 被监控的组件只需要 withProfilerRef 一次。这里做个缓存
  const profileTypeMap = new WeakMap();
  function getProfileType(origType, options) {
    // 获取 withProfilerRef
    if (!profileTypeMap.get(origType)) {
      profileTypeMap.set(origType, withProfilerRef(origType, options));
    }
    return profileTypeMap.get(origType);
  }

  const origCreateElement = React.createElement;
  const customCreateElement = function (origType, ...rest) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const isComponentInProfiler = rest?.[0]?.__in_sentry_profiler;
      if (!isComponentInProfiler) {
        const { displayName } = origType;
        if (displayName && nameMap[displayName]) {
          const element = origCreateElement.apply(React, [
            getProfileType(origType, nameMap[displayName] === true ? {} : nameMap[displayName]),
            {
              __in_sentry_profiler: true,
              ...rest[0],
            },
            ...rest.slice(1),
          ]);
          return element;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    const element = origCreateElement.apply(React, [origType, ...rest]);
    return element;
  };

  React.createElement = customCreateElement as any;
}

export { initComponent };
