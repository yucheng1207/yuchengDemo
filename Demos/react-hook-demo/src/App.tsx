import React from 'react';
import { Provider as ReduxProvider } from "react-redux";
import logo from './logo.svg';
import './App.css';
import RenderTest from './components/RenderTest';
import HookTest from './components/HookTest';
import ImportTest from './components/ImportTest';
import ReduxToolkitTest from './components/ReduxToolkitTest'
import store from './store/index';

function App() {
	return (
		<div className="App">
			<ReduxProvider store={store}>
				<ReduxToolkitTest />
			</ReduxProvider>
		</div>
	);
}

export default App;
