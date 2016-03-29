import React from 'react'
import logo_url from './logo.png';

export default class LandingPage extends React.Component {
  render() {
    return (
      <div>
        <h2>Shiny landing page</h2>
        <p>
          Hooray
        </p>
        <img src={logo_url} width="200" height="200" />
      </div>
    )
  }
}


