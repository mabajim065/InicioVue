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
.records-section {
  padding-top: 3rem;
  border-top: 1px solid var(--gold-light);
}
.records-section h2 { 
  font-size: 1.8rem; 
  font-family: var(--font-serif);
  color: var(--gold-dark); 
  margin-bottom: 2.5rem; 
  text-align: center;
}
.records-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 2.5rem; 
  margin-bottom: 4rem; 
}

.empty { 
  text-align: center; 
  padding: 4rem; 
  color: var(--text-muted); 
  background: white;
  border-radius: 16px;
  border: 1px dashed var(--gold-light);
}
.loading { 
  text-align: center; 
  padding: 5rem 0; 
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

@media (max-width: 600px) {
  .records-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1.5rem; }
}
</style>
