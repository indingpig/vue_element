var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: ["babel-polyfill", "./src/main.js"],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.eot/,
        loader: 'file-loader?prefix=font/'
      }, {
        test: /\.woff/,
        loader: 'file-loader?prefix=font/&limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf/,
        loader: 'file-loader?prefix=font/'
      }, {
        test: /\.svg/,
        loader: 'file-loader?prefix=font/'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    // 跨域处理
    hot: true, // 开启热点
    inline: true,
    progress: true,
    port: 8091, // 可选，修改webpack服务器的端口，默认为8080
    host: '0.0.0.0', // 可选，修改webpack服务器的主机，默认为localhost；
    proxy: {   // 代理的相关配置
      '/api/*' : { // 需要代理的地址： /api/*
        target: 'http://127.0.0.1:8888', // 目标地址
        changeOrigin: true,
        secure: false
      }
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
