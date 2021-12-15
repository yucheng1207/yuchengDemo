const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: ["a-loader", "b-loader", "c-loader"],
      },
    ],
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "loaders"),
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
        patterns: [{ from: path.resolve(__dirname, "public"), to: '.' }],
        options: {
            concurrency: 100,
        },
    }),
],
};
