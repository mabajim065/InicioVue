<template>
  <div class="record-detail">

    <!-- Estado de carga -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando detalle...</p>
    </div>

    <!-- Error con enlace para volver -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <router-link to="/record" class="back-btn">← Volver al listado</router-link>
    </div>

 
    <template v-else-if="record">

      
      <router-link to="/record" class="back-btn">← Volver al listado</router-link>

      <div class="detail-layout">

        
        <div class="detail-image">
          <img v-if="record.thumbnail" :src="record.thumbnail" :alt="getTitle" />
          <div v-else class="no-image"></div>
        </div>

        <div class="detail-info">

        
          <h1>{{ getTitle }}</h1>

          
          <div v-if="getDescription" class="description">
            <h3>Descripción</h3>
            <p>{{ getDescription }}</p>
          </div>

          
          <div v-if="record.canonical_joined_metadata" class="metadata">
            <h3>Metadatos</h3>
            <table>
              <tr v-for="(value, key) in record.canonical_joined_metadata" :key="key">
                <td class="meta-key">{{ formatKey(key) }}</td>
                <td class="meta-value">{{ formatValue(value) }}</td>
              </tr>
            </table>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getRecordDetail } from '../api/licium.js'

export default {
  data() {
    return {
      record: null,   
      loading: true,  
      error: null 
    }
  },

  computed: {
   
    getTitle() {
      if (!this.record?.title) return 'Sin título'
      if (typeof this.record.title === 'string') return this.record.title
      const keys = Object.keys(this.record.title)
      return keys.length > 0 ? this.record.title[keys[0]] : 'Sin título'
    },
    
    getDescription() {
      if (!this.record?.description) return null
      if (typeof this.record.description === 'string') return this.record.description
      const keys = Object.keys(this.record.description)
      return keys.length > 0 ? this.record.description[keys[0]] : null
    }
  },

  
  created() {
    this.fetchRecord()
  },

  methods: {
    // Pide el detalle del record por id
    async fetchRecord() {
      this.loading = true
      this.error = null
      try {
        const id = this.$route.params.id
        const response = await getRecordDetail(id)
        this.record = response.data.data || response.data
      } catch (err) {
        console.error('Error:', err)
        this.error = 'No se pudo cargar el registro.'
      } finally {
        this.loading = false
      }
    },

    // Formatea la clave del metadato para mostrarla legible
    formatKey(key) {
      if (!key) return ''
      const parts = key.split('.')
      return parts[parts.length - 1].replace(/_/g, ' ').toUpperCase()
    },

    // Formatea el valor del metadato
    formatValue(val) {
      return Array.isArray(val) ? val.join(', ') : val
    }
  }
}
</script>

<style scoped>
.back-btn { display: inline-block; color: #ff85b1; text-decoration: none; margin-bottom: 1.5rem; font-size: 0.9rem; transition: color 0.3s; }
.back-btn:hover { color: #ffadd0; }
.detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
@media (max-width: 768px) { .detail-layout { grid-template-columns: 1fr; } }
.detail-image img { width: 100%; border-radius: 12px; box-shadow: 0 8px 30px rgba(255, 77, 141, 0.1); }
.detail-image .no-image { width: 100%; aspect-ratio: 4/3; background: #1a1a2e; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 4rem; opacity: 0.3; }
.detail-info h1 { font-size: 1.8rem; color: #fff; margin-bottom: 1.5rem; line-height: 1.3; }
.description { margin-bottom: 2rem; }
.description h3, .metadata h3 { color: #ff85b1; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; }
.description p { color: rgba(255,255,255,0.7); line-height: 1.7; }
.metadata table { width: 100%; border-collapse: collapse; }
.metadata tr { border-bottom: 1px solid rgba(255, 77, 141, 0.08); }
.metadata td { padding: 0.7rem 0; vertical-align: top; }
.meta-key { color: rgba(255,133,177,0.7); font-size: 0.85rem; width: 35%; font-weight: 500; }
.meta-value { color: rgba(255,255,255,0.8); font-size: 0.85rem; }
.loading { text-align: center; padding: 4rem 0; color: rgba(255,255,255,0.6); }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #ff4d8d; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
.error { text-align: center; padding: 3rem; color: #ff6b6b; }
</style>