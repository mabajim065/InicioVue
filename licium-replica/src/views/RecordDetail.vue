<template>
  <div class="record-detail">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando detalle...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="$router.back()" class="back-btn">← Volver</button>
    </div>
    <template v-else-if="record">
      <button @click="$router.back()" class="back-btn">← Volver</button>
      <div class="detail-layout">
        <div class="detail-image">
          <img v-if="imageUrl" :src="imageUrl" :alt="getTitle" @click="openLightbox(imageUrl)" class="main-img" />
          <div v-else class="no-image"></div>
        </div>
        <div class="detail-info">
          <h1>{{ getTitle }}</h1>
          <div v-if="getCollections.length" class="collections-list">
            <h3>Colecciones</h3>
            <div class="col-tags">
              <router-link v-for="col in getCollections" :key="col.id" :to="`/collections/${col.id}`" class="col-tag">
                {{ col.title }}
              </router-link>
            </div>
          </div>
          <div v-if="getDescription" class="description">
            <h3>Descripción</h3>
            <p>{{ getDescription }}</p>
          </div>
          <div v-if="hasJoinedMetadata" class="metadata">
            <button class="metadata-toggle" @click="metadatosAbiertos = !metadatosAbiertos">
              Metadatos {{ metadatosAbiertos ? '▲' : '▼' }}
            </button>
            <table v-if="metadatosAbiertos">
              <tr v-for="(value, key) in record.joined_metadata" :key="key">
                <td class="meta-key">{{ formatKey(key) }}</td>
                <td class="meta-value">{{ formatValue(value) }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Galería de imágenes asociadas -->
      <div v-if="associatedImages.length > 1" class="gallery-section">
        <h3 class="gallery-title">Imágenes asociadas</h3>
        <div class="gallery-scroll">
          <div
            v-for="(img, i) in associatedImages"
            :key="i"
            class="gallery-item"
            :class="{ active: img === imageUrl }"
            @click="openLightbox(img)"
          >
            <img :src="img" :alt="`Imagen ${i+1}`" />
          </div>
        </div>
      </div>

      <!-- Lightbox -->
      <div v-if="lightboxUrl" class="lightbox" @click.self="lightboxUrl = null">
        <button class="lightbox-close" @click="lightboxUrl = null">✕</button>
        <img :src="lightboxUrl" :alt="getTitle" />
      </div>
    </template>
  </div>
</template>

<script>
import { getRecordDetail } from '../api/licium.js'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

export default {
  data() {
    return { record: null, loading: true, error: null, metadatosAbiertos: false, mediaImages: [], lightboxUrl: null }
  },
  computed: {
    imageUrl() {
      let thumb = this.record?.thumbnail
      if (!thumb) return null
      if (typeof thumb === 'object') { const keys = Object.keys(thumb); thumb = keys.length > 0 ? thumb[keys[0]] : null }
      if (!thumb) return null
      if (thumb.startsWith('http')) return thumb
      const path = thumb.startsWith('/') ? thumb : `/${thumb}`
      return `${API_BASE}${path}`
    },
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
    },
    getCollections() {
      if (!this.record?.collections) return []
      return this.record.collections.map(col => ({
        id: col.id,
        title: typeof col.title === 'string' ? col.title : col.title?.[Object.keys(col.title)[0]] || 'Colección'
      }))
    },
    hasJoinedMetadata() {
      const m = this.record?.joined_metadata
      return m && typeof m === 'object' && Object.keys(m).length > 0
    },
    associatedImages() {
      const imgs = []
      if (this.imageUrl) imgs.push(this.imageUrl)
      for (const url of this.mediaImages) {
        if (!imgs.includes(url)) imgs.push(url)
      }
      return imgs
    }
  },
  created() { this.fetchRecord() },
  methods: {
    async fetchRecord() {
      this.loading = true; this.error = null
      try {
        const id = this.$route.params.id
        const response = await getRecordDetail(id)
        this.record = response.data.data || response.data
        this.fetchMedia(id)
      } catch (err) { console.error('Error:', err); this.error = 'No se pudo cargar el registro.' }
      finally { this.loading = false }
    },
    async fetchMedia(id) {
      try {
        const res = await axios.get(`/api/glam/record/${id}/media`, { params: { with_labels: 1 } })
        const items = res.data?.items || res.data?.data?.items || res.data?.data || []
        this.mediaImages = (Array.isArray(items) ? items : [])
          .map(item => {
            let url = item?.url || item?.thumbnail || item?.file_url || item?.path
            if (!url) return null
            if (url.startsWith('http')) return url
            return API_BASE + (url.startsWith('/') ? url : '/' + url)
          })
          .filter(Boolean)
      } catch (e) {
        this.mediaImages = []
      }
    },
    openLightbox(url) { this.lightboxUrl = url },
    formatKey(key) {
      if (!key) return ''
      const parts = key.split('.')
      return parts[parts.length - 1].replace(/_/g, ' ').toUpperCase()
    },
    formatValue(val) {
      if (!val) return ''
      if (Array.isArray(val)) {
        return val.map(v => {
          if (typeof v === 'object' && v !== null) return v['@value'] || v['value'] || v['values']?.[0]?.['@value'] || JSON.stringify(v)
          return v
        }).join(', ')
      }
      if (typeof val === 'object' && val.values) return val.values.map(v => v['@value'] || v).join(', ')
      if (typeof val === 'object' && val['@value']) return val['@value']
      return String(val)
    }
  }
}
</script>

<style scoped>
.back-btn {
  display: inline-block;
  color: var(--soft-pink);
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  transition: color 0.3s;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  font-weight: 500;
  box-shadow: none;
}
.back-btn:hover { color: var(--primary-pink); transform: none; box-shadow: none; }

.detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
@media (max-width: 768px) { .detail-layout { grid-template-columns: 1fr; } }

.detail-image img { width: 100%; border-radius: 12px; box-shadow: 0 8px 30px rgba(255, 77, 141, 0.1); }
.detail-image .main-img { cursor: zoom-in; transition: transform 0.2s; }
.detail-image .main-img:hover { transform: scale(1.01); }

.gallery-section { margin-top: 2.5rem; }
.gallery-title { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; }
.gallery-scroll { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.75rem; scrollbar-width: thin; scrollbar-color: rgba(255,77,141,0.4) transparent; }
.gallery-scroll::-webkit-scrollbar { height: 6px; }
.gallery-scroll::-webkit-scrollbar-thumb { background: rgba(255,77,141,0.4); border-radius: 10px; }
.gallery-item { flex: 0 0 160px; height: 110px; border-radius: 10px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.25s; }
.gallery-item:hover { border-color: rgba(255,133,177,0.5); transform: translateY(-2px); }
.gallery-item.active { border-color: var(--primary-pink); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }

.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: zoom-out; }
.lightbox img { max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
.lightbox-close { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 1.4rem; width: 42px; height: 42px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.lightbox-close:hover { background: rgba(255,77,141,0.5); box-shadow: none; transform: none; }

.detail-image .no-image {
  width: 100%;
  aspect-ratio: 4/3;
  background: var(--no-image-detail-bg);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  opacity: 0.3;
}

.detail-info h1 { font-size: 1.8rem; color: var(--text-main); margin-bottom: 1.5rem; line-height: 1.3; }

.collections-list { margin-bottom: 1.5rem; }
.collections-list h3 { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.6rem; }
.col-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.col-tag {
  background: var(--glass-pink);
  border: 1px solid rgba(255, 133, 177, 0.3);
  color: var(--primary-pink);
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.3s;
}
.col-tag:hover { background: rgba(255, 77, 141, 0.15); color: var(--primary-pink); }

.description { margin-bottom: 2rem; }
.description h3 { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; }
.description p { color: var(--text-body); line-height: 1.7; }

.metadata { margin-top: 1.5rem; }
.metadata-toggle {
  background: var(--glass-pink);
  border: 1px solid rgba(255, 133, 177, 0.2);
  color: var(--primary-pink);
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: all 0.3s;
  box-shadow: none;
}
.metadata-toggle:hover { background: rgba(255, 77, 141, 0.15); transform: none; box-shadow: none; }
.metadata table { width: 100%; border-collapse: collapse; }
.metadata tr { border-bottom: 1px solid var(--meta-row-border); }
.metadata td { padding: 0.7rem 0; vertical-align: top; }
.meta-key { color: var(--meta-key-color); font-size: 0.85rem; width: 35%; font-weight: 500; }
.meta-value { color: var(--meta-value-color); font-size: 0.85rem; }

.loading { text-align: center; padding: 4rem 0; color: var(--loading-text); }
.spinner { width: 40px; height: 40px; border: 3px solid var(--spinner-track); border-top-color: #ff4d8d; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
.error { text-align: center; padding: 3rem; color: var(--primary-pink); }
</style>