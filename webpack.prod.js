const baseWebpackConfig = require('./webpack.base')
const { merge } = require('webpack-merge')
const path = require('path')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  optimization: {
    minimize: true,
    splitChunks: {
      minSize: 0,
      minChunks: 1,
      maxAsyncRequests: 50,
      maxInitialRequests: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -1,
          chunks: 'all',
          name: 'vendors'
        },
        assets: {
          test: path.resolve(__dirname, './src/assets'),
          priority: -10,
          chunks: 'all',
          name: 'assets'
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new OptimizeCssAssetsPlugin()
  ]
})
