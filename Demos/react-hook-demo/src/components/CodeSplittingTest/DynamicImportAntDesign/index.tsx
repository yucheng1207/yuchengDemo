import React, { useRef, useCallback, useState, useEffect } from 'react';
async function getButton() {
    const result = await import(/* webpackChunkName: 'ant design button' */ 'antd/lib/button')
    await import('antd/lib/button/style/css')
    return result.default
}

async function getInput() {
    const result = await import('antd/lib/input')
    await import('antd/lib/input/style/css')
    return result.default
}

function useAntDesignComponent(type: 'button' | 'input') {
    const elementRef = useRef<any>(null)
    const element = elementRef.current
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getElement()
    }, [])
    
    const getElement = useCallback(async () => {
        setLoading(true)
        switch(type) {
            case 'button':
                elementRef.current = await getButton()
                break
            case 'input':
                elementRef.current = await getInput()
                break
            default:
                break
        }
        setLoading(false)
    }, [type])

    return !loading ? element : null
}


const DynamicImportAntDesign: React.FunctionComponent<{title?: string}> = function (props) {
    const Button = useAntDesignComponent('button')
    const Input = useAntDesignComponent('input')
    const [text, setText] = useState<string>('')
    const onInput = useCallback((e) => {
		console.log('e', e.target.value)
		setText(e.target.value)
	}, [])

	return (
        <div style={{border: 'solid 1px black', margin: '24px', padding: '8px'}}>
            <div>
                {`${props.title || 'Dynamic Import AntDesign'} ${text}`}
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

export default DynamicImportAntDesign
