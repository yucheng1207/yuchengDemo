const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackRemoteTypesPlugin = require("webpack-remote-types-plugin").default;
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3001,
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
        use: "ts-loader",
        exclude: /node_modules/,
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
  //http://localhost:3002/remoteEntry.js
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      remotes: {
        app2: `app2@${getRemoteEntryUrl(3002)}`,
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new WebpackRemoteTypesPlugin({
      remotes: {
        app2: `app2@http:${getRemoteEntryUrl(3002)}`,
      },
      outputDir: 'src/types',
      remoteFileName: '[name]-ts.tgz' // default filename is [name]-dts.tgz where [name] is the remote name, for example, `app` with the above setup
    }),
  ],
};

function getRemoteEntryUrl(port) {
    return `//localhost:${port}/remoteEntry.js`
}
