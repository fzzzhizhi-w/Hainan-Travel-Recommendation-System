import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AttractionsPage from '../views/AttractionsPage.vue'
import RoutesPage from '../views/RoutesPage.vue'
import RouteDetailPage from '../views/RouteDetailPage.vue'
import PersonalCenterPage from '../views/PersonalCenterPage.vue'
import LoginPage from '../views/LoginPage.vue'

import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminContent from '../views/admin/AdminContent.vue'
import AdminOrders from '../views/admin/AdminOrders.vue'
import AdminUsers from '../views/admin/AdminUsers.vue'
import AdminReviews from '../views/admin/AdminReviews.vue'
import AdminConfig from '../views/admin/AdminConfig.vue'
import AdminSystem from '../views/admin/AdminSystem.vue'

import MerchantLayout from '../views/merchant/MerchantLayout.vue'
import MerchantDashboard from '../views/merchant/MerchantDashboard.vue'
import MerchantInventory from '../views/merchant/MerchantInventory.vue'
import MerchantOrders from '../views/merchant/MerchantOrders.vue'
import MerchantCheckout from '../views/merchant/MerchantCheckout.vue'
import MerchantSettlement from '../views/merchant/MerchantSettlement.vue'
import MerchantReviews from '../views/merchant/MerchantReviews.vue'

const routes = [
  { path: '/login', component: LoginPage, meta: { layout: 'blank' } },

  { path: '/', component: HomePage },
  { path: '/attractions', component: AttractionsPage },
  { path: '/routes', component: RoutesPage },
  { path: '/route/:id', component: RouteDetailPage },
  { path: '/orders', component: PersonalCenterPage, props: { initialTab: 'orders' } },
  { path: '/profile', component: PersonalCenterPage, props: { initialTab: 'profile' } },
  { path: '/reviews', component: PersonalCenterPage, props: { initialTab: 'reviews' } },
  { path: '/favorites', component: PersonalCenterPage, props: { initialTab: 'favorites' } },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { layout: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'content', component: AdminContent },
      { path: 'orders', component: AdminOrders },
      { path: 'users', component: AdminUsers },
      { path: 'reviews', component: AdminReviews },
      { path: 'config', component: AdminConfig },
      { path: 'system', component: AdminSystem },
    ]
  },

  {
    path: '/merchant',
    component: MerchantLayout,
    meta: { layout: 'merchant' },
    children: [
      { path: '', redirect: '/merchant/dashboard' },
      { path: 'dashboard', component: MerchantDashboard },
      { path: 'inventory', component: MerchantInventory },
      { path: 'orders', component: MerchantOrders },
      { path: 'checkout', component: MerchantCheckout },
      { path: 'settlement', component: MerchantSettlement },
      { path: 'reviews', component: MerchantReviews },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
