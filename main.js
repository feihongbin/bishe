import Vue from 'vue'
import App from './App'

import uView from '@/uni_modules/uview-ui'
import io from './js_sdk/hyoga-uni-socket_io/uni-socket.io.js'
import Utils from "./utils/until.js"
Vue.prototype.$Utils = Utils
Vue.config.productionTip = false
Vue.prototype.socket = io('http://127.0.0.1:8082',{
  query: {},
  transports: [ 'websocket', 'polling' ],
  timeout: 5000,
})

Vue.use(uView);
App.mpType = 'app'

// 150.158.170.119
Vue.prototype.$baseUrl='http://127.0.0.1:3000'
const app = new Vue({
    ...App
})
app.$mount()
