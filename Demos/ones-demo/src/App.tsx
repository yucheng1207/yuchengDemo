import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import './App.css';
import store from './store/index';

enum TestName {
	OnesDesignTest
}

const currentTestName: TestName = TestName.OnesDesignTest

/**
 * 这里都是要动态加载的组件
 */
async function getDynamicModule(type: TestName) {
	switch (type) {
		case TestName.OnesDesignTest:
			return (await import('./components/OnesDesignTest')).default
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
		switch (type) {
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
