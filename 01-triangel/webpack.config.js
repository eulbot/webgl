var splitSourceMaps = (info) => {
  if (info.resourcePath.startsWith('webpack'))
    return `webpack:///${info.resourcePath}`;
  else if (info.resourcePath.indexOf('@') > 0) {
    var cl = info.resourcePath.substring(info.resourcePath.indexOf('@'));
    var scope = cl.substring(1, cl.indexOf('/'));
    var path = cl.substring(cl.indexOf('/'));
    return `${scope}://${path}`;
  }
  else
    return '../'.concat(info.resourcePath);
}

var webpack = require("webpack");
var path = require('path');

module.exports = {
  entry: './01-triangel/main.ts',
  output: {
    filename: '../dist/main.js',
    path: __dirname,
    devtoolModuleFilenameTemplate: splitSourceMaps
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.ts']
  },
  module: {
    loaders: [
      {test: /\.ts$/, exclude: /node_modules/, loader: "ts-loader"}
    ]
  }
};