import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/home/Index.vue') },
  { path: '/rooms', name: 'rooms', component: () => import('@/views/rooms/Index.vue') },
  { path: '/rooms/:id', name: 'room-detail', component: () => import('@/views/rooms/Detail.vue') },
  { path: '/food', name: 'food', component: () => import('@/views/food/Index.vue') },
  { path: '/shop', name: 'shop', component: () => import('@/views/shop/Index.vue') },
  { path: '/shop/:id', name: 'shop-detail', component: () => import('@/views/shop/Detail.vue') },
  { path: '/rent', name: 'rent', component: () => import('@/views/rent/Index.vue') },
  { path: '/orders', name: 'orders', component: () => import('@/views/orders/Index.vue') },
  { path: '/profile', name: 'profile', component: () => import('@/views/profile/Index.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
