const HtmlWebpackPlugin = require("html-webpack-plugin");
const TarWebpackPlugin = require('tar-webpack-plugin').default;
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3002,
    hot: false
  },
  watchOptions: {
		ignored: ['./dist/**', './node_modules/**'],
	},
  output: {
    publicPath: "auto",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
          {
            loader: 'dts-loader',
            options: {
              name: 'app2', // The name configured in ModuleFederationPlugin
              exposes: { // The exposes configured in ModuleFederationPlugin
                "./Button": "./src/Button.tsx",
              },
              typesOutputDir: './dist' // Optional, default is '.wp_federation'
            },
          },
        ],
      },
      // {
      //   test: /bootstrap\.tsx$/,
      //   loader: "bundle-loader",
      //   options: {
      //     lazy: true,
      //   },
      // },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      library: { type: "var", name: "app2" },
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/Button",
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new TarWebpackPlugin({
      action: 'c',
      gzip: true,
      cwd: path.resolve(process.cwd(), 'dist'),
      file: path.resolve(process.cwd(), 'dist', 'app2-ts.tgz'),
      fileList: ['app2']
    })
  ],
};
