import React from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { ganttData } from './data';
import { Button } from '@ones-design/core';

export default class GanttTest extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = { hasError: false };
    //     this.ganttContainer = null
    // }
  
    componentDidMount() {
      const { items, links } = this.props;
      const data = items || ganttData;
      const customData = data.map((item, index) => {
          return {
              id: index+1,
              text: '123',
              start_date: '2019-04-15',
              duration: 3,
              progress: 0.6
          }
      })
      this.gantt = gantt; // window.Gantt.getGanttInstance();
      // this.gantt.config.date_format = "%Y-%m-%d %H:%i";  
      this.gantt.init(this.ganttContainer);
      this.gantt.parse({ data: customData, links });
      console.log('zyc gantt test data', items)
    }
  
    render() {
       return (<>
            <Button>123</Button>
            <div
                ref={ (ref) => { this.ganttContainer = ref } }
                style={ { width: '100%', height: '100%' } }
            />
        </>);
    }
  }