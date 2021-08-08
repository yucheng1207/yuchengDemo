import React from 'react';
import logo from './logo.svg';
import './App.css';
import RenderTest from './components/RenderTest';
import HookTest from './components/HookTest';
import ImportTest from './components/ImportTest';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				{/* <img src={logo} className="App-logo" alt="logo" /> */}
				{/* <RenderTest /> */}
				<HookTest />
			</header>
		</div>
	);
}

export default App;
