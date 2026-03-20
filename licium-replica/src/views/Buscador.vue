<template>
  <div class="buscador">

    <!-- Cabecera -->
    <div class="page-header">
      <h1>Buscador</h1>
      <p>Busca registros por texto o filtra por colección</p>
    </div>

    <!-- Formulario -->
    <div class="search-form">

      <!-- Caja de texto -->
      <input
        v-model="query"
        type="text"
        class="search-input"
        placeholder="Escribe lo que buscas..."
        @keyup.enter="buscar"
      />

      <!-- Desplegable de colecciones -->
      <select v-model="coleccionSeleccionada" class="search-select">
        <option value="">Todas las colecciones</option>
        <option
          v-for="col in colecciones"
          :key="col.id"
          :value="col.id"
        >
          {{ getColTitle(col) }}
        </option>
      </select>

      <!-- Botón buscar -->
      <button class="btn-buscar" @click="buscar">Buscar →</button>

    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Buscando...</p>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="buscado && resultados.length === 0" class="empty">
      <p>No se encontraron resultados</p>
    </div>

    <!-- Resultados -->
    <template v-else-if="resultados.length > 0">
      <p class="results-count">
        {{ totalResultados }} resultado{{ totalResultados !== 1 ? 's' : '' }}
      </p>
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
      <p>Escribe algo o elige una colección y pulsa buscar</p>
    </div>

  </div>
</template>

<script>
import { searchRecords, getCollections } from '../api/licium.js'
import RecordCard from '../components/RecordCard.vue'
import Pagination from '../components/Pagination.vue'

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
    totalPages() {
      return Math.ceil(this.totalResultados / this.limit) || 1
    }
  },

  // Carga las colecciones al entrar en la página
  created() {
    this.cargarColecciones()
  },

  methods: {
    // Carga las colecciones para el desplegable
    async cargarColecciones() {
      try {
        const response = await getCollections(0, 100)
        const data = response.data
        const dataRaw = data?.items || data?.data?.items || data?.data || []
        this.colecciones = Array.isArray(dataRaw) ? dataRaw.filter(c => c !== null) : []
      } catch (err) {
        console.error('Error cargando colecciones:', err)
      }
    },

    // Lanza la búsqueda
    buscar() {
      this.currentPage = 1
      this.fetchResultados()
    },

    // Pide los resultados a la API
    async fetchResultados() {
      this.loading = true
      this.buscado = true
      try {
        const offset = (this.currentPage - 1) * this.limit
        const params = {
          query: this.query,
          offset,
          limit: this.limit
        }
        // Si hay colección seleccionada la añadimos
        if (this.coleccionSeleccionada) {
          params.collectionId = this.coleccionSeleccionada
        }
        const response = await searchRecords(params)
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

    goToPage(page) {
      this.currentPage = page
      this.fetchResultados()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    // Extrae el título de la colección
    getColTitle(col) {
      if (!col.title) return 'Sin título'
      if (typeof col.title === 'string') return col.title
      const keys = Object.keys(col.title)
      return keys.length > 0 ? col.title[keys[0]] : 'Sin título'
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
  align-items: center;
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

/* Desplegable */
.search-select {
  width: 100%;
  padding: 1rem 1.5rem;
  background: #1a1a2e;
  border: 1px solid rgba(255, 133, 177, 0.2);
  border-radius: 50px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff85b1' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
}
.search-select:focus {
  border-color: var(--primary-pink);
}
.search-select option {
  background: #1a1a2e;
  color: #fff;
}

/* Botón */
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

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

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

@media (max-width: 768px) {
  .page-header h1 { font-size: 2rem; }
  .results-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
}
</style>