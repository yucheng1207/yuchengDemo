import * as React from "react";
import * as Cesium from 'cesium';
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import Home from "./pages/Home";
import 'src/styles/app.scss';

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjg4ZmZkMS0wYTg2LTQxNDUtYWI2Yi1jMGFkYzAyM2Y0NGQiLCJpZCI6MTUxOTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjczOTE2ODl9.OHWWuDk17XW-F3R9nxUz9zmmQrD2AXOzWOsXtQ7SnQE';

const render = () => {
	ReactDOM.render(
		<AppContainer>
			<Home />
		</AppContainer>,
		document.getElementById('react-app')
	);
}

render();
