<template>
  <div class="record-list">

    <!-- título de la página -->
    <div class="page-header">
      <h1>Records</h1>
      <p>Explora el catálogo de registros</p>
    </div>

    <!-- cargando... -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando registros...</p>
    </div>

    <!-- algo fue mal -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchRecords">Reintentar</button>
    </div>

    <!-- las tarjetas y la paginación -->
    <template v-else>
      <div class="records-grid">
        <RecordCard
          v-for="record in records"
          :key="record.id"
          :record="record"
        />
      </div>
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="goToPage"
      />
    </template>

  </div>
</template>

<script>
import { getRecords } from '../api/licium.js'
import RecordCard from '../components/RecordCard.vue'
import Pagination from '../components/Pagination.vue'

export default {
  components: { RecordCard, Pagination },

  data() {
    return {
      records: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalRecords: 0,
      limit: 24
    }
  },

  computed: {
    // cuántas páginas hay en total
    totalPages() {
      return Math.ceil(this.totalRecords / this.limit) || 1
    }
  },

  created() {
    // mira si hay página guardada en la URL para no volver siempre a la 1
    const page = parseInt(this.$route.query.page) || 1
    this.currentPage = page
    this.fetchRecords()
  },

  methods: {
    // pide los records a la API
    async fetchRecords() {
      this.loading = true
      this.error = null
      try {
        const offset = (this.currentPage - 1) * this.limit
        const response = await getRecords(offset, this.limit)
        const data = response.data
        const dataRaw = data?.items || data?.data?.items || data?.data || []
        this.records = Array.isArray(dataRaw) ? dataRaw.filter(r => r !== null) : []
        this.totalRecords = data?.total || data?.data?.total || this.records.length
      } catch (err) {
        console.error('Error en la petición:', err)
        this.error = 'No se pudieron cargar los registros.'
      } finally {
        this.loading = false
      }
    },

    // cambia de página y guarda el número en la URL
    goToPage(page) {
      this.currentPage = page
      this.$router.replace({ query: { page } })
      this.fetchRecords()
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
  background: linear-gradient(to right, #fff, var(--soft-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -1px;
}
.page-header p { color: var(--soft-pink); font-size: 1.1rem; opacity: 0.8; }
.records-grid {
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
.loading-container { text-align: center; padding: 4rem 0; color: rgba(255,255,255,0.6); }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #ff4d8d; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) {
  .page-header h1 { font-size: 2rem; }
  .records-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
}
</style>
