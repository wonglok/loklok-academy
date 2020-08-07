import VueRouter from 'vue-router'

export const routes = [
  {
    path: '/',
    component: () => import('./components/WebGL/AppUIs/Dancer/Dancer.vue')
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes
})
