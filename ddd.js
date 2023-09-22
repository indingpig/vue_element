'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/sit3/bsmpw': {
        target: 'https://sit3.dashuf.com/bsmpw',
        pathRewrite: {
          '/sit3/bsmpw': '/'
        },
        changeOrigin: true,
        secure: false
      },
      '/sit3/api/mgms/': {
        target: 'https://sit3.dashuf.com',
        pathRewrite: {
          '/sit3': '/api/mgms/'
        },
        changeOrigin: true,
        secure: false
      },
      // '/sit1/pmbs': {
      //   target: 'http://pmbs-sit1.dsfdc.com',
      //   pathRewrite: {
      //     '/sit1/pmbs': '/pmbs'
      //   },
      //   changeOrigin: true,
      //   secure: false
      // },
      '/sit1/pmbsweb': {
        target: 'https://sit1.dashuf.com/pmbsweb',
        pathRewrite: {
          '/sit1/pmbsweb': '/'
        },
        changeOrigin: true,
        secure: false
      },
      '/sit3': {
        target: 'https://sit3.dashuf.com',
        pathRewrite: {
          '/sit3': ''
        },
        changeOrigin: true,
        secure: false
      },
      '/sit6': {
        target: 'https://sit6.dashuf.com/ucssp',
        pathRewrite: {
          '/sit6': '/'
        },
        changeOrigin: true,
        secure: false
      },
      '/sit1': {
        target: 'https://sit1.dashuf.com',
        pathRewrite: {
          '/sit1': ''
        },
        changeOrigin: true,
        secure: false
      },
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8000, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'source-map',
    // devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    crawlerPathprd: './8X6P32GIx4.txt',
    crawlerPath: './puyhA5S6AQ.txt',
    newRetailPath: './kvxk3mFfMd.txt',
    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
