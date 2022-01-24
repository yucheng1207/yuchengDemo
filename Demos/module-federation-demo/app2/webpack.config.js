const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const TarWebpackPlugin = require('tar-webpack-plugin').default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3002,
    hot: false
  },
  // watchOptions: {
	// 	ignored: ['./dist/**', './node_modules/**'],
	// },
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
      {
				test: /\.scss$/,
				exclude: [/node_modules/],
				oneOf: [
					{
						test: /\.module\.scss$/,
						use: [
							MiniCssExtractPlugin.loader,
							{
								loader: "css-loader",
								options: {
									modules: {
										localIdentName:
											"[path][name]__[local]--[hash:base64:5]",
									},
									sourceMap: true,
								},
							},
							{
								loader: "sass-loader",
								options: {
									sourceMap: true,
								},
							},
						],
					},
					{
						use: [
							MiniCssExtractPlugin.loader,
							{
								loader: "css-loader",
								options: {
									sourceMap: true,
								},
							},
							{
								loader: "sass-loader",
								options: {
									sourceMap: true,
								},
							},
						],
					},
				],
			},
      {
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
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
    new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
    new ModuleFederationPlugin({
      name: "app2",
      library: { type: "var", name: "app2" }, // 该名称要与消费者 remote 中的 name 保持一致
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/Button",
      },
      shared: {
        react: {
					singleton: true,
					requiredVersion: false,
					version: false,
				},
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new TarWebpackPlugin({
      action: 'c',
      gzip: true,
      cwd: path.resolve(process.cwd(), 'dist'),
      file: path.resolve(process.cwd(), 'dist', 'app2-ts.tgz'),
      fileList: ['app2'],
      delSource: true
    })
  ],
};
