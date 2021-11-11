# 前言
## SuperMap是什么

[关于超图](https://www.supermap.com/zh-cn/a/news/aboutSuperMap.html)

### [Web端](https://www.supermap.com/zh-cn/a/product/10i-web-2020.html)

#### [iClient Javascript](https://www.supermap.com/zh-cn/a/product/10i-iclient-js-2020.html) - Web端GIS软件开发平台

GIS 网络客户端开发平台，基于现代 Web 技术栈构建，是 SuperMap GIS 和在线 GIS 平台系列产品的统一JavaScript 客户端。

##### 产品特点

- 地图开发库支持：Leaflet、OpenLayers、MapboxGLJS、iClient Classic
- 图表开发库支持：ECharts、D3、MapV、DECK.GL 等


#### [iClient3D for WebGL](https://www.supermap.com/zh-cn/a/product/10i-iclient-webgl-2020.html) - 三维客户端开发平台

基于 WebGL 技术实现的三维客户端开发平台，可用于构建无插件、跨操作系统、跨浏览器的三维 GIS 应用程序。

- [示例](http://support.supermap.com.cn:8090/webgl/examples/webgl/examples.html#layer)
- [SuperMap/Vue-iClient3D-WebGL](http://support.supermap.com.cn:8090/webgl/examples/component/dist/zh/api/guide/installation.html)


### [SuperMap iServer](https://www.supermap.com/cn/xhtml/10i-iserver.html) - 云GIS应用服务器

WebGL Web客户端提供了[丰富的示例](http://support.supermap.com.cn:8090/webgl/examples/webgl/examples.html#layer)， 支持剖面分析、可视域分析、方量计算、坡度坡向分析、阴影分析等功能，但这些功能需要配合SuperMap iServer服务对数据进行处理并部署后才能正常使用。
该功能是付费的，但可以[申请试用](https://itest.supermapol.com/web/pricing/timelicense#web)

## 相关网站

- [SuperMap 官网](https://iclient.supermap.io/)

- [SuperMap倾斜摄影白皮书](http://www.noobyard.com/article/p-mdpktpzs-mm.html)


# 开始

## 创建项目

该工程使用的`useful-cli`(1.0.6版本)创建， 参考[Mars3d](https://mars3d.cn/doc)官方template【[mars3d-vue-template](https://github.com/marsgis/mars3d-vue-template)】进行开发

## 集成SuperMap

参考[SuperMap/Vue-iClient3D-WebGL](http://support.supermap.com.cn:8090/webgl/examples/component/dist/zh/api/guide/installation.html)进行配置

1. 安装依赖
```
npm install @supermap/vue-iclient3d-webgl
```

2. 同步vue和element-plus版本（可选）
最好将工程的vue和element-plus版本改成跟`vue-iclient3d-webgl`一致
```
    "element-plus": "^1.0.2-beta.36",
    "vue": "^3.0.4",
```

3. main.js中引入supermap
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);

// 完整引入第三方库，部分组件需要
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
app.use(ElementPlus)
//import * as echarts from 'echarts';
//window.echarts = echarts //挂载到window上

// 引入webgl3d组件包
import '@supermap/iclient3d-vue-for-webgl/lib/theme/index.css'
import webgl3d from "@supermap/iclient3d-vue-for-webgl"
app.use(webgl3d)
app.mount('#app')
```

4. 引入依赖: 在node_module里找到`@supermap/vue-iclient3d-webgl`安装包，复制里面的public里需要的资源到工程目录public文件下，然后在index.html里引入cesium等资源文件
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/Cesium/Widgets/widgets.css" rel="stylesheet">
  <script src="/Cesium/Cesium.js" ></script>
  <title>webgl3d</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js" async></script>
  <script src="/js/axios.min.js" ></script>
</body>
</html>

```

5. 在App.vue里测试使用量算功能组件
```javascript
<template>
  <sm3d-viewer scene-url="http://www.supermapol.com/realspace/services/3D-ZF_normal/rest/realspace">
    <sm3d-measure></sm3d-measure>
  </sm3d-viewer>
</template>
<script>
```
