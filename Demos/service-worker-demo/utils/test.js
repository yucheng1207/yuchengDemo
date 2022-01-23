// 测试代码，没有用
// index.js
const worker = new Worker('sw.js');

// 设置监听器，并在消息负载上查看 web worker 返回的信息
worker.addEventListener('message', function(e) {
  console.log('接收到Service Worker消息: ', e.data);
}, false);

// 向 web worker 发送消息
const sendData = 'Hello World'
console.log('发送消息给Service Worker: ', sendData);
worker.postMessage(sendData);

let count = 0
document.getElementById("hello1").onclick = () => {
  console.log('click')
  worker.postMessage(++count);
}

// // sw.js
// self.addEventListener('message', function(e) {
//   wsLog('receive message:', e.data)
// 	self.postMessage(e.data)
// 	// self.close()
// })
