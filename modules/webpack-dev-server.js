const webpack = require('webpack');
const config = require('../webpack.config');
const WebpackDevServer = require('webpack-dev-server');

const PROD = process.env.NODE_ENV === "production";
const DEV = !PROD;
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Add webpack's hot reloading snippet
// NOTE: currently only one entry is supported
// (e.g. { entry: 'client.js' })
// TODO: support all kinds of entry values
config.entry = [config.entry];
config.entry.unshift('webpack/hot/only-dev-server');
config.entry.unshift(`webpack-dev-server/client?http://${HOST}:${PORT}/`);

const server = new WebpackDevServer(webpack(config), {

  // Proxy main Express server
  proxy: {
    "*" : `http://${HOST}:${PORT - 1}`
  },

  publicPath: config.output.publicPath,

  headers: {'Access-Control-Allow-Origin': '*'},

  // Enable history API fallback so HTML5 History API based
  // routing works. This is a good default that will come
  // in handy in more complicated setups.
  historyApiFallback: true,

  hot: true,

  // Display only errors to reduce the amount of output.
  stats: 'errors-only'

}).listen(PORT, HOST, function(err, result) {
  if (err) {
    return console.log(err);
  }

  console.log(`Webpack dev server listening on http://${HOST}:${PORT}/`)
});
