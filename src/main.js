import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { router } from './router.js'
import './assets/inter/InterWeb/inter.css'
import './assets/css/tailwind.postcss'

Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
