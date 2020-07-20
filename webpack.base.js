const HtmlWebpackPlugin = require('html-webpack-plugin')
const isProd = (process.env.NODE_ENV === 'prod')
const path = require('path')
const Glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HashOutput = require('webpack-plugin-hash-output')
const entries = {}
const plugins = []

if (isProd) {
  plugins.push(HashOutput)
  plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/' + (isProd ? '[name].[contenthash:8].min.css' : '[name].css'),
      chunkFilename: 'css/' + (isProd ? '[name].chunk.[contenthash:8].min.css' : '[name].chunk.css')
    })
  )
}

Glob.sync('./src/pages/*/index.js').forEach(filePath => {
  const chunks = []
  const portion = filePath.split('/')
  const name = portion[3]
  entries[name] = [filePath]
  chunks.unshift(name)
  if (isProd) {
    chunks.unshift('assets')
    chunks.unshift('vendors')
  }
  plugins.push(
    new HtmlWebpackPlugin({
      // favicon: path.resolve(__dirname, `./src/assets/img/logo.png`),
      filename: path.resolve(__dirname, `./dist/${name}.html`),
      template: path.resolve(__dirname, `./src/pages/${name}/index.html`),
      chunks: chunks,
      chunksSortMode: 'manual',
      minify: isProd ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyJS: true
      } : false
    })
  )
})

module.exports = {
  entry: entries,
  output: {
    publicPath: isProd ? './' : '',
    path: path.resolve(__dirname, './dist'),
    filename: 'js/' + (isProd ? '[name].[chunkhash:8].min.js' : '[name].js'),
    chunkFilename: 'js/' + (isProd ? '[name].chunk.[chunkhash:8].min.js' : '[name].chunk.js')
  },
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery']
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attributes: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src'
                },
                {
                  tag: 'link',
                  attribute: 'href',
                  type: 'src'
                }
              ]
            }
          }
        }
      },
      {
        test: /\.(png|jpg|jpe?g|gif)$/,
        use: ['url-loader?limit=4096&name=[name]' + (isProd ? '.[hash:8]' : '') + '.[ext]&outputPath=img/', 'image-webpack-loader']
      },
      {
        test: /\.(webp)$/,
        use: ['file-loader?&name=[name]' + (isProd ? '.[hash:8]' : '') + '.[ext]&outputPath=img/']
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot)(\?.*$|$)/,
        loader: 'file-loader?name=font/[name].[hash:8].[ext]'
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [isProd ? ({
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../'
          }
        }) : 'style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [
                require('autoprefixer')
              ]
            }
          }
        }, 'sass-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    ...plugins
  ]
}
