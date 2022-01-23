/**
 * Reference: https://lavas-project.github.io/pwa-book/chapter04/3-service-worker-dive.html
 */

// sw.js
console.log('service worker 注册成功')

self.addEventListener('install', () => {
  // 安装回调的逻辑处理
  console.log('service worker 安装成功2')
  // 使用skipWaiting可以跳过等待，当sw文件有更新时可以立即生效
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  // 激活回调的逻辑处理
  console.log('service worker 激活成功')
})

self.addEventListener('fetch', event => {
  console.log(`service worker 抓取请求成功2:${event.request.url} (clientId:${event.clientId})`)
})