/**
 * Reference https://lavas-project.github.io/pwa-book/chapter05/5-workbox.html
 * 未验证
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js')

function wsLog(...args) {
  console.log('Service Work: ', ...args)
}

if (workbox) {
  wsLog('Workbox 加载完成')
}

// 修改默认配置
workbox.core.setCacheNameDetails({
  prefix: 'app',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
})

// 打印修改结果
// 将打印 'app-precache-v1'
wsLog(worbox.core.cacheNames.precache)
// 将打印 'app-runtime-v1'
wsLog(workbox.core.cacheNames.runtime)


// Workbox 预缓存功能
// workbox.precaching 对象提供了常用的预缓存功能，其中最常用的方法是 workbox.precaching.precacheAndRoute。
// 它的作用跟我们前面实现的 Precacher.precacheAndRoute() 的功能类似， 都是将传入的资源列表进行预缓存，同时对匹配到的预缓存请求直接从本地缓存中读取并返回。
workbox.routing.precacheAndRoute([
  {
    url: '/index.html',
    revision: 'asdf'
  },
])
