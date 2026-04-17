<template>
  <div class="buscador">
    <div class="page-header">
      <h1>Buscador</h1>
      <p>Busca registros por texto o filtra por colección</p>
    </div>
    <div class="search-form">
      <input
        v-model="query"
        type="text"
        class="search-input"
        placeholder="Escribe lo que buscas..."
        @keyup.enter="buscar"
      />
      <select v-model="coleccionSeleccionada" class="search-select">
        <option value="">Todas las colecciones</option>
        <option v-for="col in colecciones" :key="col.id" :value="col.id">
          {{ getTitle(col) }}
        </option>
      </select>
      <button class="btn-buscar" @click="buscar">Buscar →</button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Buscando...</p>
    </div>
    <div v-else-if="buscado && resultados.length === 0" class="empty">
      <p>No se encontraron resultados</p>
    </div>
    <template v-else-if="resultados.length > 0">
      <p class="results-count">{{ totalResultados }} resultado{{ totalResultados !== 1 ? 's' : '' }}</p>
      <div class="results-grid">
        <RecordCard v-for="record in resultados" :key="record.id" :record="record" />
      </div>
      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="goToPage" />
    </template>
    <div v-else class="initial">
      <p>Escribe algo o elige una colección y pulsa buscar</p>
    </div>
  </div>
</template>

<script>
import { searchRecords, getCollections } from '../api/licium.js'
import RecordCard from '../components/RecordCard.vue'
import Pagination from '../components/Pagination.vue'
import { getTitle } from '../utils/data-utils.js'

export default {
  components: { RecordCard, Pagination },
  data() {
    return {
      query: '',
      coleccionSeleccionada: '',
      colecciones: [],
      resultados: [],
      loading: false,
      buscado: false,
      currentPage: 1,
      totalResultados: 0,
      limit: 24
    }
  },
  computed: {
    totalPages() { return Math.ceil(this.totalResultados / this.limit) || 1 }
  },
  created() {
    const r = this.$route.query
    if (r.q) this.query = r.q
    if (r.col) this.coleccionSeleccionada = r.col
    if (r.page) this.currentPage = parseInt(r.page) || 1

    this.cargarColecciones()

    if (this.query || this.coleccionSeleccionada) {
      this.buscado = true
      this.fetchResultados()
    }
  },
  methods: {
    getTitle,
    async cargarColecciones() {
      try {
        const response = await getCollections(0, 100)
        const data = response.data
        const dataRaw = data?.items || data?.data?.items || data?.data || []
        this.colecciones = Array.isArray(dataRaw) ? dataRaw.filter(c => c !== null) : []
      } catch (err) { console.error('Error cargando colecciones:', err) }
    },
    updateUrl() {
      const q = {}
      if (this.query) q.q = this.query
      if (this.coleccionSeleccionada) q.col = this.coleccionSeleccionada
      if (this.currentPage > 1) q.page = this.currentPage
      this.$router.replace({ query: q }).catch(() => {})
    },
    buscar() {
      if (!this.query.trim() && !this.coleccionSeleccionada) return
      this.currentPage = 1
      this.updateUrl()
      this.fetchResultados()
    },
    async fetchResultados() {
      this.loading = true
      this.buscado = true
      try {
        const offset = (this.currentPage - 1) * this.limit
        const response = await searchRecords({
          query: this.query,
          collectionId: this.coleccionSeleccionada,
          offset,
          limit: this.limit
        })
        const data = response.data
        const dataRaw = data?.items || data?.data?.items || data?.data || []
        this.resultados = Array.isArray(dataRaw) ? dataRaw.filter(r => r !== null) : []
        this.totalResultados = data?.total || data?.data?.total || this.resultados.length
      } catch (err) {
        console.error('Error búsqueda:', err)
        this.resultados = []
      } finally {
        this.loading = false
      }
    },
    goToPage(page) {
      this.currentPage = page
      this.updateUrl()
      this.fetchResultados()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.page-header { text-align: center; margin-bottom: 2.5rem; }
.page-header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -1px;
  background: var(--heading-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}
.page-header p { color: var(--soft-pink); opacity: 0.8; font-size: 1.05rem; }

.search-form { max-width: 700px; margin: 0 auto 3rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; }

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  background: var(--input-bg);
  border: 1px solid rgba(255, 133, 177, 0.2);
  border-radius: 50px;
  color: var(--input-color);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s, background 0.3s, color 0.3s;
  box-sizing: border-box;
}
.search-input:focus { border-color: var(--primary-pink); }
.search-input::placeholder { color: var(--input-placeholder); }

.search-select {
  width: 100%;
  padding: 1rem 1.5rem;
  background: var(--input-bg);
  border: 1px solid rgba(255, 133, 177, 0.2);
  border-radius: 50px;
  color: var(--input-color);
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s, color 0.3s;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff85b1' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
  background-color: var(--input-bg);
}
.search-select:focus { border-color: var(--primary-pink); }
.search-select option { background: var(--select-option-bg); color: var(--input-color); }

.btn-buscar {
  padding: 0.9rem 2.5rem;
  background: linear-gradient(135deg, #ff4d8d, #ff85b1);
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-buscar:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255, 77, 141, 0.4); }

.results-count {
  color: var(--results-count-color);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.8rem;
  text-align: center;
  letter-spacing: 0.3px;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}
.results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 3rem; }

.loading { text-align: center; padding: 4rem 0; color: var(--loading-text); }
.spinner { width: 40px; height: 40px; border: 3px solid var(--spinner-track); border-top-color: var(--primary-pink); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty, .initial { text-align: center; padding: 4rem 0; color: var(--text-faint); font-size: 1.1rem; }

@media (max-width: 768px) {
  .page-header h1 { font-size: 2rem; }
  .results-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
}
</style>