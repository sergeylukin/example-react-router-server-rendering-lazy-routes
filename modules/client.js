import React from 'react'
import { match, Router, browserHistory } from 'react-router'
import { render } from 'react-dom'
import RouteRoute from './routes/RootRoute'

// calling `match` is simply for side effects of
// loading route/component code for the initial location
const lazyRender = (history, routes) => {
  const { pathname, search, hash } = window.location
  const location = `${pathname}${search}${hash}`

  match({
    routes,
    location,
    history
  }, (error, redirectLocation, renderProps) => {
    if(redirectLocation) {
       history.replace(redirectLocation);
       // redirect and re render
       lazyRender(history, routes)
    } else {
      render(
        <Router {...renderProps} />,
        document.getElementById('app')
      )
    }
  })
}

lazyRender(browserHistory, RouteRoute);
