<template>
  <div class="collection-detail">
    <LoadingState v-if="loading" message="Cargando colección..." />

    <ErrorState v-else-if="error" :message="error" />

    <template v-else-if="collection">
      <button @click="$router.back()" class="back-btn">← Volver atrás</button>
      
      <CollectionHero :collection="collection" />
      
      <CollectionMetadata :collection="collection" />
      
      <CollectionRecordsSection 
        :records="records" 
        :loading="loadingRecords" 
        :current-page="currentPage" 
        :total-pages="totalPages" 
        @page-change="goToPage" 
      />
    </template>
  </div>
</template>

<script>
import { getCollectionDetail, getRecords } from '../api/licium.js'
import CollectionHero from '../components/CollectionHero.vue'
import CollectionMetadata from '../components/CollectionMetadata.vue'
import CollectionRecordsSection from '../components/CollectionRecordsSection.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState   from '../components/ErrorState.vue'

export default {
  components: { 
    CollectionHero, 
    CollectionMetadata, 
    CollectionRecordsSection,
    LoadingState,
    ErrorState
  },
  data() {
    return { 
      collection: null, 
      records: [], 
      loading: true, 
      loadingRecords: false, 
      error: null, 
      currentPage: 1, 
      totalRecords: 0, 
      limit: 24 
    }
  },
  computed: {
    totalPages() { return Math.ceil(this.totalRecords / this.limit) || 1 }
  },
  created() { this.fetchCollection() },
  methods: {
    async fetchCollection() {
      this.loading = true; this.error = null
      try {
        const id = this.$route.params.id
        const response = await getCollectionDetail(id)
        this.collection = response.data.data || response.data
        await this.fetchRecords()
      } catch (err) { console.error('Error:', err); this.error = 'No se pudo cargar la colección.' }
      finally { this.loading = false }
    },
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
      } catch (err) { console.error('Error records:', err) }
      finally { this.loadingRecords = false }
    },
    goToPage(page) { this.currentPage = page; this.fetchRecords(); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }
}
</script>

<style scoped>
.back-btn { 
  display: inline-block; color: var(--soft-pink); 
  text-decoration: none; margin-bottom: 1.5rem; 
  font-size: 0.9rem; transition: color 0.3s;
  background: transparent; border: none; cursor: pointer; padding: 0;
}
.back-btn:hover { color: var(--primary-pink); }
</style>
