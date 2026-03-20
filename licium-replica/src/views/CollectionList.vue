<template>
  <div class="collection-list">

    <!-- título de la página -->
    <div class="page-header">
      <h1>Colecciones</h1>
      <p>Explora las colecciones disponibles</p>
    </div>

    <!-- cargando -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando colecciones...</p>
    </div>

    <!-- algo fue mal -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchCollections">Reintentar</button>
    </div>

    <!-- las tarjetas y la paginación -->
    <template v-else>
      <div class="collections-grid">
        <router-link
          v-for="col in collections"
          :key="col.id"
          :to="`/collections/${col.id}`"
          class="collection-card"
        >
          <!-- foto de la colección -->
          <div class="col-image">
            <img v-if="getColThumbnail(col)" :src="getColThumbnail(col)" :alt="getColTitle(col)" loading="lazy" @error="handleImageError" />
            <div v-else class="no-image"></div>
          </div>

          <!-- nombre y descripción -->
          <div class="col-body">
            <h3>{{ getColTitle(col) }}</h3>
            <p v-if="getColDescription(col)" class="col-desc">{{ getColDescription(col) }}</p>
          </div>
        </router-link>
      </div>

      <!-- paginación -->
      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="goToPage" />
    </template>

  </div>
</template>

<script>
import { getCollections } from '../api/licium.js'
import Pagination from '../components/Pagination.vue'

export default {
  components: { Pagination },

  data() {
    return {
      collections: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalCollections: 0,
      limit: 24
    }
  },

  computed: {
    // cuántas páginas hay en total
    totalPages() {
      return Math.ceil(this.totalCollections / this.limit) || 1
    }
  },

  created() {
    this.fetchCollections()
  },

  methods: {
    // pide las colecciones a la API
    async fetchCollections() {
      this.loading = true
      this.error = null
      try {
        const offset = (this.currentPage - 1) * this.limit
        const response = await getCollections(offset, this.limit)
        const data = response.data
        const dataRaw = data?.items || data?.data?.items || data?.data || []
        this.collections = Array.isArray(dataRaw) ? dataRaw.filter(c => c !== null && typeof c === 'object') : []
        this.totalCollections = data?.total || data?.data?.total || this.collections.length
      } catch (err) {
        console.error('Error:', err)
        this.error = 'No se pudieron cargar las colecciones.'
      } finally {
        this.loading = false
      }
    },

    // cambia de página
    goToPage(page) {
      this.currentPage = page
      this.fetchCollections()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    // monta la URL de la foto
    getColThumbnail(col) {
      let thumb = col.thumbnail
      if (!thumb) return null
      if (typeof thumb === 'object') {
        const keys = Object.keys(thumb)
        thumb = keys.length > 0 ? thumb[keys[0]] : null
      }
      if (!thumb) return null
      if (thumb.startsWith('http')) return thumb
      const path = thumb.startsWith('/') ? thumb : `/${thumb}`
      return `https://arcadium.cluster24.libnamic.eu${path}`
    },

    // saca el título
    getColTitle(col) {
      if (!col.title) return 'Sin título'
      if (typeof col.title === 'string') return col.title
      const keys = Object.keys(col.title)
      return keys.length > 0 ? col.title[keys[0]] : 'Sin título'
    },

    // saca la descripción
    getColDescription(col) {
      if (!col.description) return null
      if (typeof col.description === 'string') return col.description
      const keys = Object.keys(col.description)
      return keys.length > 0 ? col.description[keys[0]] : null
    },

    // oculta la foto si no carga
    handleImageError(e) {
      e.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; color: #fff; margin-bottom: 0.3rem; }
.page-header p { color: rgba(255, 133, 177, 0.6); }
.collections-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.collection-card { background: #1a1a2e; border-radius: 12px; overflow: hidden; text-decoration: none; color: inherit; transition: all 0.3s ease; border: 1px solid rgba(255, 255, 255, 0.05); }
.collection-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(255, 77, 141, 0.15); border-color: rgba(255, 77, 141, 0.3); }
.col-image { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: #12121f; display: flex; align-items: center; justify-content: center; }
.col-image img { width: 100%; height: 100%; object-fit: cover; }
.no-image { font-size: 3rem; opacity: 0.2; }
.col-body { padding: 1.2rem; }
.col-body h3 { font-size: 1.05rem; color: #fff; margin-bottom: 0.4rem; }
.col-desc { font-size: 0.85rem; color: rgba(255, 255, 255, 0.5); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; }
.loading { text-align: center; padding: 4rem 0; color: rgba(255, 255, 255, 0.6); }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(255, 255, 255, 0.1); border-top-color: #ff4d8d; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
.error { text-align: center; padding: 3rem; color: #ff6b6b; }
@media (max-width: 768px) {
  .collections-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
}
</style>
