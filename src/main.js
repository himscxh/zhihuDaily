// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import { Toast, Indicator  } from 'mint-ui'
import apiConfig from '../config/api.config.js'
import * as globalVar from './common/global.js'
import 'lib-flexible/flexible.js'
import './assets/iconfont/iconfont.css'
import './common/theme.less'
import "mint-ui/lib/style.css"


axios.defaults.baseURL = apiConfig.baseUrl;
Vue.config.productionTip = false

Vue.prototype.$ajax = axios;
Vue.prototype.$toast = Toast;
Vue.prototype.$wait = Indicator;

Object.keys(globalVar).forEach(key => {
  Vue.prototype[key] = globalVar[key];
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
