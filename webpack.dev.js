const baseWebpackConfig = require('./webpack.base')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    noEmitOnErrors: true,
    namedModules: true
  },
  devtool: 'eval-source-map',
  devServer: {
    index: 'bootstrap.html',
    inline: true,
    open: true,
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '',
    compress: true,
    host: 'localhost',
    port: 9000,
    overlay: {
      warnings: false,
      errors: true
    }
  }
})
