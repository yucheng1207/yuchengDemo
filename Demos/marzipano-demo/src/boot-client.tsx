import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import 'src/styles/app.scss';
import Home from './pages/Home/index';

const render = () => {
	ReactDOM.render(
		<AppContainer>
			<Home />
		</AppContainer>,
		document.getElementById('react-app')
	);
}

render();
