/**
 * Reference: https://lavas-project.github.io/pwa-book/chapter04/3-service-worker-dive.html
 */

function match (rule, request) {
  switch (Object.prototype.toString.call(rule)) {
    // url 文本匹配
    case '[object String]':
      // 使用 URL() 将匹配规则传入的路径补全
      return request.url === new URL(rule, location).href

    // url 正则匹配
    case '[object RegExp]':
      return request.url.match(rule)

    // 支持自定义匹配
    case '[object Function]':
      return rule(request)
  }
}

function wsLog(...args) {
  console.log('Service Work: ', ...args)
}

// self.version = '20190401235959'
const CACHE_NAME = 'my-site-cache-v2';
const urlsToCache = [
  // '/', // 非必要不要缓存根目录，否则页面一直都会加载缓存无法更新
  '/imgs/test.jpg',
  // '/imgs/test2.jpg'
];

/**
 * sw安装回调，一般在install中初始化缓存
 * 使用skipWaiting可以跳过等待，当sw文件有更新时可以立即生效
 */
self.addEventListener('install', (event) => {
  // 安装回调的逻辑处理
  wsLog('<=====service worker 安装成功=====>')
  // 跳过等待
  self.skipWaiting()

  /**
   * 在install中初始化cache，将urlsToCache中的路径缓存
   */
  event.waitUntil(new Promise((resolve, reject) => {
        // 返回处理缓存更新的相关事情的 Promise
        caches.open(CACHE_NAME)
          .then(function(cache) {
            wsLog('Opened cache');
            cache.addAll(urlsToCache)
              .then(function (data) {
                wsLog('Opened cache success', data);
                resolve('Cache 初始化成功')
              })
          })
  }))
})

/**
 * sw激活回调
 */
self.addEventListener('activate', (event) => {
  // 激活回调的逻辑处理
  wsLog('service worker 激活成功')
  /**
   * 如果使用了 skipWaiting 的方式跳过 waiting 状态，直接激活了 Service Worker，
   * 可能会出现其他终端还没有受当前终端激活的 Service Worker 控制的情况，
   * 切回其他终端之后，Service Worker 控制页面的效果可能不符合预期，尤其是如果 Service Worker 需要动态拦截第三方请求的时候。
   * 为了保证 Service Worker 激活之后能够马上作用于所有的终端，
   * 通常在激活 Service Worker 后，通过在其中调用 self.clients.claim() 方法控制未受控制的客户端。
   * self.clients.claim() 方法返回一个 Promise，可以直接在 waitUntil() 方法中调用
   */
  // event.waitUntil(
  //   self.clients.claim()
  //     .then(() => {
  //       // resolve('service worker 激活成功')
  //       wsLog('service worker 激活成功 claim')
  //     })
  // )
})

/**
 * 拦截请求，可以再这个回调中处理请求或添加新的缓存路径
 */
self.addEventListener('fetch', event => {
  wsLog(`service worker 抓取请求成功: ${event.request.url}`)

  /**
   * 自定义"/data.txt"返回结果
   */
  if (match('/data.txt', event.request)) {
    // event.respondWith(new Response('Hello World!'))
    event.respondWith(new Promise(resolve => {
      setTimeout(() => {
        resolve(new Response('Hello World!'))
      }, 1000)
    }))
  } else {
    wsLog(`find Cache`, event.request)
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            // 命中缓存，把被缓存的值返回
            wsLog('命中缓存，把被缓存的值返回', response)
            return response;
          } else {
            wsLog('未找到缓存，正常请求', event.request)
            return fetch(event.request);
          }
        }
      ));
  }
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