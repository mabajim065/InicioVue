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
    totalPages() {
      return Math.ceil(this.totalRecords / this.limit)
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
        this.records = response.data.data || response.data.results || response.data || []
        this.totalRecords = response.data.total || response.data.count || this.records.length
      } catch (err) {
        console.error('Error fetching records:', err)
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

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 0.3rem;
}

.page-header p {
  color: rgba(255, 133, 177, 0.6);
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.loading {
  text-align: center;
  padding: 4rem 0;
  color: rgba(255, 255, 255, 0.6);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #ff4d8d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 3rem;
  color: #ff6b6b;
}

.error button {
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  background: #ff4d8d;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.error button:hover {
  background: #ff6b9d;
}
</style>