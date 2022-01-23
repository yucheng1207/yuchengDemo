/**
 * Reference: https://lavas-project.github.io/pwa-book/chapter04/3-service-worker-dive.html
 */

// sw.js
console.log('service worker 注册成功')

self.addEventListener('install', () => {
  // 安装回调的逻辑处理
  console.log('service worker 安装成功')
  // 跳过等待
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  // 激活回调的逻辑处理
  console.log('service worker 激活成功')
})


let count = 0;
self.addEventListener('fetch', event => {
  console.log(`service worker 抓取请求成功:${event.request.url} (clientId:${event.clientId})`)
  ++count;

  event.waitUntil(async function() {
    await sendMessageToClient(event.clientId, `抓取请求成功: ${event.request.url}`, `${count}`)
  }())

})

self.addEventListener('message', event => {
  console.log('Service Worker(接收消息):', event.data)
  if (event.source && event.source.postMessage) {
    // 发送消息给id为event.source.id的client
    console.log('Service Worker(发送消息):', event.data, event.source.id)
    event.source.postMessage(`我收到消息啦`)
    sendMessageToClient(event.source.id, '我是通过self.clients.get获取到你的id的')
    sendMessageToAllClients('这条消息是发给所有client的')
  }
})

/**
 * 发送消息给client
 * @param {Number} clientId
 * @param {String} message
 * @returns
 */
async function sendMessageToClient(clientId, message) {
    // Get the client.
    const client = await self.clients.get(clientId);
    if (!client) return;

    // Send a message to the client.
    client.postMessage(message);
}

/**
 * 发送消息给所有的client
 * @param {String} message
 * @returns
 */
function sendMessageToAllClients(message) {
  self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      client.postMessage(message);
    });
  })
}
