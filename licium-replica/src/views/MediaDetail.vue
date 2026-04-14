<template>
  <div class="media-detail">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando archivo multimedia...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <router-link to="/media" class="btn-back">← Volver a multimedia</router-link>
    </div>
    <template v-else-if="media">
      <div class="page-header">
        <router-link to="/media" class="btn-back">← Volver a multimedia</router-link>
        <h1>{{ getTitle }}</h1>
      </div>

      <div class="detail-layout">
        <!-- Contenedor del Media (Imagen o PDF) -->
        <div class="media-container" :class="{'is-pdf': isPdf}">
          
          <!-- PDF -->
          <iframe v-if="isPdf && fileUrl" :src="fileUrl" class="media-pdf" frameborder="0"></iframe>
          
          <!-- Imagen -->
          <img v-else-if="mediaUrl && !isPdf" :src="mediaUrl" :alt="getTitle" class="media-img" @click="openFullscreen" />
          
          <div v-else class="no-media">
            <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p>Formato no soportado para previsualización</p>
          </div>
          
          <button v-if="mediaUrl || fileUrl" class="btn-expand" @click.stop="openFullscreen" title="Ver a pantalla completa">⛶</button>
        </div>

        <!-- Información del Media -->
        <div class="media-info">
          <!-- TODO: Extraer y mostrar metadatos del joined_metadata si se necesita -->
          <div v-if="getDescription" class="description-block">
            <h3>Descripción</h3>
            <p>{{ getDescription }}</p>
          </div>
          
          <div class="actions">
            <a :href="fileUrl || mediaUrl" target="_blank" download class="btn-download">
              Descargar archivo
            </a>
          </div>
        </div>
      </div>

      <!-- Visor a Pantalla Completa (Lightbox) -->
      <div v-if="fullscreenOpen" class="lightbox" @click.self="closeFullscreen">
        <button class="lightbox-close" @click="closeFullscreen">✕</button>
        
        <iframe v-if="isPdf && fileUrl" :src="fileUrl" class="lightbox-pdf" frameborder="0"></iframe>
        <img v-else-if="mediaUrl && !isPdf" :src="mediaUrl" :alt="getTitle" @click.stop class="lightbox-img" />
      </div>
    </template>
  </div>
</template>

<script>
import { getMediaDetail } from '../api/licium.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

export default {
  data() {
    return {
      media: null,
      loading: true,
      error: null,
      fullscreenOpen: false
    }
  },

  computed: {
    getTitle() {
      if (!this.media?.title) return 'Archivo Multimedia'
      if (typeof this.media.title === 'string') return this.media.title
      const keys = Object.keys(this.media.title)
      return keys.length ? this.media.title[keys[0]] : 'Archivo Multimedia'
    },
    getDescription() {
      if (!this.media?.description) return null
      if (typeof this.media.description === 'string') return this.media.description
      const keys = Object.keys(this.media.description)
      return keys.length ? this.media.description[keys[0]] : null
    },
    mediaUrl() {
      let path = this.media?.path || this.media?.thumbnail?.large || this.media?.thumbnail?.medium || this.media?.thumbnail || null
      if (!path) return null
      if (typeof path === 'object') {
        const keys = Object.keys(path)
        path = keys.length ? path[keys[0]] : null
      }
      if (!path) return null
      
      if (path.startsWith('http')) return path
      return API_BASE + (path.startsWith('/') ? path : '/' + path)
    },
    isPdf() {
      if (this.media?.attachment?.mimetype === 'application/pdf') return true
      if (this.media?.media_type === 'pdf') return true
      const url = this.fileUrl || this.mediaUrl || ''
      if (typeof url === 'string') return url.toLowerCase().includes('.pdf')
      return false
    },
    fileUrl() {
  // Si es un array, cogemos el primer elemento si es objeto, usamos sus propiedades
  const attach = Array.isArray(this.media?.attachment) ? this.media.attachment[0] : this.media?.attachment;
  let path = attach?.url || this.media?.path || null;
  
  if (!path) return null
  if (path.startsWith('http')) return path
  return API_BASE + (path.startsWith('/') ? path : '/' + path)
}
  },

  created() {
    this.fetchMedia()
  },
  
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },

  methods: {
    async fetchMedia() {
      this.loading = true
      this.error = null
      try {
        const response = await getMediaDetail(this.$route.params.id)
        this.media = response.data.data || response.data
      } catch (err) {
        console.error('Error fetching media:', err)
        this.error = 'No se pudo cargar el archivo multimedia.'
      } finally {
        this.loading = false
      }
    },
    openFullscreen() {
      if (!this.mediaUrl) return
      this.fullscreenOpen = true
      document.body.style.overflow = 'hidden' // prevenir scroll de fondo
    },
    closeFullscreen() {
      this.fullscreenOpen = false
      document.body.style.overflow = ''
    },
    handleKeydown(e) {
      if (this.fullscreenOpen && e.key === 'Escape') {
        this.closeFullscreen()
      }
    }
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 2.2rem;
  color: var(--text-main);
  line-height: 1.3;
  margin-top: 1rem;
}

.btn-back {
  display: inline-block;
  color: var(--soft-pink);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  font-weight: 500;
  box-shadow: none;
}
.btn-back:hover {
  color: var(--primary-pink);
  transform: none;
  box-shadow: none;
}

.detail-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
}

/* Contenedor del Media */
.media-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}
.media-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(255, 77, 141, 0.15);
  border-color: rgba(255, 77, 141, 0.3);
}

/* Modificadores según PDF/Imagen */
.media-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000; 
  cursor: zoom-in;
}

.media-pdf {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.btn-expand {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0,0,0,0.4);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s, background 0.2s, transform 0.2s;
  z-index: 10;
}
.media-container:hover .btn-expand {
  opacity: 1;
}
.btn-expand:hover {
  background: rgba(255,77,141,0.8);
  transform: scale(1.05);
}

.no-media {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-muted);
}
.no-media svg {
  width: 64px;
  height: 64px;
  stroke: var(--soft-pink);
  opacity: 0.5;
}

/* Info */
.media-info {
  width: 100%;
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.description-block h3 {
  color: var(--soft-pink);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.8rem;
}
.description-block p {
  color: var(--text-body);
  line-height: 1.7;
}

.actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
}

.btn-download {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #ff4d8d, #ff85b1);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}
.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 77, 141, 0.4);
}

/* Lightbox (Fullscreen) */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.lightbox-img {
  max-width: 95vw;
  max-height: 95vh;
  object-fit: contain;
  cursor: zoom-out;
  user-select: none;
}

.lightbox-pdf {
  width: 90vw;
  height: 90vh;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 1.4rem;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
}
.lightbox-close:hover {
  background: rgba(255,77,141,0.5);
  box-shadow: none;
  transform: none;
}

/* Loading / error */
.loading { text-align: center; padding: 4rem 0; color: var(--loading-text); }
.spinner {
  width: 40px; height: 40px; border: 3px solid var(--spinner-track);
  border-top-color: #ff4d8d; border-radius: 50%;
  animation: spin 0.8s linear infinite; margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
.error { text-align: center; padding: 3rem; color: var(--primary-pink); }
</style>