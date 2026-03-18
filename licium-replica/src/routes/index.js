import { createRouter, createWebHistory } from 'vue-router'

// Importación de vistas
import Home from '../views/home.vue'
import RecordList from '../views/RecordList.vue'
import RecordDetail from '../views/RecordDetail.vue'
import CollectionList from '../views/CollectionList.vue'
import CollectionDetail from '../views/CollectionDetail.vue'

// Definición de rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    // Listado de records con paginación
    path: '/record',
    name: 'RecordList',
    component: RecordList
  },
  {
    // Detalle de un record por id
    path: '/record/:id',
    name: 'RecordDetail',
    component: RecordDetail
  },
  {
    // Listado de colecciones
    path: '/collections',
    name: 'CollectionList',
    component: CollectionList
  },
  {
    // Detalle de una colección por id
    path: '/collections/:id',
    name: 'CollectionDetail',
    component: CollectionDetail
  }
]

// Crear el router con historial de navegación
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router