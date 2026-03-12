import { createRouter, createWebHistory } from 'vue-router'

import RecordList from '../views/RecordList.vue'
import RecordDetail from '../views/RecordDetail.vue'
import CollectionList from '../views/CollectionList.vue'
import CollectionDetail from '../views/CollectionDetail.vue'

const routes = [
  // registros
  {
    path: '/',
    redirect: '/record'
  },
  // Listado y ficha de Registros
  {
    path: '/record',
    name: 'RecordList',
    component: RecordList
  },
  {
    path: '/record/:id',
    name: 'RecordDetail',
    component: RecordDetail
  },
  // Listado y contenido de Colecciones
  {
    path: '/collections',
    name: 'CollectionList',
    component: CollectionList
  },
  {
    path: '/collections/:id',
    name: 'CollectionDetail',
    component: CollectionDetail
  }
]

// confi del navegador
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router