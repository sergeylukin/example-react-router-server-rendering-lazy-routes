// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

export default {
  path: 'landing-page',
  // component: require('../components/LandingPage').default,
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../components/LandingPage').default)
    })
  }
}
