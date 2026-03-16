<template>
  <div class="collection-detail">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando colección...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <router-link to="/collections" class="back-btn">← Volver a colecciones</router-link>
    </div>

    <template v-else-if="collection">
      <router-link to="/collections" class="back-btn">← Volver a colecciones</router-link>

      <div class="collection-header">
        <h1>{{ getTitle }}</h1>
        <p v-if="getDescription" class="col-description">{{ getDescription }}</p>
      </div>

      <div v-if="collection.records && collection.records.length" class="records-grid">
        <RecordCard
          v-for="record in collection.records"
          :key="record.id"
          :record="record"
        />
      </div>

      <div v-else class="empty">
        <p>No hay registros disponibles en esta colección.</p>
      </div>
    </template>
  </div>
</template>

<script>
import { getCollectionDetail } from '../api/licium.js'
import RecordCard from '../components/RecordCard.vue'

export default {
  components: { RecordCard },
  data() {
    return {
      collection: null,
      loading: true,
      error: null
    }
  },
 computed: {
  getTitle() {
    return this.collection?.title?.value || this.collection?.title || 'Sin título';
  },
  getDescription() {
    return this.collection?.description?.value || this.collection?.description || '';
  }
  },
  created() {
    this.fetchCollection()
  },
  methods: {
    async fetchCollection() {
      this.loading = true
      this.error = null

      try {
        const id = this.$route.params.id
        const response = await getCollectionDetail(id)
        this.collection = response.data.data || response.data
      } catch (err) {
        console.error('Error fetching collection:', err)
        this.error = 'No se pudo cargar la colección.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.back-btn {
  display: inline-block;
  color: #ff85b1;
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.back-btn:hover {
  color: #ffadd0;
}

.collection-header {
  margin-bottom: 2rem;
}

.collection-header h1 {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.col-description {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  max-width: 800px;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 133, 177, 0.4);
  font-style: italic;
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
</style>