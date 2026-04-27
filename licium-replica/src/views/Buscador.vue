<template>
  <div class="buscador">
    <div class="page-header">
      <div class="header-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
      <div class="header-content">
        <p class="eyebrow">Potente herramienta de filtrado</p>
        <h1>Buscador</h1>
        <p class="subtitle">Encuentra registros históricos y multimedia filtrando por colecciones o texto libre</p>
      </div>
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

    <LoadingState v-if="loading" message="Buscando resultados..." />
    
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
import LoadingState from '../components/LoadingState.vue'
import { getTitle } from '../utils/data-utils.js'

export default {
  components: { RecordCard, Pagination, LoadingState },
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
.page-header {
  position: relative;
  text-align: center;
  padding: 5rem 2rem 4rem;
  margin-bottom: 2.5rem;
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

.search-form {
  max-width: 800px;
  margin: -1.5rem auto 4rem;
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid var(--section-card-border);
  border-radius: 20px;
  position: relative;
  z-index: 5;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.search-input {
  width: 100%;
  padding: 1.2rem 1.8rem;
  background: var(--input-bg);
  border: 1px solid rgba(255, 133, 177, 0.15);
  border-radius: 12px;
  color: var(--input-color);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: var(--primary-pink);
  box-shadow: 0 0 0 4px rgba(255, 77, 141, 0.1);
}

.search-input::placeholder { color: rgba(255, 255, 255, 0.25); }

.search-select {
  width: 100%;
  padding: 1.2rem 1.8rem;
  padding-right: 3rem;
  background: var(--input-bg);
  border: 1px solid rgba(255, 133, 177, 0.15);
  border-radius: 12px;
  color: var(--input-color);
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff85b1' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
}

.search-select:focus {
  border-color: var(--primary-pink);
  box-shadow: 0 0 0 4px rgba(255, 77, 141, 0.1);
}
.search-select option { background: var(--select-option-bg); color: var(--input-color); }

.btn-buscar {
  padding: 0 2.5rem;
  height: 100%;
  background: linear-gradient(135deg, #ff4d8d, #ff85b1);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 77, 141, 0.25);
}

.btn-buscar:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(255, 77, 141, 0.4);
}

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

.empty, .initial { text-align: center; padding: 4rem 0; color: var(--text-faint); font-size: 1.1rem; }

@media (max-width: 850px) {
  .search-form {
    grid-template-columns: 1fr;
    margin-top: -2rem;
    padding: 1rem;
  }
  .btn-buscar { height: 3.5rem; }
}

@media (max-width: 768px) {
  .page-header h1 { font-size: 2.5rem; }
  .results-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
}
</style>