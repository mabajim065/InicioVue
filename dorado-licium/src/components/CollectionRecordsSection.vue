<template>
  <div class="records-section">
    <h2>Registros de esta colección</h2>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando registros...</p>
    </div>
    <div v-else-if="records.length" class="records-grid">
      <RecordCard v-for="record in records" :key="record.id" :record="record" />
    </div>
    <div v-else class="empty">
      <p>No hay registros disponibles en esta colección.</p>
    </div>
    <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @page-change="onPageChange" />
  </div>
</template>

<script>
import RecordCard from './RecordCard.vue'
import Pagination from './Pagination.vue'

export default {
  name: 'CollectionRecordsSection',
  components: { RecordCard, Pagination },
  props: {
    records: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  emits: ['page-change'],
  methods: {
    onPageChange(page) {
      this.$emit('page-change', page)
    }
  }
}
</script>

<style scoped>
.records-section h2 { font-size: 1.3rem; color: var(--text-main); margin-bottom: 1.5rem; }
.records-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }

.empty { text-align: center; padding: 3rem; color: var(--empty-color); font-style: italic; }
.loading { text-align: center; padding: 3rem 0; color: var(--loading-text); }
.spinner { width: 40px; height: 40px; border: 3px solid var(--spinner-track); border-top-color: #ff4d8d; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
