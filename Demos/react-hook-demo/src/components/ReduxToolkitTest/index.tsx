import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import memoize from 'proxy-memoize';
import styles from './index.module.scss';
import { useAppDispatch } from '../../store';
import { AppState } from '../../store/index';
import { ILoading, SetTestDataAction, SetTestDataArrAction } from '../../store/application/slice';
import { ITestData } from '../../store/application/slice';

/**
 * Reference: https://github.com/dai-shi/proxy-memoize#usage-with-react-redux
 */

interface Props { }

const HelloWorld: React.FunctionComponent<Props> = (props) => {
	const dispatch = useAppDispatch()
	const loading = useSelector<AppState, ILoading>(state => state.application.loading)
	const testData = useSelector<AppState, ITestData>(state => state.application.testData)

	useEffect(() => {
		console.log('testData obj change')
	}, [testData.obj])

	useEffect(() => {
		console.log('testData arr change')
	}, [testData.arr])

	useEffect(() => {
		console.log('testData change')
	}, [testData])


	/**
	 * 测试 reselector
	 */
	const makeSumSelector = createSelector<any, number>(
		[state => state.application.testData],
		(testData) => {
			return testData.obj.value1 + testData.obj.value2 + testData.obj.value3
		},
	);
	const sumSelector = useSelector<AppState, number>(makeSumSelector)

	const makeSumSelector1 = createSelector<any, number>(
		[state => state.application.testData.obj.value1, state => state.application.testData.obj.value2, state => state.application.testData.obj.value3],
		(value1, value2, value3) => {
			return value1 + value2 + value3
		},
	);
	const sumSelector1 = useSelector<AppState, number>(makeSumSelector1)


	const makeSumSelector2 = createSelector<any, number>(
		[state => state.application.testData.obj.value1 + state.application.testData.obj.value2 + state.application.testData.obj.value3],
		(sum) => {
			return sum
		},
	);
	const sumSelector2 = useSelector<AppState, number>(makeSumSelector2)

	useEffect(() => {
		console.log('sumSelector change', sumSelector)
	}, [sumSelector])

	useEffect(() => {
		console.log('sumSelector1 change', sumSelector1)
	}, [sumSelector1])

	useEffect(() => {
		console.log('sumSelector2 change', sumSelector2)
	}, [sumSelector2])


	const makeSumArrSelector3 = createSelector<any, number>(
		[state => state.application.testData.arr],
		(arr) => {
			return arr.reduce((acc, item) => acc + item.value, 0)
		},
	);
	const sumArrSelector3 = useSelector<AppState, number>(makeSumArrSelector3)


	useEffect(() => {
		console.log('sumArrSelector3 change', sumArrSelector3)
	}, [sumArrSelector3])



	const makeSumArrSelector4 = createSelector<any, number>(
		[state => state.application.testData.arr],
		(arr) => {
			return arr.map(item => item.value)
		},
	);
	const sumArrSelector4 = useSelector<AppState, number>(makeSumArrSelector4)

	useEffect(() => {
		console.log('sumArrSelector4 change', sumArrSelector4)
	}, [sumArrSelector4])

	/**
	 * 测试 proxy-memoize
	 */
	const makeSunMemoize = memoize<AppState, any>(
		state => {
			return state.application.testData.obj.value1 + state.application.testData.obj.value2 + state.application.testData.obj.value3
		}
	);
	const sumMemoize = useSelector<AppState, number>(makeSunMemoize)

	const makeSunMemoize1 = memoize<AppState, any>(
		state => {
			return state.application.testData.arr.reduce((acc, item) => acc + item.value, 0)
		}
	);
	const sumMemoize1 = useSelector<AppState, number>(makeSunMemoize1)

	const makeSunMemoize2 = memoize<AppState, any>(
		state => {
			return state.application.testData.arr.map(item => item.value)
		}
	);
	const sumMemoize2 = useSelector<AppState, number>(makeSunMemoize2)

	useEffect(() => {
		console.log('sumMemoize change', sumMemoize)
	}, [sumMemoize])

	useEffect(() => {
		console.log('sumMemoize1 change', sumMemoize1)
	}, [sumMemoize1])


	useEffect(() => {
		console.log('sumMemoize2 change', sumMemoize2)
	}, [sumMemoize2])


	const setTestData = useCallback(() => {
		// dispatch(SetTestDataAction({
		// 	...testData,
		// 	obj: {
		// 		...testData.obj,
		// 		value1: 4
		// 	},
		// 	// arr: testData.arr.map(item => ({...item, isVaild: !item.isVaild}))
		// }))

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
