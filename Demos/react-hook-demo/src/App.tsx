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
				<HookTest />
			</header>
		</div>
	);
}

export default App;
