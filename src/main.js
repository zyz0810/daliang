import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import store from "@/store/index"
import '@/directive/index'
import '@/common/permission'
import './iconfont/iconfont.css'
// 全局图标
import './icons'
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

