import { Button, Input } from 'antd';
import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { consoleTest, IHookTest2Props } from './type';


const HookTest2: React.FunctionComponent<IHookTest2Props> = function (props) {
	console.log('RenderTest', props.text)
	consoleTest()
	const [textObject, setTestObject] = useState<{
		content?: Array<string>
		string: string
	} | undefined>({content: ['1', '2'], string: 'abc'})
	const textObjectString = textObject.string
	const textObjectContent = textObject.content

	const textObjectStringMemo = useMemo(() => {
		console.log('textObjectString')
		return textObjectString
	}, [textObjectString])

	const textObjectContentMemo = useMemo(() => {
		console.log('textObjectContent')
		return textObjectContent
	}, [textObjectContent])

	const [textString, setTestString] = useState<string>('aaa')

	const [text, setText] = useState<string>('')
	const onInput = useCallback((e) => {
		console.log('e', e.target.value)
		setText(e.target.value)
		// e.target.value && setTestObject({ content: { t: e.target.value } })
	}, [])

	const textContent = useMemo(() => {
		console.log('textObject.content.length')
		return textObject.content.length
	}, [textObject.content.length])

	const textContent2 = useMemo(() => {
		console.log('textObjectString')
		return textObjectString
	}, [textObjectString])

	const onClick = useCallback(() => {
		setTestObject((prev) => ({content: ['2', '3'], string: 'abc'}))
	}, [])

	return (
		<div>
			<Input value={text} onInput={onInput}></Input>
			<button onClick={onClick}>button</button>
			<p>{text}</p>
			<p >{textContent}{textContent2}</p>
			<p>{textObjectStringMemo}{textObjectContentMemo}</p>
		</div>
	)
}

export default HookTest2
