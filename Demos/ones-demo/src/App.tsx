import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import { Route } from 'react-router';
import './App.css';
import store from './store/index';
import {
	HashRouter as Router,
	Switch,
	Link,
  } from "react-router-dom";
import { createBrowserHistory, createHashHistory } from 'history';
import SentryTest from './components/SentryTest';
import { initMonitor, ErrorBoundary } from './monitor';
const history = createHashHistory()

const defaultTracesSampleRate = 0.5;
const defaultSampleRate = 1;
const version = process.env.RELEASE;
const monitorDsn = process.env.MONITOR_DSN;
const tracesSampleRate = process.env.MONITOR_TRACES_SAMPLE_RATE;
const sampleRate = process.env.MONITOR_SAMPLE_RATE;
const enableMonitor = monitorDsn && (tracesSampleRate || sampleRate)
console.log('process.env', process.env)

if (enableMonitor) {
	initMonitor({
	  history,
	  dsn: monitorDsn,
	  version,
	  tracesSampleRate: tracesSampleRate ? parseFloat(tracesSampleRate) : defaultTracesSampleRate,
	  sampleRate: sampleRate ? parseFloat(sampleRate) : defaultSampleRate,
	});
}

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
	return (
		<div className="App">
			<ErrorBoundary fallback={<>出错啦</>}>
				<ReduxProvider store={store}>
					<Router history={history}>
						<Link to="/">Home </Link>
						<Link to="/sentry/test">Sentry_Test </Link>
						<Link to="/dynamic_component">Dynamic </Link>
						<Switch>
							<Route path="/sentry/test">
								<SentryTest />
							</Route>
							<Route path="/dynamic_component">
								{
									DynamicComponent ? <DynamicComponent /> : null
								}
							</Route>
							<Route path="/">
								<div>home</div>
								<img src="./logo192.png"></img>
							</Route>
						</Switch>
					</Router>
				</ReduxProvider>
			</ErrorBoundary>
		</div>
	);
}

export default App;
