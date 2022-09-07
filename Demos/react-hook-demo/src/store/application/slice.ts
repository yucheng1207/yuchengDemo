import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ILoading {
	visible: boolean,
	text?: string,
}

export interface ITestData {
	obj: {
		value1: number,
		value2: number,
		value3: number,
	},
	arr: {
		value: number,
		isValid: boolean,
	}[]
}

export interface IProject {
	uuid: string,
	name: string,
	show: boolean,
}

// export interface IProjectDetail extends IProject {
// 	info: string,
// }

// export interface IProjects {
// 	[id: string]: IProjectDetail
// }

export interface IApplicationState {
	isMobile: boolean,
	isPad: boolean,
	loading: ILoading,
	testData: ITestData,
	projectList: IProject[],
	// projects: IProjectDetail,
	projectWhiteList: string[],
}

const userAgent = window && window.navigator && window.navigator.userAgent
const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
const isPad = /iPad/i.test(userAgent);
const initialState: IApplicationState = {
	isMobile,
	isPad,
	loading: {
		visible: false
	},
	testData: {
		obj: {
			value1: 1,
			value2: 2,
			value3: 3
		},
		arr: [{
			value: 1,
			isValid: true
		}, {
			value: 2,
			isValid: true
		},{
			value: 3,
			isValid: true
		}]
	},
	projectList: [{
		uuid: '1',
		name: 'project1',
		show: true
	}, {
		uuid: '2',
		name: 'project2',
		show: false
	}, {
		uuid: '3',
		name: 'project3',
		show: true
	}, {
		uuid: '4',
		name: 'project4',
		show: true
	}],
	// projects: null,
	projectWhiteList: ['1', '2', '3']
}

/**
 * 使用`createSlice`创建一个带有`action creators`和`action types`的`reducer`数据切片
 * Redux 规定我们不可以直接在 switch cases 函数中直接修改 state 值，而是返回一个修改后的拷贝值
 * 而 Redux ToolKit 的 createSlice 和 createReducer 函数内部使用了 immer 让我们可以直接在函数中修改 state 中的属性值。
 * 但是需要注意的是，在同一个函数中我们不可以 既修改 state 又返回修改后的拷贝值，immer 是无法区分这两种情况的。
 */
const slice = createSlice({
	name: 'application',
	initialState,
	reducers: {
		SetLoadingAction(state: IApplicationState, action: PayloadAction<ILoading>) {
			state.loading = action.payload
			// return {
			// 	...state,
			// 	loading: action.payload
			// }
		},
		SetTestDataAction(state: IApplicationState, action: PayloadAction<ITestData>) {
			state.testData = action.payload
		},
		SetTestDataArrAction(state: IApplicationState, action: PayloadAction<{value: number, isValid: boolean}[]>) {
			state.testData.arr = action.payload
		},
	}
})

export const {
	SetLoadingAction,
	SetTestDataAction,
	SetTestDataArrAction,
} = slice.actions

export default slice.reducer