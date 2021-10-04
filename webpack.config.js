const path = require('path');
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index.js',
    // libraryTarget: 'commonjs2',
    library: 'LIB',
    libraryTarget: 'var',
  },
  plugins: [new EsmWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
