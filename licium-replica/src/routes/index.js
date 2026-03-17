import { createRouter, createWebHistory } from 'vue-router'

import RecordList from '../views/RecordList.vue'
import RecordDetail from '../views/RecordDetail.vue'
import CollectionList from '../views/CollectionList.vue'
import CollectionDetail from '../views/CollectionDetail.vue'

const routes = [
  {
  path: '/',
  redirect: '/record'
},
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router