import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AttractionsPage from '../views/AttractionsPage.vue'
import RouteDetailPage from '../views/RouteDetailPage.vue'
import PersonalCenterPage from '../views/PersonalCenterPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/attractions', component: AttractionsPage },
  { path: '/routes', redirect: '/' },
  { path: '/route/:id', component: RouteDetailPage },
  { path: '/orders', component: PersonalCenterPage, props: { initialTab: 'orders' } },
  { path: '/profile', component: PersonalCenterPage, props: { initialTab: 'profile' } },
  { path: '/reviews', component: PersonalCenterPage, props: { initialTab: 'reviews' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
