<template>
  <div class="buscador">

    <!-- Cabecera -->
    <div class="page-header">
      <h1>Buscador</h1>
      <p>Encuentra registros por título, autor, fecha o colección</p>
    </div>

    <!-- Formulario de búsqueda -->
    <div class="search-form">

      <!-- Caja de texto -->
      <div class="search-input-wrap">
        <input
          v-model="query"
          type="text"
          class="search-input"
          placeholder="Escribe lo que buscas..."
          @keyup.enter="buscar"
        />
      </div>

      <!-- Selector de campo -->
      <div class="search-filters">
        <button
          v-for="f in filtros"
          :key="f.value"
          class="filter-btn"
          :class="{ active: campo === f.value }"
          @click="campo = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Botón buscar -->
      <button class="btn-buscar" @click="buscar">
        Buscar →
      </button>

    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Buscando...</p>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="buscado && resultados.length === 0" class="empty">
      <p>No se encontraron resultados para "<strong>{{ queryBuscada }}</strong>"</p>
    </div>

    <!-- Resultados -->
    <template v-else-if="resultados.length > 0">
      <p class="results-count">{{ totalResultados }} resultado{{ totalResultados !== 1 ? 's' : '' }} para "<strong>{{ queryBuscada }}</strong>"</p>
      <div class="results-grid">
        <RecordCard
          v-for="record in resultados"
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

    <!-- Estado inicial -->
    <div v-else class="initial">
      <p>🔍 Usa los filtros y pulsa buscar</p>
    </div>

  </div>
</template>

<script>
import { searchRecords } from '../api/licium.js'
import RecordCard from '../components/RecordCard.vue'
import Pagination from '../components/Pagination.vue'

export default {
  components: { RecordCard, Pagination },

  data() {
    return {
      query: '',           // texto escrito por el usuario
      queryBuscada: '',    // texto de la última búsqueda realizada
      campo: 'title',      // campo por el que se filtra
      resultados: [],      // records devueltos por la API
      loading: false,      // controla el spinner
      buscado: false,      // si ya se ha hecho alguna búsqueda
      currentPage: 1,      // página actual
      totalResultados: 0,  // total devuelto por la API
      limit: 24,           // resultados por página
      // Opciones del selector de campo
      filtros: [
        { label: 'Título', value: 'title' },
        { label: 'Autor', value: 'author' },
        { label: 'Fecha', value: 'date' },
        { label: 'Colección', value: 'collection' }
      ]
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalResultados / this.limit) || 1
    }
  },

  methods: {
    // Lanza la búsqueda desde el principio
    buscar() {
      if (!this.query.trim()) return
      this.currentPage = 1
      this.queryBuscada = this.query
      this.fetchResultados()
    },

    // Pide los resultados a la API
    async fetchResultados() {
      this.loading = true
      this.buscado = true
      try {
        const offset = (this.currentPage - 1) * this.limit
        const response = await searchRecords({
          query: this.queryBuscada,
          field: this.campo,
          offset,
          limit: this.limit
        })
        const data = response.data
        const dataRaw = data?.items || data?.data?.items || data?.data || []
        this.resultados = Array.isArray(dataRaw) ? dataRaw.filter(r => r !== null) : []
        this.totalResultados = data?.total || data?.data?.total || this.resultados.length
      } catch (err) {
        console.error('Error en la búsqueda:', err)
        this.resultados = []
      } finally {
        this.loading = false
      }
    },

    // Cambia de página
    goToPage(page) {
      this.currentPage = page
      this.fetchResultados()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.page-header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -1px;
  background: linear-gradient(to right, #fff, var(--soft-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}
.page-header p {
  color: var(--soft-pink);
  opacity: 0.8;
  font-size: 1.05rem;
}

/* Formulario */
.search-form {
  max-width: 700px;
  margin: 0 auto 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-input-wrap {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  background: #1a1a2e;
  border: 1px solid rgba(255, 133, 177, 0.2);
  border-radius: 50px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}
.search-input:focus {
  border-color: var(--primary-pink);
}
.search-input::placeholder {
  color: rgba(255,255,255,0.3);
}

/* Filtros */
.search-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  background: transparent;
  border: 1px solid rgba(255, 133, 177, 0.2);
  color: rgba(255,255,255,0.6);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: none;
}
.filter-btn:hover {
  border-color: var(--soft-pink);
  color: var(--soft-pink);
  background: transparent;
  transform: none;
  box-shadow: none;
}
.filter-btn.active {
  background: linear-gradient(135deg, #ff4d8d, #ff85b1);
  border-color: transparent;
  color: #fff;
  transform: none;
  box-shadow: none;
}

/* Botón buscar */
.btn-buscar {
  padding: 0.9rem 2rem;
  background: linear-gradient(135deg, #ff4d8d, #ff85b1);
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  align-self: center;
}
.btn-buscar:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 77, 141, 0.4);
}

/* Resultados */
.results-count {
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
}
.results-count strong {
  color: var(--soft-pink);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Estados */
.loading {
  text-align: center;
  padding: 4rem 0;
  color: rgba(255,255,255,0.6);
}
.spinner {
  width: 40px; height: 40px;
  border: 3px solid rgba(255,77,141,0.2);
  border-top-color: var(--primary-pink);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty, .initial {
  text-align: center;
  padding: 4rem 0;
  color: rgba(255,255,255,0.4);
  font-size: 1.1rem;
}
.empty strong {
  color: var(--soft-pink);
}

@media (max-width: 768px) {
  .page-header h1 { font-size: 2rem; }
  .results-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
}
</style>
