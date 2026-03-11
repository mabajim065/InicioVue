import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BeachDetail from '../views/BeachDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: HomeView
    },
    {
   
      path: '/detalles/:id',
      name: 'detalles',
      component: BeachDetail
    }
  ]
})

export default router