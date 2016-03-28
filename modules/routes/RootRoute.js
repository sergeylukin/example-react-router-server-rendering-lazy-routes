// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

import App from '../components/App'
import Index from '../components/Index'

export default {
  component: App,
  path: '/',
  childRoutes: [
    require('./AboutRoute').default,
    require('./LandingPageRoute').default
  ],
  indexRoute: {
    component: Index
  }
}
