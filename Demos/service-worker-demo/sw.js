function wsLog(...args) {
  console.log('Service Work: ', ...args)
}

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

function respond (event, handler) {
  try {
    // 执行响应处理方法，根据返回结果进行兜底
    let res = handler(event.request)
    // 异步的响应结果兜底
    if (res instanceof Promise) {
      let promise = res.then(response => {
          // 如果返回结果非 Response 对象，抛出错误
          if (!(response instanceof Response)) {
            throw Error('返回结果异常')
          }
          return response
        })
        // 异步响应错误处理，即直接返回状态码为 500 Response 对象
        .catch(() => new Response('Service Worker 出错', {status: 500}))

      event.respondWith(promise)
      return
    }

    // 同步响应如果出现任何错误
    // 可以选择不调用 event.respondWith(r)
    // 让资源请求继续走浏览器默认的请求流程

    if (res instanceof Response) {
      event.respondWith(res)
    }
  } catch (e) {}
}

class Router {
  constructor () {
    // 存放路由规则
    this.routes = []
    // 注册 fetch 事件拦截
    this.initProxy()
  }

  initProxy () {
    self.addEventListener('fetch', event => {
      // 当拦截到资源请求时，会遍历已注册的路由规则，并执行相应规则所对应的策略
      for (let route of this.routes) {
        // 使用前面封装好的 match 函数进行路由规则匹配
        if (match(route.rule, event.request)) {
          // 使用前面封装好的 respond 方法执行回调操作
          respond(event, route.handler)
          break
        }
      }
    })
  }

  registerRoute (rule, handler) {
    this.routes.push({rule, handler})
  }
}

wsLog('service worker 注册成功')

self.version = '20190401235959'

self.addEventListener('install', () => {
  // 安装回调的逻辑处理
  wsLog('service worker 安装成功')
})

self.addEventListener('activate', () => {
  // 激活回调的逻辑处理
  wsLog('service worker 激活成功')
})

self.addEventListener('fetch', event => {
  wsLog(`service worker 抓取请求成功: ${event.request.url}`)
  if (match('/data.txt', event.request)) {
    // event.respondWith(new Response('Hello World!'))
    event.respondWith(new Promise(resolve => {
      setTimeout(() => {
        resolve(new Response('Hello World!'))
      }, 1000)
    }))
  }
})

// const router = new Router()
// router.registerRoute(
//   '/data.txt',
//   () => new Response('Hello World!')
// )

self.addEventListener('message', function(e) {
	wsLog('receive:', e.data)
	self.postMessage(e.data)
	self.close()
})
