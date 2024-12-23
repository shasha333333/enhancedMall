import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: '/productList', component: () => import('../views/front/productList.vue') },
  { path: '/productDetail/:id', component: () => import('../views/front/productDetail.vue') },
  { path: '/cart', component: () => import('../views/front/cart.vue') },
  { path: '/buy', component: () => import('../views/front/buy.vue') },
  { path: '/order', component: () => import('../views/front/order.vue') },
  { path: '/profile', component: () => import('../views/front/profile.vue') },
  { path: '/profileManage', component: () => import('../views/front/profileManage.vue') },
]

const router = new VueRouter({
  routes
})

export default router
