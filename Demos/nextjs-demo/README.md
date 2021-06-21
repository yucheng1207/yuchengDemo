这是一个 [Next.js](https://nextjs.org/) 项目，使用 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 创建。

## Basic Features

-   [默认支持的 Feature](https://nextjs.org/docs/basic-features/pages)
    -   (动态)路由
    -   [国际化路由](https://nextjs.org/docs/advanced-features/i18n-routing)
    -   内置 CSS/Sass 支持
        -   可以在 JavaScript 文件导入 CSS 文件
        -   CSS-in-Js：捆绑了[styled-jsx](https://github.com/vercel/styled-jsx)以提供对隔离作用域 CSS 的支持（需要注意的是它 `不支持服务器渲染并且只支持 JS` ）
    -   [图像优化](https://nextjs.org/docs/basic-features/image-optimization)
    -   字体优化
    -   [静态文件服务](https://nextjs.org/docs/basic-features/static-file-serving) （./public/ is mapped to /）
    -   [React 快速刷新](https://nextjs.org/blog/next-9-4#fast-refresh)
    -   ESLint
    -   支持 Typescript
    -   环境变量： 支持从`.env.local`加载环境变量`process.env`。
    -   [两种预渲染形式](https://nextjs.org/docs/basic-features/data-fetching): 和 服务端渲染
        -   静态生成（`getStaticProps` 或 `getStaticPaths`）：HTML 在构建时生成，并将在每个请求中重用。
        -   服务器端渲染（`getServerSideProps`）： HTML 是针对每个请求生成的。
    -   自动编译打包（使用 webpack 和 babel ）

## Document

-   [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 功能和 API。
-   [学习 Next.js](https://nextjs.org/learn) - Next.js 教程。
-   [Examples](https://github.com/vercel/next.js/tree/master/examples) - Next.js 例子
-   [Deploy](https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app) - Vercel 部署 NextJs

## Getting Started

```bash
// Starts the development server.
npm run dev

// Builds the app for production.
npm run build

// Runs the built app in production mode.
npm start
```

使用浏览器打开 http://localhost:3000 以查看结果。
src/pages/api 目录映射到/api/\*. 此目录中的文件被视为 API 路由而不是 React 页面。

## Deploy on Vercel

部署 Next.js 应用程序的最简单方法是使用 Next.js 创建者提供的[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

查看 [Next.js 部署文档](https://nextjs.org/docs/deployment) 以获取更多详细信息

## Note

### 路由配置

-   NextJs 默认识别`pages`或者`src/pagaes`下的文件作为路由，如`src/pages/abouts.js`对应的路由为`/about`
-   `pages/_app.tsx`可以[自定义 App 组件](https://nextjs.org/docs/advanced-features/custom-app)来控制页面的初始化
-   `pages/_document`可以[自定义 Document](https://nextjs.org/docs/advanced-features/custom-document)
-   `pages/404.tsx`、`pages/500.tsx`和`pages/_error.tsx`可以[自定义 错误页面](https://nextjs.org/docs/advanced-features/custom-error-page)
-   next.config.js 的`i18n`属性可[配置国际化路由](https://nextjs.org/docs/advanced-features/i18n-routing)，搭配`react-intl`可实现国际化

### 国际化

1. next.config.js 中[配置国际化路由](https://nextjs.org/docs/advanced-features/i18n-routing)

```
// next.config.js
module.exports = {
	i18n: {
		locales: ['zh-CN', 'en-US'],
		defaultLocale: 'zh-CN',
	},
}
```

2. 引入`react-intl`, 并使用`IntlProvider`注入 intl

```
// IntlContainer组件
export const IntlContainer: React.FunctionComponent<{}> = (props) => {
	const router = useRouter()
	const locale = useMemo<Locales>(() => {
		return router.locale as Locales
	}, [router])

	return <div style={{ width: '100%', height: '100%' }}>
		<IntlProvider
			locale={locale}
			messages={getLocales(locale)}
			onError={(err) => {
				// react-intl itself doesn't inherently have any locale-data. Ignore Error
				console.warn(err)
			}}
		>
			{props.children}
		</IntlProvider>
	</div>
}


// _app.tsx
function MyApp({ Component, pageProps }: AppProps) {
	return <IntlContainer>
		<Component {...pageProps} />
	</IntlContainer>
}
export default MyApp

```

3. 在页面中使用

```
// 方法一：使用useIntl
import { useIntl } from "react-intl";
const intl = useIntl()
intl.formatMessage({ id })

// 方法二: 使用FormattedMessage组件
import { FormattedMessage } from "react-intl";
<FormattedMessage
	id={id}
/>
```

### [Image 组件]](https://nextjs.org/docs/basic-features/image-optimization)

-   源码: https://github.com/vercel/next.js/blob/canary/packages/next/client/image.tsx

#### 使用 Next.js 图像组件`next/image`即可获得以下特性

-   支持导入本地和远程图片
    -   直接 import 一个`本地图片`时，width、height、 和 blurDataURL 会自动提供给图像组件；对于`动态或远程的图像`则必须提供 src、width、height 属性并且要手动设置 blurDataURL。
    -   使用`远程url`时必须在`next.config.js`中设置`domains`或者`loader`,确保外部网址不会被滥用
-   支持使用阿里云 Oss Url，设置`next/image`的 src、quality 和 width 属性可以自动获取带优化参数的 oss Url（也可以使用 image 的 loader 属性自定义 url 格式）， 当然使用时也需要在`next.config.js`中设置`domains
-   支持懒加载（设置 loading 属性， 默认就是 lazy 模式）
-   支持设置图片被完全加载前的展示效果（设置 placeholder 和 blurDataURL 属性）
    -   预览图
    -   微光图
    -   纯色图
-   支持设置不同的布局行为，`fixed`、`intrinsic`（默认）、`responsive`、`fill`。
    -   fixed: 图像尺寸不会随着视口变化（无响应）而变化，类似于原生 img 元素。[fixed 演示](https://image-component.nextjs.gallery/layout-fixed)
    -   intrinsic: 视口的尺寸不足时缩小图像，视口比图像尺寸大时保持原始尺寸。[intrinsic 演示](https://image-component.nextjs.gallery/layout-intrinsic)
    -   responsive: 视口的尺寸不足时缩小图像，视口比图像尺寸大时放大图像。[responsive 演示](https://image-component.nextjs.gallery/layout-responsive)
    -   fill: 图像将宽度和高度拉伸到父元素的尺寸, 可以搭配`objectFit`和`objectPosition`使用，比如当图片作为背景图时，可以设置`layout="fill" objectFit="cover"`。[fill 演示](https://image-component.nextjs.gallery/layout-fill)，[作为 background 演示](https://image-component.nextjs.gallery/background)
-   [自动生成图片缓存](https://nextjs.org/docs/basic-features/image-optimization#caching)
-   响应式图像，`next/image`会根据`Device Sizes`和`Image Sizes`设置图像的`srcSet`属性使得图片在不同的屏幕上都有较好的显示，达到响应式效果。这个概念比较复杂，请看下面的详细讲解。

#### 响应式图像（Device Sizes & Image Sizes）

-   TBD

```
  const widths = [
    ...new Set(
      // > This means that most OLED screens that say they are 3x resolution,
      // > are actually 3x in the green color, but only 1.5x in the red and
      // > blue colors. Showing a 3x resolution image in the app vs a 2x
      // > resolution image will be visually the same, though the 3x image
      // > takes significantly more data. Even true 3x resolution screens are
      // > wasteful as the human eye cannot see that level of detail without
      // > something like a magnifying glass.
      // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
      [width, width * 2 /*, width * 3*/].map(
        (w) => allSizes.find((p) => p >= w) || allSizes[allSizes.length - 1]
      )
    ),
  ]
```

###### 注意：

-   <Image />组件上的其他属性将传递给底层 img 元素，但以下情况除外：
    -   style. 使用 `className` 来代替。
    -   srcSet. 使用 `Device Sizes` 来代替。
    -   decoding. next/imgae 强制设置为`async`。

#### 参考

-   [图像优化](https://nextjs.org/docs/basic-features/image-optimization)
-   [next/Image 组件所有属性](https://nextjs.org/docs/api-reference/next/image)
-   [Understanding Next/Image](https://dev.to/yago/understanding-next-image-13ff)
-   [Using Next.js Image Component to Improve Your Website’s Performance](https://blog.griddynamics.com/using-next-js-image-component-to-improve-your-websites-performance/)

## Todos

-   封装 Image 组件
-   部署配置
