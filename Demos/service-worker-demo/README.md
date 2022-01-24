# Blog输出
[Service Worker初探（工作原理讲解，附发送message和cache缓存demo代码）](https://juejin.cn/post/7056594891551277093)

# 本地调试

测试 `service worker` 生命周期
```
yarn dev:lifecycle
```

测试 `service worker` 使用postMessage发送消息
```
yarn dev:message
```

测试 `service worker` 缓存功能
```
yarn dev:cache
```

# 开发笔记

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

## 缓存

我们可以[cache api](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)来缓存路径（如图片、文件、请求url等），参考[service worker说明](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers#%E5%AE%89%E8%A3%85%E5%92%8C%E6%BF%80%E6%B4%BB%EF%BC%9A%E5%A1%AB%E5%85%85%E4%BD%A0%E7%9A%84%E7%BC%93%E5%AD%98) 来进行相关的配置，具体步骤如下：

1. 初始化cache：在sw的 `install` 回调中初始化缓存路径，即将应用默认要缓存的路径通过 [cache api](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache) 添加到缓存中，需要注意的是**不要缓存根目录，否则获取页面时拿到的一直都是缓存中的数据**

    ```html
    const CACHE_NAME = 'my-site-cache-v1';
    const ROOT_URL = 'http://127.0.0.1:8000/';
    const urlsToCache = [
      // '/',            // 不要缓存根目录，否则页面一直都会加载缓存无法更新
      '/imgs/test.jpg',  // 默认缓存/imgs/test.jpg
    ];

    /**
     * sw安装回调，一般在install中初始化缓存
     * 使用skipWaiting可以跳过等待，当sw文件有更新时可以立即生效
     */
    self.addEventListener('install', (event) => {
      // 安装回调的逻辑处理
      console.log('<======service worker 安装成功======>')
      // 跳过等待
      self.skipWaiting()

      /**
       * 在install中初始化cache，将urlsToCache中的路径缓存
       */
      event.waitUntil(new Promise((resolve, reject) => {
            // 返回处理缓存更新的相关事情的 Promise
            caches.open(CACHE_NAME)
              .then(async function(cache) {
                let currentCaches = await cache.keys()
                const rootCache = currentCaches.find(c => c.url === ROOT_URL)
                if (rootCache) {
                  // 如果缓存的根目录，则删除该缓存
                  await cache.delete(rootCache)
                }
                // 缓存urlsToCache中的路径
                await cache.addAll(urlsToCache)
                currentCaches = await cache.keys()
                console.log('Cache 初始化成功', currentCaches)
                resolve('Cache 初始化成功')
              })
      }))
    })
    ```


1. 当页面请求的是缓存中的数据时，返回缓存

    ```html
    /**
     * 拦截请求，可以再这个回调中处理请求或添加新的缓存路径
     */
    self.addEventListener('fetch', event => {
      wsLog(`service worker 抓取请求成功: ${event.request.url}`)

    	event.respondWith(
        caches.match(event.request)
          .then(function(response) {
            if (response) {
              // 命中缓存，把被缓存的值返回
              console.log('命中缓存，把被缓存的值返回', response)
              return response;
            } else {
              console.log('未找到缓存，正常请求', event.request)
              return fetch(event.request);
            }
          }
        ));
    })
    ```

    如果为请求未缓存，希望立即添加到缓存时，也可以在”fetch“回调中动态的添加缓存，但是要**注意不要缓存根目录，否则请求页面时拿到的一直都是缓存中的页面，应用就没办法更新了**

    ```html
    /**
     * 拦截请求，可以再这个回调中处理请求或添加新的缓存路径
     */
    self.addEventListener('fetch', event => {
      wsLog(`service worker 抓取请求成功: ${event.request.url}`)

    	/**
       * 对于install阶段已缓存的请求，返回缓存；对于未缓存的请求，加入缓存（根路径除外）
       */
      event.respondWith(
        caches.match(event.request)
          .then(function(response) {
            if (response) {
              // 命中缓存，把被缓存的值返回
              console.log('命中缓存，把被缓存的值返回', response)
              return response;
            } else {
              if (event.request.url === ROOT_URL) {
                // 不要缓存根目录，否则页面一直都会加载缓存无法更新
                console.log('请求为根目录，直接返回', event.request)
                return fetch(event.request);
              }
              // 没有命中缓存，将这个请求添加到缓存
              console.log('没有命中缓存，将这个请求缓存', event.request)

    					/**
               * 克隆请求
               * 请求是一个流，只能使用一次。
               * 因为我们通过缓存请求和浏览器请求分别使用了一次获取，所以我们需要克隆响应
               */
              const fetchRequest = event.request.clone();

              return fetch(fetchRequest).then(
                function(response) {
                  /**
                   * 检查response是否有效
                   * 确保 response 有效
                   * 检查 response 的状态是200
                   * 确保 response 的类型是 basic 类型的，这说明请求是同源的，这意味着第三方的请求不能被缓存。
                   */
                  if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                  }

                  /**
                   * 克隆response
                   * response 是一个 Stream，那么它的 body 只能被使用一次
                   * 所以为了让浏览器跟缓存都使用这个body，我们必须克隆这个body，一份到浏览器，一份到缓存中缓存
                   */
                  const responseToCache = response.clone();

                  console.log('添加缓存', event.request)
                  caches.open(CACHE_NAME)
                    .then(function(cache) {
                      cache.put(event.request, responseToCache);
                    });

                  return response;
                }
              );
            }
          }
        ));
    })
    ```


# 参考
- [Service Worker 调研](https://stripe-parsley-f09.notion.site/Service-Worker-644b6069cd9841aa8910cd401e706633)
- [Web Workers 的基本信息](https://www.html5rocks.com/zh/tutorials/workers/basics/#toc-enviornment-subworkers)
- [使用Service Worker MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers#browser_support)
- [Service Worker API MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
- [Webpack Service Worker](https://webpack.js.org/guides/progressive-web-application/)
- [Service Worker 简介 PWA应用实战](https://lavas-project.github.io/pwa-book/chapter04/1-service-worker-introduction.html)
- [Service Worker那些事(cache)](https://zhuanlan.zhihu.com/p/20040372)
