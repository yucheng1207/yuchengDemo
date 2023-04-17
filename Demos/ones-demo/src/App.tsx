import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import './App.css';
import store from './store/index';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { HttpClient } from "@sentry/integrations";
import {
	HashRouter as Router,
	Switch,
	Route,
	Link,
	matchPath
  } from "react-router-dom";
import { createBrowserHistory, createHashHistory } from 'history';
import SentryTest from './components/SentryTest';
const SentryRoute = Sentry.withSentryRouting(Route);
const history = createHashHistory()
const routes = [{ path: '/dynamic_component' }, { path: '/sentry/test' }, { path: '/' }];
console.log('log', process.env);

Sentry.init({
	dsn: "http://dcf8f6330dd5410d9885dcb1ee477b9c@10.17.0.156:9000/2", // javascript-react: https://sentry.io/organizations/qizhi-7z/projects/javascript-react/?project=4504445188833280
	integrations: [new BrowserTracing({
		// tracePropagationTargets: ["localhost", "my-site-url.com", /^\//],
		routingInstrumentation: Sentry.reactRouterV5Instrumentation(history, routes, matchPath)
	}), new HttpClient() as any],  // new ReportingObserver()],
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
	release: `ones-demo@0.0.1`
});

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
			<Sentry.ErrorBoundary>
				<ReduxProvider store={store}>
					<Router history={history}>
						<Link to="/">Home </Link>
						<Link to="/sentry/test">Sentry_Test </Link>
						<Link to="/dynamic_component">Dynamic </Link>
						<Switch>
							<SentryRoute path="/sentry/test">
								<SentryTest />
							</SentryRoute>
							<SentryRoute path="/dynamic_component">
								{
									DynamicComponent ? <DynamicComponent /> : null
								}
							</SentryRoute>
							<SentryRoute path="/">
								<div>home</div>
								<img src="./logo192.png"></img>
							</SentryRoute>
						</Switch>
					</Router>
				</ReduxProvider>
			</Sentry.ErrorBoundary>
		</div>
	);
}

export default Sentry.withProfiler(App, { name: "CustomAppName" });
