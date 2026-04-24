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
.collection-list {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.page-header { 
  text-align: center; 
  margin-bottom: 5rem;
  position: relative;
}

.page-header h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin-bottom: 1rem;
  font-family: var(--font-serif);
  background: linear-gradient(135deg, var(--gold-dark) 0%, var(--gold-medium) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -2px;
}

.page-header p { 
  color: var(--text-muted); 
  font-size: 1.1rem; 
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
}

.page-header::after {
  content: '✥';
  position: absolute;
  bottom: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--gold-medium);
  font-size: 1.8rem;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 3rem;
  margin-bottom: 5rem;
}

.error {
  text-align: center; 
  padding: 4rem;
  background: var(--gold-soft);
  border: 1.5px solid var(--gold-light);
  border-radius: 20px;
  color: var(--text-main);
  max-width: 600px;
  margin: 0 auto;
}

.error button {
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  background: var(--gold-medium);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s;
}

.error button:hover {
  background: var(--gold-dark);
  transform: translateY(-2px);
}

.loading-container { 
  text-align: center; 
  padding: 6rem 0; 
  color: var(--text-muted); 
}

.spinner { 
  width: 50px; 
  height: 50px; 
  border: 2px solid var(--gold-light); 
  border-top-color: var(--gold-dark); 
  border-radius: 50%; 
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; 
  margin: 0 auto 1.5rem; 
}

@keyframes spin { 
  to { transform: rotate(360deg); } 
}

@media (max-width: 768px) {
  .page-header h1 { font-size: 2.5rem; }
  .collections-grid { 
    grid-template-columns: 1fr; 
    gap: 2rem; 
  }
}
</style>