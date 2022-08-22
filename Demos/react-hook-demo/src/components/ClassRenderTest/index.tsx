import { Input } from 'antd';
import React from 'react';

const Item: React.FunctionComponent<{options?: any[]}> = (props) => {
	console.log('render Item')
	return (<>
		{
			props.options ? <div>
				{
					props.options.map(item => (<div key={item.name}>
						{item.name}
					</div>))
				}
			</div> : <div>Null</div>
		}
	</>)
}

const options = [{
	name: '123',
}, {
	name: '456'
}]
class ClassRenderTest extends React.Component {

	state = {
		text: 'state'
	}

	onChange = (e) => {
		this.setState({
			text: e.target.value
		})
	}

	renderContent = () => {
		// const options = [{
		// 	name: '123',
		// }, {
		// 	name: '456'
		// }]
		return <Item options={options} />
	}
	render(): React.ReactNode {
		console.log('render ClassRenderTest')
		return <div>
			<Input value={this.state.text} onChange={this.onChange} />
			{this.renderContent()}
		</div>
	}
}

export default ClassRenderTest

