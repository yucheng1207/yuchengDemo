import React, { useCallback, useState } from 'react';
import { Input, Button } from 'antd';

const NormalImportAntDesign: React.FunctionComponent<{title?: string}> = function (props) {
    const [text, setText] = useState<string>('')
    const onInput = useCallback((e) => {
		console.log('e', e.target.value)
		setText(e.target.value)
	}, [])

	return (
		<div style={{border: 'solid 1px black', margin: '24px', padding: '8px'}}>
            <div>
                {`${props.title || 'Normal Import AntDesign'} ${text}`}
                {
                    Button ? <Button>按钮</Button> : null
                }
            </div>
            {
                Input ? <Input value={text} onInput={onInput}></Input> : null
            }
		</div>
	)
}

export default NormalImportAntDesign
