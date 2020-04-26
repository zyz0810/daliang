import router from '@/router'
import store from '@/store/index'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { asyncRoutes, fixedRouter } from '@/router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login']

function getToken() {
  let UserInfo = sessionStorage.getItem('UserInfo')
  if (UserInfo) {
    return JSON.parse(UserInfo).userToken
  } else {
    return ''
  }
}

router.beforeEach((to, from, next) => {
  let routeLists = store.getters.asyncRoutes;
  NProgress.start()
  if (getToken()) {
    if (to.path !== '/login') {
      routeLists.length ? next() : gotoRouter(to, next)
    } else {
      next('/')
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(()=>{
  NProgress.done()
})


async function gotoRouter(to, next) {
  let routerLists = asyncRoutes
  store.dispatch('permission/generateRoutes', routerLists.concat(fixedRouter)).then(() => {
    router.addRoutes(routerLists)
    next({ ...to, replace: true })
    NProgress.done()
  })
}
