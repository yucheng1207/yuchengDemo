# 创建项目

这个项目使用[useful-cli](https://github.com/yucheng1207/useful-cli)创建。

# 开发

## 开发调试

执行`yarn dev`命令可本地运行该项目，打开[http://localhost:3000](http://localhost:3000)可在线调试。

```bash
yarn dev
```

## 编译

执行`yarn build`可以编译项目，输出路径为`build`文件夹

```bash
yarn build
```

# 功能

## Cesium

-   [Cesium 官网](https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/)
-   [Cesium 中文社区](http://cesium.coinidea.com/guide/)
-   [Resium 官网](https://resium.reearth.io/)

### 引入 Cesium & reisum

webpack4 cesium 请用 1.85.0 以下版本

```
yarn add cesium@1.85.0 resium
```

### 配置 token

[官网获取 token](https://cesium.com/ion/tokens?page=1)

```
import * as Cesium from 'cesium';

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjg4ZmZkMS0wYTg2LTQxNDUtYWI2Yi1jMGFkYzAyM2Y0NGQiLCJpZCI6MTUxOTAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjczOTE2ODl9.OHWWuDk17XW-F3R9nxUz9zmmQrD2AXOzWOsXtQ7SnQE';
```

### 配置 webpack

看参考 resium 文档配置：https://resium.reearth.io/installation#4-webpack-copy-only-asset-files-and-bundle-cesium-normaly-except-assets

方式一：整个 cesium 都拷贝到输出目录

```
// webpack config
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const webpack = require('webpack');
...
	externals: {
		cesium: "Cesium" 	// webpack不将cesium打包到bundle中，cesium从HTML中加载(window.cesium)
	}
	...
	plugins: [
		...
		new HtmlWebpackPlugin({
            template: paths.htmlPath(),
            inject: true,
        }),
		new CopyWebpackPlugin([			// 将cesium拷贝到打包输出目录
            {
                from: paths.resolveApp('node_modules/cesium/Build/Cesium'),
                to: 'cesium',
            },
        ]),
        new HtmlWebpackTagsPlugin({		// 从输出目录中获取cesium（build/cesium）
            append: false,
            tags: ['cesium/Widgets/widgets.css', 'cesium/Cesium.js'],
        }),
        new webpack.DefinePlugin({		// cesium在输出目录中的路径
            CESIUM_BASE_URL: JSON.stringify('/cesium'),
        }),
		...
	]
...
```

方式二： 仅仅拷贝 cesium 的 asset 文件，cesium 还是打包到 bundle 中

```
// webpack config
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const webpack = require('webpack');
...
	plugins: [
		...
		new HtmlWebpackPlugin({
            template: paths.htmlPath(),
            inject: true,
        }),
        new CopyWebpackPlugin([        // 将cesium的asset文件拷贝到打包输出目录
            {
                from: paths.resolveApp(
                    'node_modules/cesium/Build/Cesium/Workers'
                ),
                to: 'cesium/Workers',
            },
            {
                from: paths.resolveApp(
                    'node_modules/cesium/Build/Cesium/ThirdParty'
                ),
                to: 'cesium/ThirdParty',
            },
            {
                from: paths.resolveApp(
                    'node_modules/cesium/Build/Cesium/Assets'
                ),
                to: 'cesium/Assets',
            },
            {
                from: paths.resolveApp(
                    'node_modules/cesium/Build/Cesium/Widgets'
                ),
                to: 'cesium/Widgets',
            },
        ]),
        new HtmlWebpackTagsPlugin({
            append: false,
            tags: ['cesium/Widgets/widgets.css'],
        }),
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify('./cesium'),
        }),
		...
	]
...
```

方式三：将 cesium 托管到线上

```
// webpack.config
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

	...
	externals: {
		cesium: "Cesium" 	// webpack不将cesium打包到bundle中，cesium从HTML中加载(window.cesium)
	}
	...
	plugins: [
		...
		new HtmlWebpackPlugin({
            template: paths.htmlPath(),
            inject: true,
        }),
        new HtmlWebpackTagsPlugin({
            append: false,
            scripts: ['static/Cesium/Cesium.js'],
            links: ['static/Cesium/Widgets/widgets.css'],
            publicPath: 'https://mesh-static.oss-cn-hangzhou.aliyuncs.com/',
        }),
		...
	]
	...
```

## 指南针

1. 安装依赖[cesium-navigation](https://www.npmjs.com/package/cesium-navigation)

```
yarn add cesium-navigation
```

2. html 中引入`cesium-navigation`, 也可以使用`html-webpack-tags-plugin`在 webpack 配置

```javascript
// html
 <script src="./node_modules/cesium-navigation/navigation.js"></script>

// 或配置webpack.config
...
	new HtmlWebpackTagsPlugin({
		append: false,
		scripts: ["static/cesium-navigation/navigation.js"],
		publicPath: "https://mesh-static.oss-cn-hangzhou.aliyuncs.com/",
	}),
...
```

3. 使用

```
Cesium.viewerCesiumNavigationMixin(viewer,{});
```

## 天地图
