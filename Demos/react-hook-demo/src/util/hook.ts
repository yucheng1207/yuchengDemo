import React, { useRef, useState, useEffect, useCallback } from 'react';
/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * Idea stolen from: https://stackoverflow.com/a/55075818/1526448
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
export function useDidUpdateEffect(effect: React.EffectCallback, dependencies: React.DependencyList = []) {
	const isInitialMount = useRef(true);

	useEffect(() => {
	  if (isInitialMount.current) {
		isInitialMount.current = false;
	  } else {
		effect();
	  }
	}, dependencies);
}


export function useStableCallback(cb) {
	// 与 useCallback 没有实质区别，都依赖「渲染」重新构建 callback。
	// 但这样可以解决以下问题（然而这些情形本身就不应该存在。）
	// 1. 某些组件库所有API耦合在 props 上，导致匿名函数性能差。
	// 2. props 透传 callback 带来的性能问题。
	// 3. 某回答把 callback 作为 useEffect 的 deps 导致重复订阅的问题。
	const cbRef = useRef(cb);
	cbRef.current = cb;
	return useCallback((...args) => cbRef.current(...args), [])
}


export default function useMethods<T extends Record<string, (...args: any[]) => any>>(methods: T) {
  const { current } = React.useRef({
    methods,
    func: undefined as T | undefined,
  });
  current.methods = methods;

  // 只初始化一次
  if (!current.func) {
    const func = Object.create(null);
    Object.keys(methods).forEach((key) => {
      // 包裹 function 转发调用最新的 methods
      func[key] = (...args: unknown[]) => current.methods[key].call(current.methods, ...args);
    });
    // 返回给使用方的变量
    current.func = func;
  }

  return current.func as T;
}