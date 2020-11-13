import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import './config/globalconfig'
// animate动画
import 'animate.css'
// ElementUI组件
import './components/ElementUI'

// 全局样式
import './assets/style/global.styl'
// 全局过滤器
import './plugins/filters'
// 自定义公共组件
import './components/'
import api from '@/api'
import bus from '@/plugins/bus'
import utils from '@/plugins/utils'
// import promission from './promission'
import './plugins/directives'

import '@/assets/style/theme/index.css'

Vue.prototype.$api = api
Vue.prototype.$utils = utils
Vue.prototype.$vgo = bus
Vue.prototype.$WD = window

window.$globalconfig.serviceTel = '400-9975-996'

Vue.config.productionTip = false
document.body.classList.add(utils.UAis('pc') ? 'pc-mode' : 'mobile-mode')
new Vue({
  router,
  store,
  // mixins: [promission],
  render: h => h(App),
}).$mount('#app')
