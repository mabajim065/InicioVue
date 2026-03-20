<template>
  <div class="collection-detail">

    <!-- cargando... -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando colección...</p>
    </div>

    <!-- algo fue mal -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <router-link to="/collections" class="back-btn">← Volver a colecciones</router-link>
    </div>

    <!-- el detalle de la colección -->
    <template v-else-if="collection">

      <!-- volver al listado -->
      <router-link to="/collections" class="back-btn">← Volver a colecciones</router-link>

      <!-- nombre y descripción -->
      <div class="collection-header">
        <h1>{{ getTitle }}</h1>
        <p v-if="getDescription" class="col-description">{{ getDescription }}</p>
      </div>

      <!-- metadatos — se abren y cierran con el botón -->
      <div v-if="collection.canonical_joined_metadata" class="metadata">
        <button class="metadata-toggle" @click="metadatosAbiertos = !metadatosAbiertos">
          Metadatos {{ metadatosAbiertos ? '▲' : '▼' }}
        </button>
        <table v-if="metadatosAbiertos">
          <tr v-for="(value, key) in collection.canonical_joined_metadata" :key="key">
            <td class="meta-key">{{ formatKey(key) }}</td>
            <td class="meta-value">{{ formatValue(value) }}</td>
          </tr>
        </table>
      </div>

      <!-- records que pertenecen a esta colección -->
      <div class="records-section">
        <h2>Registros de esta colección</h2>

        <!-- cargando records... -->
        <div v-if="loadingRecords" class="loading">
          <div class="spinner"></div>
          <p>Cargando registros...</p>
        </div>

        <!-- grid de tarjetas -->
        <div v-else-if="records.length" class="records-grid">
          <RecordCard
            v-for="record in records"
            :key="record.id"
            :record="record"
          />
        </div>

        <!-- si no hay ninguno -->
        <div v-else class="empty">
          <p>No hay registros disponibles en esta colección.</p>
        </div>

        <!-- paginación -->
        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="goToPage"
        />
      </div>

    </template>
  </div>
</template>

<script>
import { getCollectionDetail, getRecords } from '../api/licium.js'
import RecordCard from '../components/RecordCard.vue'
import Pagination from '../components/Pagination.vue'

export default {
  components: { RecordCard, Pagination },

  data() {
    return {
      collection: null,
      records: [],
      loading: true,
      loadingRecords: false,
      error: null,
      metadatosAbiertos: false,
      currentPage: 1,
      totalRecords: 0,
      limit: 24
    }
  },

  computed: {
    // saca el título
    getTitle() {
      if (!this.collection?.title) return 'Sin título'
      if (typeof this.collection.title === 'string') return this.collection.title
      const keys = Object.keys(this.collection.title)
      return keys.length > 0 ? this.collection.title[keys[0]] : 'Sin título'
    },
    // saca la descripción
    getDescription() {
      if (!this.collection?.description) return ''
      if (typeof this.collection.description === 'string') return this.collection.description
      const keys = Object.keys(this.collection.description)
      return keys.length > 0 ? this.collection.description[keys[0]] : ''
    },
    // cuántas páginas hay
    totalPages() {
      return Math.ceil(this.totalRecords / this.limit) || 1
    }
  },

  created() {
    this.fetchCollection()
  },

  methods: {
    // pide los datos de la colección y luego sus records
    async fetchCollection() {
      this.loading = true
      this.error = null
      try {
        const id = this.$route.params.id
        const response = await getCollectionDetail(id)
        this.collection = response.data.data || response.data
        await this.fetchRecords()
      } catch (err) {
        console.error('Error fetching collection:', err)
        this.error = 'No se pudo cargar la colección.'
      } finally {
        this.loading = false
      }
    },

    // pide los records filtrando por el id de esta colección
    async fetchRecords() {
      this.loadingRecords = true
      try {
        const offset = (this.currentPage - 1) * this.limit
        const id = this.$route.params.id
        const response = await getRecords(offset, this.limit, id)
        const data = response.data
        const dataRaw = data?.items || data?.data?.items || data?.data || []
        this.records = Array.isArray(dataRaw) ? dataRaw.filter(r => r !== null) : []
        this.totalRecords = data?.total || data?.data?.total || this.records.length
      } catch (err) {
        console.error('Error fetching records:', err)
      } finally {
        this.loadingRecords = false
      }
    },

    // cambia de página
    goToPage(page) {
      this.currentPage = page
      this.fetchRecords()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    // pone la clave del metadato en formato legible
    formatKey(key) {
      if (!key) return ''
      const parts = key.split('.')
      return parts[parts.length - 1].replace(/_/g, ' ').toUpperCase()
    },

    // saca el valor del metadato sin mostrar el JSON entero
    formatValue(val) {
      if (!val) return ''
      if (Array.isArray(val)) {
        return val.map(v => {
          if (typeof v === 'object' && v !== null) {
            return v['@value'] || v['value'] || v['values']?.[0]?.['@value'] || ''
          }
          return v
        }).filter(Boolean).join(', ')
      }
      if (typeof val === 'object' && val.values) {
        return val.values.map(v => v['@value'] || v).join(', ')
      }
      if (typeof val === 'object' && val['@value']) return val['@value']
      return String(val)
    }
  }
}
</script>

<style scoped>
.back-btn { display: inline-block; color: #ff85b1; text-decoration: none; margin-bottom: 1.5rem; font-size: 0.9rem; transition: color 0.3s; }
.back-btn:hover { color: #ffadd0; }
.collection-header { margin-bottom: 2rem; }
.collection-header h1 { font-size: 2rem; color: #fff; margin-bottom: 0.5rem; }
.col-description { color: rgba(255,255,255,0.6); line-height: 1.7; max-width: 800px; }
.metadata { margin-bottom: 2.5rem; }
.metadata-toggle { background: rgba(255,77,141,0.08); border: 1px solid rgba(255,133,177,0.2); color: #ff85b1; padding: 0.5rem 1.2rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 500; margin-bottom: 1rem; transition: all 0.3s; box-shadow: none; }
.metadata-toggle:hover { background: rgba(255,77,141,0.15); transform: none; box-shadow: none; }
.metadata table { width: 100%; border-collapse: collapse; }
.metadata tr { border-bottom: 1px solid rgba(255,77,141,0.08); }
.metadata td { padding: 0.7rem 0; vertical-align: top; }
.meta-key { color: rgba(255,133,177,0.7); font-size: 0.85rem; width: 35%; font-weight: 500; }
.meta-value { color: rgba(255,255,255,0.8); font-size: 0.85rem; }
.records-section h2 { font-size: 1.3rem; color: #fff; margin-bottom: 1.5rem; }
.records-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.empty { text-align: center; padding: 3rem; color: rgba(255,133,177,0.4); font-style: italic; }
.loading { text-align: center; padding: 3rem 0; color: rgba(255,255,255,0.6); }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #ff4d8d; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
.error { text-align: center; padding: 3rem; color: #ff6b6b; }
</style>
