# Start

## postMessage

### [client => service worker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event)
```js
// client
if (navigator.serviceWorker) {

  navigator.serviceWorker.register('service-worker.js');

  navigator.serviceWorker.addEventListener('message', event => {
    // event is a MessageEvent object
    console.log(`The service worker sent me a message: ${event.data}`);
  });

  navigator.serviceWorker.ready.then( registration => {
    registration.active.postMessage("Hi service worker");
  });

  // or
  navigator.serviceWorker.controller.postMessage('Hi service worker')
}

// service worker
addEventListener('message', event => {
  // event is an ExtendableMessageEvent object
  console.log(`The client sent me a message: ${event.data}`);

  event.source.postMessage("Hi client");
});
```

### [service worker => client](https://developer.mozilla.org/zh-CN/docs/Web/API/Client/postMessage)
```js
// service worker
addEventListener('fetch', event => {
  event.waitUntil(async function() {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!event.clientId) return;

    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;

    // Send a message to the client.
    client.postMessage({
      msg: "Hey I just got a fetch from you!",
      url: event.request.url
    });

  }());
});

// or 该方法也可以用于给多个client发消息
self.clients.matchAll().then(function(clients) {
wsLog(clients)
clients.forEach(function(client) {
    if (client.id === event.clientId) {
    // 首页
    client.postMessage(`fetch url success2: ${event.request.url}`);
    }
});
})

// client
navigator.serviceWorker.addEventListener('message', event => {
  console.log(event.data.msg, event.data.url);
});
```

## 添加缓存

参考[这篇文章](https://zhuanlan.zhihu.com/p/20040372)


# 参考
- [Service Worker 调研](https://stripe-parsley-f09.notion.site/Service-Worker-644b6069cd9841aa8910cd401e706633)
- [Web Workers 的基本信息](https://www.html5rocks.com/zh/tutorials/workers/basics/#toc-enviornment-subworkers)
- [使用Service Worker MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers#browser_support)
- [Service Worker API MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
- [Webpack Service Worker](https://webpack.js.org/guides/progressive-web-application/)
- [Service Worker 简介 PWA应用实战](https://lavas-project.github.io/pwa-book/chapter04/1-service-worker-introduction.html)