import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import memoize from 'proxy-memoize';
import styles from './index.module.scss';
import { useAppDispatch } from '../../store';
import { AppState } from '../../store/index';
import { ILoading, SetTestDataAction, SetTestDataArrAction } from '../../store/application/slice';
import { ITestData } from '../../store/application/slice';

interface Props { }

/**
 * 测试 reselector
 * 原理：提取值变化时才会重新计算，提取值没有改变不会出发重新计算
 * 下面的 createSelector 如果写在组件中要使用 useCallback 包裹住，不然重复 createSelector 会出问题
 */

// 单个参数使用示例
const makeSingleSelector = createSelector<any, number>(
	[state => state.application.testData.obj.value1],
	(value1) => {
		// 提取值不变，所以这里不会一直计算
		console.log('makeSingleSelector', value1)
		return value1 * 2
	},
);

// 错误示例 单个参数使用示例
const makeSingleSumSelector = createSelector<any, number>(
	[state => state.application.testData],
	(testData) => {
		// testData 变化这里就会重复计算，但是由于计算值是一个number，所以相应的useEffect不会一直触发
		console.log('makeSingleSumSelector', testData)
		return testData.obj.value1 + testData.obj.value2 + testData.obj.value3
	},
);

/**
 * 错误示例：state => ([]) 或者 state => (state)都会导致 selector 不断被执行，无效的 selector
 * state => ([])：每次都会返回一个新的空数组
 * state => (state)：每次都会返回 state，而 state 是不稳定的
 * 同理：extracted values改变selector才会重新计算，所以extracted values不能返回一个不稳定的值，如 state、[]、使用数组map返回的新数组、function等
 */
const makeInvalidSelector = createSelector<any, number>(
	[state => (state)], // [state => ([])],
	(data) => {
		console.log('makeInvalidSelector', data)
		return data
	},
);

// 多个参数使用示例
const makeMultipleSelector = createSelector<any, number>(
	[state => state.application.testData.obj.value1, state => state.application.testData.obj.value2, state => state.application.testData.obj.value3],
	(value1, value2, value3) => {
		// 提取值不变，所以这里不会一直计算
		console.log('makeMultipleSelector', value1, value2, value3)
		return value1 + value2 + value3
	},
);

//
const makeSumArrSelector = createSelector<any, number>(
	[state => state.application.testData.arr],
	(arr) => {
		// arr 改变了这里就会重新计算
		console.log('makeSumArrSelector', arr)
		return arr.reduce((acc, item) => acc + item.value, 0)
	},
);

// 这种用法一定一定要注意不要重复执行 createCustomSelector ！！！！
const createCustomSelector = (text) => createSelector<any, string>(
	[state => state.application.testData.obj.value1],
	(value1) => {
		// arr 改变了这里就会重新计算
		console.log('createCustomSelector', text, value1)
		return `${text}${value1}`
	}
)

// 错误用法！！！！createCustomSelector会被一直创建！！！！
const createCustomErrorSelector = createSelector<any, string>([() => createCustomSelector('example')], (getter) => {
	console.log('createCustomErrorSelector', getter)
	return 'error'
})
// 正确用法
const createCustomRightSelector = createSelector<any, string>([(state) => createCustomSelector('example')(state)], (data) => {
	console.log('createCustomRightSelector', data)
	return data
})

/**
 * 测试 proxy-memoize
 * Reference: https://github.com/dai-shi/proxy-memoize#usage-with-react-redux
 * 原理：会自动解析受影响的内容，只有受影响的内容发生改变才会重新计算，否则返回缓存
 * 下面的 memoize 如果写在组件中要使用 useCallback 包裹住，不然重复 memoize 会出问题
 */
 const makeSumMemoize = memoize<AppState, any>(
	state => {
		// 这里会自动解析受影响内容 state.application.testData.obj.value1、state.application.testData.obj.value2、state.application.testData.obj.value3，只有这三个值发生改变时才会重新计算
		console.log('makeSumMemoize')
		return state.application.testData.obj.value1 + state.application.testData.obj.value2 + state.application.testData.obj.value3
	}
);

const makeArraySumMemoize = memoize<AppState, any>(
	state => {
		return state.application.testData.arr.reduce((acc, item) => acc + item.value, 0)
	}
);

const makeArrayMapMemoize = memoize<AppState, any>(
	state => {
		return state.application.testData.arr.map(item => item.value)
	}
);


const HelloWorld: React.FunctionComponent<Props> = (props) => {
	const dispatch = useAppDispatch()
	const loading = useSelector<AppState, ILoading>(state => state.application.loading)
	const testData = useSelector<AppState, ITestData>(state => state.application.testData)
	const arrayData = useSelector<AppState, any[]>(state => {
		console.log('arrayData  state', state)
		return state.application.testData.arr.map((item, index) => ({index}))
	}, shallowEqual)

	useEffect(() => {
		console.log('arrayData', arrayData)
	}, [arrayData])

	useEffect(() => {
		console.log('testData obj change')
	}, [testData.obj])

	useEffect(() => {
		console.log('testData arr change')
	}, [testData.arr])

	useEffect(() => {
		console.log('testData change')
	}, [testData])


	/************************ 测试 reselector ************************/
	const singleSelector = useSelector<AppState, number>(makeSingleSelector)
	useEffect(() => {
		console.log('makeSingleSelector change', singleSelector)
	}, [singleSelector])

	// 只要 makeSingleSelector 依赖的值一样，可以重复使用，makeSingleSelector也不会重新创建
	const singleSelector2 = useSelector<AppState, number>((state) => makeSingleSelector(state))
	useEffect(() => {
		console.log('makeSingleSelector2 change', singleSelector2)
	}, [singleSelector2])

	// 只要 makeSingleSelector 依赖的值一样，可以重复使用，makeSingleSelector也不会重新创建
	const singleSelector3 = useSelector<AppState, number>((state) => makeSingleSelector({
		...state,
		application: {
			...state.application,
			testData: {
				...state.application.testData,
				obj: {
					...state.application.testData.obj,
					value5: 555
				}
			}
		},
		text: 1,
	}))
	useEffect(() => {
		console.log('makeSingleSelector3 change', singleSelector3)
	}, [singleSelector3])

	// 错误用法：makeSingleSelector 依赖的值不一样会触发重新创建
	const singleSelector4 = useSelector<AppState, number>((state) => makeSingleSelector({
		...state,
		application: {
			...state.application,
			testData: {
				...state.application.testData,
				obj: {
					...state.application.testData.obj,
					value1: 555 // makeSingleSelector依赖的值
				}
			}
		},
		text: 1,
	}))
	useEffect(() => {
		console.log('makeSingleSelector4 change', singleSelector4)
	}, [singleSelector4])
	console.log('makeSingleSelector value', singleSelector, singleSelector4)

	// // 错误用法：makeSingleSelector 依赖的值不一样会触发重新创建
	// const customState = useMemo(() => ({application: {testData: {obj: {value1: 8888}}}}), [])
	// const singleSelector5 = makeSingleSelector(customState)
	// useEffect(() => {
	// 	console.log('makeSingleSelector5 change', singleSelector5)
	// }, [singleSelector5])


	const singleSumSelector = useSelector<AppState, number>(makeSingleSumSelector)
	useEffect(() => {
		console.log('makeSingleSumSelector change', singleSumSelector)
	}, [singleSumSelector])

	const invalidSelector = useSelector<AppState, number>(makeInvalidSelector)
	useEffect(() => {
		console.log('makeInvalidSelector change', invalidSelector)
	}, [invalidSelector])

	const multipleSumSelector = useSelector<AppState, number>(makeMultipleSelector)
	useEffect(() => {
		console.log('makeMultipleSelector change', multipleSumSelector)
	}, [multipleSumSelector])

	const sumArrSelector = useSelector<AppState, number>(makeSumArrSelector)
	useEffect(() => {
		console.log('makeSumArrSelector change', sumArrSelector)
	}, [sumArrSelector])

	const customSelector = useMemo(() => createCustomSelector('value:'), [])
	const customText = useSelector<AppState, string>(customSelector)
	useEffect(() => {
		console.log('createCustomSelector change', customText)
	}, [customText])

	const customErrorText = useSelector<AppState, string>(createCustomErrorSelector)
	useEffect(() => {
		console.log('createCustomErrorSelector change', customErrorText)
	}, [customErrorText])

	const customRightText = useSelector<AppState, string>(createCustomRightSelector)
	useEffect(() => {
		console.log('createCustomRightSelector change', customRightText)
	}, [customRightText])


	/**
	 * 测试 proxy-memoize
	 */
	
	const sumMemoize = useSelector<AppState, number>(makeSumMemoize)
	useEffect(() => {
		console.log('makeSumMemoize change', sumMemoize)
	}, [sumMemoize])

	const arraySumMemoize = useSelector<AppState, number>(makeArraySumMemoize)
	useEffect(() => {
		console.log('makeArraySumMemoize change', arraySumMemoize)
	}, [arraySumMemoize])

	const arrayMapMemoize = useSelector<AppState, number>(makeArrayMapMemoize)
	useEffect(() => {
		console.log('makeArrayMapMemoize change', arrayMapMemoize)
	}, [arrayMapMemoize])


	const setTestData = useCallback(() => {
		// 改变 value1
		dispatch(SetTestDataAction({
			...testData,
			obj: {
				...testData.obj,
				// value1: testData?.obj?.value1 + 1
			},
			// arr: testData.arr.map(item => ({...item, isVaild: !item.isVaild}))
		}))

		// 改变 testData.arr
		dispatch(SetTestDataArrAction(testData.arr.map(item => ({...item, isVaild: !item.isVaild }))))
	}, [dispatch, testData])


	const sum = useMemo(() => {
		console.log('calc sum')
		return testData.obj.value1 + testData.obj.value2 + testData.obj.value3
	}, [testData.obj.value1, testData.obj.value2, testData.obj.value3])

	const sumArr = useMemo(() => {
		console.log('calc sum arr')
		return testData.arr.reduce((acc, item) => acc + item.value, 0)
	}, [testData.arr])

	return (
		<div className={styles.container}>
			<span>TEST</span>
			<span>{sum}</span>
			<span>{sumArr}</span>
			<button onClick={setTestData}>Set Test Data</button>
		</div>
	);
};

export default HelloWorld;
