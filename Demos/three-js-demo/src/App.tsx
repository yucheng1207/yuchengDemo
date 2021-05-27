import React from 'react';
import './App.css';
import ThreeBuilding from './components/ThreeBuilding';

interface Props {
}

const App: React.FunctionComponent<Props> = (props) => {
	return (
		<div className="App">
			<ThreeBuilding />
		</div>
	);
};

export default App;
