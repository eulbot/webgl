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

module.exports = {
  entry: './03-mesh/main.ts',
  output: {
    filename: '03-mesh/dist/main.js'
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    loaders: [
      {test: /\.ts$/, exclude: /node_modules/, loader: "ts-loader"}
    ]
  }
};