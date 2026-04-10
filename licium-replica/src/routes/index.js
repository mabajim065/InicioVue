import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/home.vue'
import RecordList from '../views/RecordList.vue'
import RecordDetail from '../views/RecordDetail.vue'
import CollectionList from '../views/CollectionList.vue'
import CollectionDetail from '../views/CollectionDetail.vue'
import MediaList from '../views/MediaList.vue'
import MediaDetail from '../views/MediaDetail.vue'
import Buscador from '../views/Buscador.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/records', component: RecordList },
    { path: '/records/:id', component: RecordDetail },
    { path: '/collections', component: CollectionList },
    { path: '/collections/:id', component: CollectionDetail },
    { path: '/media', component: MediaList },
    { path: '/media/:id', component: MediaDetail },
    { path: '/buscador', component: Buscador },
  ]
})

export default router