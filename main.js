import Vue from 'vue'
import App from './App'

import uView from '@/uni_modules/uview-ui'
import io from './common/weapp.socket.io.js'
Vue.config.productionTip = false
Vue.prototype.socket = io('http://localhost:8082')

Vue.use(uView);
App.mpType = 'app'

Vue.prototype.$baseUrl='http://localhost:3000'
const app = new Vue({
    ...App
})
app.$mount()
