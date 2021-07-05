import { Button, Input } from 'antd';
import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';


const HookTest: React.FunctionComponent<{}> = function (props) {
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
    const {text } = props
    const [content, setContent] = useState('')
	const onClick = useCallback(() =>
    {
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

export default HookTest

