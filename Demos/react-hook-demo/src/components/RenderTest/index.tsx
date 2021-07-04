import { Button, Input } from 'antd';
import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';


const RenderTest: React.FunctionComponent<{}> = function (props) {
	console.log('RenderTest')

	const [text ,setText] = useState<string>('')
	const onInput = useCallback((e) =>
	{
		console.log('e', e.target.value)
		setText(e.target.value)
	}, [])

	return (
		<div>
			<RenderItem1 text={text} />
			<Input value={text} onInput={onInput}></Input>
			<span>{text}</span>
		</div>
	)
}

const _RenderItem1: React.FunctionComponent<{text:string}> = function (props) {
	console.log('RenderItem111')
	const onContentClick = useCallback(() =>
	{}, [])
	const renderContent = useCallback((cnt: number) =>
	{
		return <div>
			<span>RenderTest</span>
			<MyContent cnt={cnt} type="renderfunction"/>
		</div>
	}, [])
	return (
		<div>
			<RenderItem2 renderContent={renderContent} content={MyContent} />
		</div>
	)
}

const RenderItem1 = React.memo(_RenderItem1)



const MyContent: React.FunctionComponent<{cnt: number, type?: 'node' | 'renderfunction', onClick?: () => void}> = function (props) {
	console.log('MyContent', props.type)
	return (
		<div onClick={props.onClick}>
			MyContent:{props.type || 'Unknow'}_{props.cnt || 'Unknow'}
		</div>
	)
}

const RenderItem2: React.FunctionComponent<{
	renderContent?: (cnt: number) => React.ReactNode;
	content?: React.FunctionComponent<{cnt: number}>;
}> = function (props) {
	console.log('RenderItem222')
	const [cnt, setCnt] = useState<number>(1)
	const onClick = useCallback(() =>
	{
		setCnt(cnt + 1)
	}, [cnt])
	const Content = props.content
	return (
		<div>
			<span>number: {cnt}</span>
			<Button onClick={onClick}>Add</Button>
			{props.renderContent ? props.renderContent(cnt) : null}
			{Content ? <Content cnt={cnt} /> : null}
			{props.content ? <props.content cnt={cnt} /> : null}
		</div>
	)
}

export default RenderTest

