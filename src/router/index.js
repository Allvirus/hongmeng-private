import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'
// import store from '@/store'
// import vgo from '@/plugins/bus'
// import promission from '@/promission'
NProgress.configure({ showSpinner: false })

Vue.use(Router)
const router = new Router({
  routes,
  // mode: 'history',
  // base: '/panoeditor',
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  // promission(to, from, next)
  next()
})

router.afterEach((to) => {
  NProgress.done()
})
export default router
