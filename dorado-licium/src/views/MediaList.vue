<template>
  <div class="media-list">
    <div class="page-header">
      <h1>Multimedia</h1>
      <p>Explora todos los archivos multimedia del catálogo</p>
    </div>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando media...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchMedias">Reintentar</button>
    </div>
    <template v-else>
      <div class="media-grid">
        <MediaCard v-for="media in medias" :key="media.id" :media="media" />
      </div>
      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="goToPage" />
    </template>
  </div>
</template>

<script>
import { getMedias } from '../api/licium.js'
import MediaCard from '../components/MediaCard.vue'
import Pagination from '../components/Pagination.vue'

export default {
  components: { MediaCard, Pagination },
  data() {
    return { medias: [], loading: true, error: null, currentPage: 1, totalMedias: 0, limit: 24 }
  },
  computed: {
    totalPages() { return Math.ceil(this.totalMedias / this.limit) || 1 }
  },
  created() {
    const page = parseInt(this.$route.query.page) || 1
    this.currentPage = page
    this.fetchMedias()
  },
  methods: {
    async fetchMedias() {
      this.loading = true; this.error = null
      try {
        const offset = (this.currentPage - 1) * this.limit
        const response = await getMedias(offset, this.limit)
        const data = response.data
        const dataRaw = data?.items || data?.data?.items || data?.data || []
        this.medias = Array.isArray(dataRaw) ? dataRaw.filter(m => m !== null) : []
        this.totalMedias = data?.total || data?.data?.total || this.medias.length
      } catch (err) {
        console.error('Error:', err); this.error = 'No se pudo cargar la lista de medios.'
      } finally { this.loading = false }
    },
    goToPage(page) {
      this.currentPage = page
      this.$router.replace({ query: { page } })
      this.fetchMedias()
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  min-height: 200px;
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
  .media-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
}
</style>
