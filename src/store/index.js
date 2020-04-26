import Vue from 'vue'
import Vuex from "vuex"
//用户信息
import user from './modules/user'
//侧边导航权限
import permission from './modules/permission'
//tab菜单
import tabsview from './modules/tabsview'
// 全局数据
import global from './modules/global'
Vue.use(Vuex)

// export default new Vuex.Store({
//   modules: {
//     user,
//     permission,
//     tabsview
//   }
// })
import getters from './getters'
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
const store = new Vuex.Store({
  modules,
  getters,
  tabsview
})

export default store
