// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
 import axios from './utils/http'
// 引入JQ
// import $ from 'jquery'
import ElementUI from 'element-ui' // element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'

// post请求是格式化数据
import qs from 'qs' // element-ui的css

import http from './utils/http'
Vue.prototype.$axios = http

Vue.use(ElementUI)
// 禁用生产提示
Vue.config.productionTip = false
Vue.prototype.$qs = qs
// 使用模块
/* eslint-disable no-new */

/*刷新*/
/*Vue.$forceUpdate()*/
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
