import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 以 props 的方式加载动态模块，确保动态模块加载完成后再去渲染父组件
 * 正常一个父组件动态加载一个模块时，父组件的componentDidMount会先被触发，使用这个HOC可以等动态模块加载完成后再去触发其生命周期
 * @param ParentComponent - 父组件
 * @param getDynamicModules - 获取动态模块的方法
 * @returns
 */
export default function withDynamicModulesHOC<T>(
  ParentComponent: React.FunctionComponent<T>,
  getDynamicModules: () => Promise<{ [key: string]: any }>
) {
  return function Component(props: T) {
    const modulesRef = useRef<{ [key: string]: any }>();
    const [visible, setVisible] = useState(false);
    const initComponent = useCallback(async () => {
      setVisible(false);
      modulesRef.current = await getDynamicModules();
      setVisible(true);
    }, []);

    useEffect(() => {
      initComponent();
    }, []);

    return visible && modulesRef.current ? (
      <ParentComponent {...props} dynamicModules={modulesRef.current} />
    ) : null;
  };
}
