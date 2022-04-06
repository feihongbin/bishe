import Vue from 'vue'
import App from './App'

import uView from '@/uni_modules/uview-ui'
Vue.config.productionTip = false

Vue.use(uView);
App.mpType = 'app'

Vue.prototype.$baseUrl='http://localhost:3000'
const app = new Vue({
    ...App
})
app.$mount()
