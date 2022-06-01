import React from 'react';
import { Provider as ReduxProvider } from "react-redux";
import logo from './logo.svg';
import './App.css';
import RenderTest from './components/RenderTest';
import HookTest2 from './components/HookTest2';
import ImportTest from './components/ImportTest';
import ReduxToolkitTest from './components/ReduxToolkitTest'
import store from './store/index';
import ReduxTest from './components/ReduxTest';

function App() {
	return (
		<div className="App">
			<ReduxProvider store={store}>
				<ReduxTest />
			</ReduxProvider>
		</div>
	);
}

export default App;
