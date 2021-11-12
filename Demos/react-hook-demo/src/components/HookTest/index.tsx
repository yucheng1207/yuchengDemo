import { Button, Input } from 'antd';
import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';


const HookTest: React.FunctionComponent<{}> = function (props) {
	console.log('RenderTest')
	const [textObject, setTestObject] = useState<{
		content?: {
			t: string
		}
	} | undefined>()

	const [text, setText] = useState<string>('')
	const onInput = useCallback((e) => {
		console.log('e', e.target.value)
		setText(e.target.value)
		e.target.value && setTestObject({ content: { t: e.target.value } })
	}, [])

	const textContent = useMemo(() => {
		return textObject?.content?.t
	}, [textObject?.content?.t])
	console.log('t', textContent)
	return (
		<div>
			<DefaultPropsTest defaultText="567" />
			<RenderItem1 text={text} />
			<Input value={text} onInput={onInput}></Input>
			<p>{text}</p>
			<p>{textContent}</p>
		</div>
	)
}

const _RenderItem1: React.FunctionComponent<{ text: string }> = function (props) {
	console.log('RenderItem111')
	const { text } = props
	const [content, setContent] = useState('')
	const onClick = useCallback(() => {
		setContent(text)
	}, [text])
	return (
		<div>
			<Button onClick={onClick}>setContent</Button>
			{content}
		</div>
	)
}

const RenderItem1 = React.memo(_RenderItem1)

const DefaultPropsTest: React.FunctionComponent<{ text?: string, defaultText?: string }> = function (props) {
	return (
		<div>
			{props.text || null}
			{props.defaultText}
		</div>
	)
}
DefaultPropsTest.defaultProps = {
	defaultText: '123'
}

export default HookTest

