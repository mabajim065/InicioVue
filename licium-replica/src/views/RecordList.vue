<template>
  <div class="record-list">
    <div class="page-header">
      <h1>Records</h1>
      <p>Explora el catálogo de registros</p>
    </div>

    <div v-if="loading" class="loading-container">
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
      return Math.ceil(this.totalRecords / this.limit) || 1
    }
  },
  created() {
    this.fetchRecords()
  },
  methods: {
    async fetchRecords() {
      this.loading = true;
      this.error = null;
      try {
        const offset = (this.currentPage - 1) * this.limit;
        const response = await getRecords(offset, this.limit);
        
        // Según tu consola, los datos están en response.data.items
        const dataRaw = response.data?.items || [];
        this.records = dataRaw.filter(r => r !== null);
        
        // Total de registros para la paginación
        this.totalRecords = response.data?.total || 0;

      } catch (err) {
        console.error('Error en la petición:', err);
        this.error = 'No se pudieron cargar los registros.';
      } finally {
        this.loading = false;
      }
    },
    // ESTE MÉTODO FALTABA Y HACÍA QUE LA APP NO PINTARA NADA
    goToPage(page) {
      this.currentPage = page;
      this.fetchRecords();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

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

.page-header p {
  color: var(--soft-pink);
  font-size: 1.1rem;
  opacity: 0.8;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  min-height: 200px; /* Asegura espacio para el contenido */
}

.error {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 77, 141, 0.05);
  border: 1px dashed var(--primary-pink);
  border-radius: 12px;
  color: var(--soft-pink);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .records-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>