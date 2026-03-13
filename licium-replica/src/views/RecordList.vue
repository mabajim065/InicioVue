<template>
  <div class="record-list">
    <div class="page-header">
      <h1>Records</h1>
      <p>Explora el catálogo de registros</p>
    </div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando registros...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchRecords">Reintentar</button>
    </div>
    <template v-else>
      <div class="records-grid">
        <RecordCard v-for="record in records" :key="record.id" :record="record" />
      </div>
      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="goToPage" />
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
    totalPages() {
      return Math.ceil(this.totalRecords / this.limit) || 1
    }
  },
  created() {
    this.fetchRecords()
  },
  methods: {
    async fetchRecords() {
      this.loading = true
      this.error = null
      try {
        const offset = (this.currentPage - 1) * this.limit
        const response = await getRecords(offset, this.limit)
        // Usamos .items porque así viene en tu consola
        const dataRaw = response.data.items || response.data.data || []
        // Filtramos nulos para evitar el error de 'id'
        this.records = dataRaw.filter(r => r !== null)
        this.totalRecords = response.data.total || this.records.length
      } catch (err) {
        this.error = 'No se pudieron cargar los registros.'
      } finally {
        this.loading = false
      }
    },
    goToPage(page) {
      this.currentPage = page
      this.fetchRecords()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>