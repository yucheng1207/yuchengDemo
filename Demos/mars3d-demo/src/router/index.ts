import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home/index.vue'
import Vuex from '@/views/Vuex/index.vue'
import Test from '@/views/Text/index.vue'
import Mars3d from '@/views/Mars3d/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/vuex',
    name: 'Vuex',
    component: Vuex
  },
  {
    path: '/mars3d',
    name: 'Mars3d',
    component: Mars3d
  },
  {
    path: '/axios',
    name: 'Axios',
    component: () => import('@/views/Axios/index.vue') // 懒加载组件
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
