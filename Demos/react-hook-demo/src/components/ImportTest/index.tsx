import { Button, Input } from 'antd';
import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import a from './test.js'
import * as a1 from './test.js'
import c from './testCommonJS.js'
import * as c1 from './testCommonJS.js'
const d = require('./testCommonJS.js')
const e = require('./test.js')
console.log('import', a, a1)
console.log('import commonjs', c, c1)
console.log('require commonjs', d)
console.log('require js', e)

const ImportTest: React.FunctionComponent<{}> = function (props) {
	console.log('RenderTest')

	const [text, setText] = useState<string>('')
	const onInput = useCallback((e) => {
		console.log('e', e.target.value)
		setText(e.target.value)
	}, [])

	return (
		<div>
			<Input value={text} onInput={onInput}></Input>
			<span>{text}</span>
		</div>
	)
}

export default ImportTest

