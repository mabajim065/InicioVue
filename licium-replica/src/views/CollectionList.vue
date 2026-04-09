<template>
  <div class="collection-list">
    <div class="page-header">
      <h1>Colecciones</h1>
      <p>Explora el catálogo de colecciones</p>
    </div>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando colecciones...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchCollections">Reintentar</button>
    </div>
    <template v-else>
      <div class="collections-grid">
        <router-link
          v-for="col in collections"
          :key="col.id"
          :to="`/collections/${col.id}`"
          class="collection-card"
        >
          <div class="card-image"
            :style="getThumb(col) ? `background-image: url('${getThumb(col)}')` : ''"
            :class="{ 'no-image': !getThumb(col) }"
          >
            <div v-if="!getThumb(col)" class="no-image-content">
              <svg class="placeholder-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4"/>
                <rect x="18" y="22" width="28" height="20" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
                <path d="M18 27h28" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
                <circle cx="24" cy="24.5" r="1.5" fill="currentColor" opacity="0.5"/>
                <circle cx="29" cy="24.5" r="1.5" fill="currentColor" opacity="0.5"/>
                <circle cx="34" cy="24.5" r="1.5" fill="currentColor" opacity="0.5"/>
                <path d="M24 33h16M24 37h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
              </svg>
              <span class="placeholder-label">Colección</span>
            </div>
          </div>
          <div class="card-info">
            <h3>{{ getTitle(col) }}</h3>
            <p v-if="getDescription(col)" class="col-desc">{{ getDescription(col) }}</p>
          </div>
        </router-link>
      </div>
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
    return { collections: [], loading: true, error: null, currentPage: 1, totalCollections: 0, limit: 24 }
  },
  computed: {
    totalPages() { return Math.ceil(this.totalCollections / this.limit) || 1 }
  },
  created() {
    const page = parseInt(this.$route.query.page) || 1
    this.currentPage = page
    this.fetchCollections()
  },
  methods: {
    async fetchCollections() {
      this.loading = true; this.error = null
      try {
        const offset = (this.currentPage - 1) * this.limit
        const response = await getCollections(offset, this.limit)
        const data = response.data
        const dataRaw = data?.items || data?.data?.items || data?.data || []
        this.collections = Array.isArray(dataRaw) ? dataRaw.filter(c => c !== null) : []
        this.totalCollections = data?.total || data?.data?.total || this.collections.length
      } catch (err) {
        console.error('Error:', err); this.error = 'No se pudieron cargar las colecciones.'
      } finally { this.loading = false }
    },
    goToPage(page) {
      this.currentPage = page
      this.$router.replace({ query: { page } })
      this.fetchCollections()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    getThumb(col) {
      let thumb = col?.thumbnail
      if (!thumb) return null
      if (typeof thumb === 'object') { const keys = Object.keys(thumb); thumb = keys.length > 0 ? thumb[keys[0]] : null }
      if (!thumb) return null
      if (thumb.startsWith('http')) return thumb
      const path = thumb.startsWith('/') ? thumb : `/${thumb}`
      return `https://arcadium.cluster24.libnamic.eu${path}`
    },
    getTitle(col) {
      if (!col.title) return 'Sin título'
      if (typeof col.title === 'string') return col.title
      const keys = Object.keys(col.title)
      return keys.length > 0 ? col.title[keys[0]] : 'Sin título'
    },
    getDescription(col) {
      if (!col.description) return ''
      if (typeof col.description === 'string') return col.description
      const keys = Object.keys(col.description)
      return keys.length > 0 ? col.description[keys[0]] : ''
    }
  }
}
</script>

<style scoped>
.page-header { text-align: center; margin-bottom: 3rem; }
.page-header h1 {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  background: var(--heading-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -1px;
}
.page-header p { color: var(--soft-pink); font-size: 1.1rem; opacity: 0.8; }

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: stretch;
}

.collection-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(255, 77, 141, 0.15);
  border-color: rgba(255, 77, 141, 0.3);
}

.card-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  background-color: var(--image-placeholder-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s ease;
  overflow: hidden;
}
.collection-card:hover .card-image {
  transform: scale(1.03);
}
.card-image.no-image {
  background: linear-gradient(135deg, rgba(255,77,141,0.18) 0%, rgba(130,80,180,0.14) 50%, rgba(255,133,177,0.1) 100%);
  border-bottom: 1px solid rgba(255, 77, 141, 0.15);
  color: var(--primary-pink);
}

.no-image-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.placeholder-icon {
  width: 52px;
  height: 52px;
  color: var(--primary-pink);
  transition: transform 0.4s ease, opacity 0.4s ease;
  opacity: 0.7;
}
.collection-card:hover .placeholder-icon {
  transform: scale(1.1) rotate(3deg);
  opacity: 1;
}

.placeholder-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--primary-pink);
  opacity: 0.7;
}

.card-info {
  padding: 1.2rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.card-info h3 {
  font-size: 1.05rem;
  color: var(--text-main);
  margin: 0 0 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.col-desc {
  color: var(--card-date-color);
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.error {
  text-align: center; padding: 3rem;
  background: rgba(255, 77, 141, 0.05);
  border: 1px dashed var(--primary-pink);
  border-radius: 12px;
  color: var(--soft-pink);
}
.loading-container { text-align: center; padding: 4rem 0; color: var(--loading-text); }
.spinner { width: 40px; height: 40px; border: 3px solid var(--spinner-track); border-top-color: #ff4d8d; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) {
  .page-header h1 { font-size: 2rem; }
  .collections-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
}
</style>