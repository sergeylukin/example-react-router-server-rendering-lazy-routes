import path from 'path';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';

import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import fs from 'fs'
import { createPage, write, writeError, writeNotFound, redirect } from './utils/server-utils'
import routes from './routes/RootRoute'

const PROD = process.env.NODE_ENV === "production";
const DEV = !PROD;
const HOST = process.env.HOST || 'localhost';
let PORT = process.env.PORT || 3000;
// In development environment, webpack-dev-server serves all the stuff
// and proxies all the requests from PORT minus one, so if
// our default port is 3000, than webpack-dev-server will proxy
// all unknown requests to port 2999
if (DEV) {
  PORT = PORT - 1;
}
const rootDir = path.resolve(__dirname, '..');

/**
 ** Define isomorphic constants.
 **/
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = DEV;
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack-isomorphic-tools.config'))
  .development(DEV)
  .server(rootDir, function() {
    const app = express();

    function renderApp(props, res) {
      const markup = renderToString(<RouterContext {...props}/>)
      const html = createPage(markup)
      write(html, 'text/html', res)
    }

    app.use((req, res) => {

      if (__DEVELOPMENT__) {
        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        webpackIsomorphicTools.refresh();
      }

      if (req.url === '/favicon.ico') {
        write('haha', 'text/plain', res)
      }

      // serve JavaScript assets
      else if (/__build__/.test(req.url)) {
        fs.readFile(`.${req.url}`, (err, data) => {
          write(data, 'text/javascript', res)
        })
      }

      // handle all other urls with React Router
      else {
        match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
          if (error)
            writeError('ERROR!', res)
          else if (redirectLocation)
            redirect(redirectLocation, res)
          else if (renderProps)
            renderApp(renderProps, res)
          else
            writeNotFound(res)
        })
      }

    }).listen(PORT, HOST, function(err, result) {
      if (err) {
        return console.log(err);
      }

      console.log(`App listening on http://${HOST}:${PORT}`)
    });
  });
