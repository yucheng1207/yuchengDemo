import React, { useCallback, useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import memoize from 'proxy-memoize';
import styles from './index.module.scss';
import { AppState } from '../../store/index';
import { ITestData } from '../../store/application/slice';
import { bindActionCreators } from '@reduxjs/toolkit';
import { actionCreators, ApplicationAction } from '../../store/application/thunk';

/**
 * Reference: https://github.com/dai-shi/proxy-memoize#usage-with-react-redux
 */

interface Props {
	loading: boolean,
	testData: ITestData,
	actions: ApplicationAction,
	value: number,
	text: string
}

interface State {
	cnt: number
}

class ReduxTestContent extends React.Component<Props, State> {
	constructor(props: Props)
	{
		super(props)
		this.state = {
			cnt: 0
		}
	}

	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
		console.log('componentDidUpdate', prevProps, this.props)
	}

	private onClick = () => {
		if (!this.props.loading) {
			this.props.actions.showLoading()
			setTimeout(() => {
				this.props.actions.hideLoading()
			}, 2000)
		}	
	}

	private onAdd = () => {
		this.setState({cnt: this.state.cnt + 1})
	}

	render() {
		return (
			<div className={styles.container}>
				<span>REDUX TEST</span>
				<span>{this.props.loading ? 'true' : 'false'}</span>
				<span>{this.state.cnt}</span>
				<span>{this.props.value}</span>
				<span>{this.props.text}</span>
				<button onClick={this.onClick}>toggle loading</button>
				<button onClick={this.onAdd}>add cnt</button>
			</div>
		);
	}
}

const mapStateToProps = (state: AppState) =>
{
	const loading = state.application.loading
	console.log('mapStateToProps', loading)
	return {
		loading: state.application.loading.visible,
		text: loading.text,
		testData: state.application.testData,
	}
}

const mapDispatchToProps = (dispatch) => {
	console.log('mapDispatchToProps')
	return {
		actions: bindActionCreators({
			...actionCreators,
		}, dispatch)
	}
}

const Content = connect(mapStateToProps, mapDispatchToProps)(ReduxTestContent);

class ReduxText extends React.Component<any, any> {
	constructor(props)
	{
		super(props)
		this.state = {
			value: 100
		}
	}

	private onChange = () => {
		this.setState({value: this.state.value + 1 })
	}

	render() {
		return <div>
			<button onClick={this.onChange}>update Content</button>
			<Content value={this.state.value}/>
		</div>
	}
}

export default ReduxText
