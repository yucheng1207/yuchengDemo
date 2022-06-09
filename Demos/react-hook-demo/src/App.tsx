import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import logo from './logo.svg';
import './App.css';
import store from './store/index';
import CodeSplittingTest from './components/CodeSplittingTest';

enum TestName {
	CodeSplittingTest,
	EnumifyTest,
	HookTest2,
	ImportTest,
	ReduxTest,
	ReduxToolkitTest,
	RenderTest
}

const currentTestName = TestName.CodeSplittingTest

async function getModule(type: TestName) {
	switch(type) {
		case TestName.CodeSplittingTest:
			return (await import('./components/CodeSplittingTest')).default
		case TestName.EnumifyTest:
			return (await import('./components/EnumifyTest')).EnumifyTest
		case TestName.HookTest2:
			return (await import('./components/HookTest2')).default
		case TestName.ImportTest:
			return (await import('./components/ImportTest')).default
		case TestName.ReduxTest:
			return (await import('./components/ReduxTest')).default
		case TestName.ReduxToolkitTest:
			return (await import('./components/ReduxToolkitTest')).default
		case TestName.RenderTest:
			return (await import('./components/RenderTest')).default
		default:
			return (await import('./components/RenderTest')).default
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
		elementRef.current = await getModule(type)
        setLoading(false)
    }, [type])

    return !loading ? element : null
}

function App() {
	const TestComponent = useTestComponent(currentTestName)

	return (
		<div className="App">
			<ReduxProvider store={store}>
				{
					// CodeSplittingTest 要测试代码分割，直接引入才能正常测试
					currentTestName ? <CodeSplittingTest /> : TestComponent ? <TestComponent /> : null
				}				
			</ReduxProvider>
		</div>
	);
}

export default App;
