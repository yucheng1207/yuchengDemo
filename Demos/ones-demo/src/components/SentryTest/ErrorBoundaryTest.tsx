import { captureException } from "@sentry/react";
import React from "react";

export class ErrorItem extends React.Component {
    // componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    //     console.log('componentDidCatch', error)
    // }
    render(): React.ReactNode {
        throw new Error('render error')
        return <div>Item</div>
    }
}

export default class ErrorBoundaryTest extends React.Component<any, any> {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // 更新 state 使下一次渲染能够显示降级后的 UI
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // 你同样可以将错误日志上报给服务器
      console.log('zyc componentDidCatch', this.props.id, error, errorInfo)
      captureException(error)
    }
  
    render() {
      if (this.state.hasError) {
        // 你可以自定义降级后的 UI 并渲染
        return <h1>Something went wrong.{this.props.id}</h1>;
      }
  
      return this.props.children; 
    }
}