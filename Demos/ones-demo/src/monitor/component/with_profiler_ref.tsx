import React, { forwardRef } from 'react';
import { Profiler } from '@sentry/react';
import hoistNonReactStatics from 'hoist-non-react-statics';

const UNKNOWN_COMPONENT = 'unknown';

interface Options {
  name: string;
  includeRender: boolean;
  includeUpdates: boolean;
}

// 因为官方不支持 forwardRef，所以我们自己实现一个
function withProfilerRef(WrappedComponent: React.ComponentType, options?: Options) {
  const componentDisplayName =
    options?.name || WrappedComponent.displayName || WrappedComponent.name || UNKNOWN_COMPONENT;

  const Wrapped = (props, ref) => (
    <Profiler
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...options}
      name={componentDisplayName}
      updateProps={props}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <WrappedComponent ref={ref} {...props} />
    </Profiler>
  );

  Wrapped.displayName = `profiler(${componentDisplayName})`;

  hoistNonReactStatics(Wrapped, WrappedComponent);

  return forwardRef(Wrapped);
}

export default withProfilerRef;
