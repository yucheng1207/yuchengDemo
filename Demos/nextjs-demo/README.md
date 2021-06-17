这是一个 [Next.js](https://nextjs.org/) 项目，使用 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 创建。

## Basic Features

-   [默认支持的 Feature](https://nextjs.org/docs/basic-features/pages)
    -   (动态)路由
    -   内置 CSS/Sass 支持
        -   可以在 JavaScript 文件导入 CSS 文件
        -   CSS-in-Js：捆绑了[styled-jsx](https://github.com/vercel/styled-jsx)以提供对隔离作用域 CSS 的支持（需要注意的是它 `不支持服务器渲染并且只支持 JS` ）
    -   图像优化
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
pages/api 目录映射到/api/\*. 此目录中的文件被视为 API 路由而不是 React 页面。

## Deploy on Vercel

部署 Next.js 应用程序的最简单方法是使用 Next.js 创建者提供的[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

查看 [Next.js 部署文档](https://nextjs.org/docs/deployment) 以获取更多详细信息
