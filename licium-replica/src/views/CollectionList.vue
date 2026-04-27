<template>
  <div class="collection-list">
    <div class="page-header">
      <div class="header-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
      <div class="header-content">
        <p class="eyebrow">Explora el catálogo</p>
        <h1>Colecciones</h1>
        <p class="subtitle">Descubre las agrupaciones temáticas y fondos digitales</p>
      </div>
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
        <CollectionCard
          v-for="col in collections"
          :key="col.id"
          :collection="col"
        />
      </div>
      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="goToPage" />
    </template>
  </div>
</template>

<script>
import { getCollections } from '../api/licium.js'
import CollectionCard from '../components/CollectionCard.vue'
import Pagination from '../components/Pagination.vue'

export default {
  components: { CollectionCard, Pagination },
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
    }
  }
}
</script>

<style scoped>
.page-header {
  position: relative;
  text-align: center;
  padding: 5rem 2rem 4rem;
  margin-bottom: 2rem;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--section-card-border);
}

.header-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.1; }
.blob-1 { width: 300px; height: 300px; background: var(--primary-pink); top: -100px; left: -50px; animation: drift 10s ease-in-out infinite alternate; }
.blob-2 { width: 250px; height: 250px; background: var(--soft-pink); bottom: -80px; right: -50px; animation: drift 12s ease-in-out infinite alternate-reverse; }

@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(20px, 15px) scale(1.1); }
}

.header-content { position: relative; z-index: 1; }

.eyebrow {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--soft-pink);
  margin-bottom: 1rem;
  font-weight: 600;
  opacity: 0.9;
}

.page-header h1 {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  margin-bottom: 1rem;
  background: var(--heading-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -2px;
  line-height: 1;
}

.page-header .subtitle {
  color: var(--hero-desc-color);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: stretch;
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