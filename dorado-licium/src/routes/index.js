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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/records', name: 'RecordList', component: RecordList },
    { path: '/records/:id', name: 'RecordDetail', component: RecordDetail, props: true },
    { path: '/collections', name: 'CollectionList', component: CollectionList },
    { path: '/collections/:id', name: 'CollectionDetail', component: CollectionDetail, props: true },
    { path: '/media', name: 'MediaList', component: MediaList },
    { path: '/media/:id', name: 'MediaDetail', component: MediaDetail, props: true },
    { path: '/buscador', name: 'Buscador', component: Buscador },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router