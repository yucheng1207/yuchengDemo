import React from 'react';
import { Input, Button } from 'antd';

interface Props {
    title?: string
}

interface State {
    text: string
}

class NormalImportAntDesignClass extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
    }

    componentDidMount(): void {
        console.log('NormalImportAntDesignClass Loaded')
    }

    onInput = (e) => {
        this.setState({text: e.target.value})
    }

    render() {
        return (
            <div style={{border: 'solid 1px black', margin: '24px', padding: '8px'}}>
                <div>
                    {`${this.props.title || 'Normal Import AntDesign'} ${this.state.text}`}
                    {
                        Button ? <Button>按钮</Button> : null
                    }
                </div>
                {
                    Input ? <Input value={this.state.text} onInput={this.onInput}></Input> : null
                }
            </div>
        )
    }
}


export default NormalImportAntDesignClass