import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import logo from './logo.svg';
import './App.css';
import store from './store/index';
import CodeSplittingTest from './components/CodeSplittingTest';
import JqueryTest from './components/JqueryTest';

enum TestName {
	CodeSplittingTest,
	EnumifyTest,
	HookTest2,
	ImportTest,
	ReduxTest,
	ReduxToolkitTest,
	RenderTest,
	JqueryTest,
	ReactBeautifulDndTest,
	MomentTest,
	ClassRenderTest,
}

const currentTestName: TestName = TestName.ReduxToolkitTest

/**
 * 这里都是要动态加载的组件
 */
async function getDynamicModule(type: TestName) {
	switch(type) {
		case TestName.EnumifyTest:
			return (await import(/* webpackChunkName: 'enumify-test' */ './components/EnumifyTest')).EnumifyTest
		case TestName.HookTest2:
			return (await import(/* webpackChunkName: 'hook-test2' */ './components/HookTest2')).default
		case TestName.ImportTest:
			return (await import(/* webpackChunkName: 'import-test' */ './components/ImportTest')).default
		case TestName.ReduxTest:
			return (await import(/* webpackChunkName: 'redux-test' */ './components/ReduxTest')).default
		case TestName.ReduxToolkitTest:
			return (await import(/* webpackChunkName: 'redux-toolkit-test' */ './components/ReduxToolkitTest')).default
		case TestName.RenderTest:
			return (await import(/* webpackChunkName: 'render-test' */ './components/RenderTest')).default
		case TestName.ReactBeautifulDndTest:
			return (await import(/* webpackChunkName: 'react-beautiful-dnd-test' */ './components/ReactBeautifulDndTest')).default
		case TestName.MomentTest:
			return (await import(/* webpackChunkName: 'moment-test' */ './components/MomentTest')).default
		case TestName.ClassRenderTest:
			return (await import(/* webpackChunkName: 'class-render-test' */ './components/ClassRenderTest')).default
		default:
			return null
	}
}

function useTestComponent(type: TestName) {
    const elementRef = useRef<any>(null)
    const element = elementRef.current
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getElement()
    }, [])
    
    const getElement = useCallback(async () => {
        setLoading(true)
		elementRef.current = await getDynamicModule(type)
        setLoading(false)
    }, [type])

    return !loading ? element : null
}

function App() {
	const DynamicComponent = useTestComponent(currentTestName)

	const renderComponent = (type: TestName) => {
		switch(type) {
			case TestName.CodeSplittingTest:
				return <CodeSplittingTest />
			case TestName.JqueryTest:
				return <JqueryTest />
			default:
				return null
		}
	}

	return (
		<div className="App">
			<ReduxProvider store={store}>
				{
					DynamicComponent ? <DynamicComponent /> : null
				}
				{
					renderComponent(currentTestName)
				}			
			</ReduxProvider>
		</div>
	);
}

export default App;
