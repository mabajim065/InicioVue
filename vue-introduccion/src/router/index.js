import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserDetail from '../views/UserDetail.vue'

// Aquí creamos las "carreteras" de nuestra web
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/', // Cuando la URL no tenga nada, mostramos el Inicio
      name: 'inicio',
      component: HomeView
    },
    {
      path: '/detalles', // Cuando la URL sea /detalles, mostramos el perfil
      name: 'detalles',
      component: UserDetail
    }
  ]
})

export default router