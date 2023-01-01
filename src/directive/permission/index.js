import hasRole from './hasRole'
import hasPermi from './hasPermi'
import stowExpand from './stowExpand'

const install = function(Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('stowExpand', stowExpand)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window['stowExpand'] = stowExpand
  Vue.use(install); // eslint-disable-line
}

export default install
