// index.js
var worker = new Worker('sw.js');

// 设置监听器，并在消息负载上查看 web worker 返回的信息
worker.addEventListener('message', function(e) {
  console.log('接收到Service Worker消息: ', e.data);
}, false);

// 向 web worker 发送消息
const sendData = 'Hello World'
console.log('发送消息给Service Worker: ', sendData);
worker.postMessage(sendData);
