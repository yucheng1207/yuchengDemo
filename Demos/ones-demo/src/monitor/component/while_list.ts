// 相关文档 https://docs.sentry.io/platforms/javascript/guides/react/features/component-tracking/
// sentry 默认配置 { disabled: false, includeRender: true, includeUpdates: true }

// 常规下请把 includeUpdates 设置为 false。如果认为需要记录 includeUpdates，可以设置为 true。
// 因为 includeUpdates 会产生性能问题。1 update 高的组件会记录很多次。2 update 会记录 props。

const nameMap = {
  TableList: { includeUpdates: false },
  LeftNavAdvance: true,
  AsyncUserDropdownBase: true,
  AsyncUserSelectBase: true,
  UserSelect: true,
  WithAsyncUsersBySearchComponent: true,
};

export default nameMap;
