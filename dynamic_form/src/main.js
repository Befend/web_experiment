import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Bus from './store/bus'
// 引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$bus = Bus
// 阻止启动生产消息
Vue.config.productionTip = false
Vue.use(ElementUI)
const startApp = () => {
  new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App)
  })
}

startApp()
