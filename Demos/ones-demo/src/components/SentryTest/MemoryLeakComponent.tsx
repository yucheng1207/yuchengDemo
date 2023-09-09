import React from 'react';

export default class MemoryLeakComponent extends React.Component<any, any> {
    constructor(props) {
      super(props);
      this.state = {
        items: []
      };
    }
    
    componentDidMount() {
        let doms = []
        for (let i = 0; i < 10000; i++) {
            doms = [...doms, <div key={i}>{i}</div>]
        }
        this.setState({ items: doms });
        console.log('doms', doms, this.state)
    }
    
    render() {
      return <div>{this.state.items}</div>;
    }
}