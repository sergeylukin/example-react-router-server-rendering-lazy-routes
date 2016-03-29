var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');

var webpack_isomorphic_tools_plugin =
  // webpack-isomorphic-tools settings reside in a separate .js file
  // (because they are used in the web server code too).
  new Webpack_isomorphic_tools_plugin(require('./webpack-isomorphic-tools.config'))
    // also enter development mode since it's a development webpack configuration
    .development();

module.exports = {
  context: path.resolve(__dirname),

  devtool: 'eval-source-map',

  entry: './modules/client.js',

  output: {
    path: __dirname + '/__build__',
    filename: '[hash].bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    loaders: [
      {
        test: webpack_isomorphic_tools_plugin.regular_expression('images'),
        loader: 'url-loader?limit=10240', // any image below or equal to 10K will be converted to inline base64 instead
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, 'modules'),
        loaders: ['react-hot', 'babel?cacheDirectory']
      }
    ]
  },

  plugins: [
    webpack_isomorphic_tools_plugin,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: { warnings: false },
    // }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]

}
