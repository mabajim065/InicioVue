<template>
  <div class="media-detail">
    <LoadingState v-if="loading" message="Cargando archivo multimedia..." />

    <ErrorState v-else-if="error" :message="error" />

    <template v-else-if="media">
      <div class="page-header">
        <button @click="$router.back()" class="btn-back">← Volver atrás</button>
        <h1>{{ getTitle }}</h1>
      </div>

      <div class="detail-layout">
        <MediaPreview
          :is-pdf="isPdf"
          :file-url="fileUrl"
          :image-url="mediaUrl"
          :title="getTitle"
          @open-fullscreen="openFullscreen"
        />

        <MediaInfo
          :description="getDescription"
          :download-url="fileUrl || mediaUrl"
        >
          <template #after-info>
            <div class="metadata-section" v-if="canonicalRows.length">
              <RecordMetadata :canonical-rows="canonicalRows" />
            </div>
          </template>
        </MediaInfo>
      </div>

      <!-- Visor a Pantalla Completa (Lightbox) -->
      <div v-if="fullscreenOpen" class="lightbox" @click.self="closeFullscreen">
        <button class="lightbox-close" @click="closeFullscreen">✕</button>
        <iframe v-if="isPdf && fileUrl" :src="fileUrl" class="lightbox-pdf" frameborder="0"></iframe>
        <img v-else-if="lightboxUrl && !isPdf" :src="lightboxUrl" :alt="getTitle" @click.stop class="lightbox-img" />
      </div>
    </template>
  </div>
</template>

<script>
import { getMediaDetail } from '../api/licium.js'
import { getTitle, getDescription, extractMultilingual, parseJoinedField, applyFieldsOrder } from '../utils/data-utils.js'
import { toAbsUrl, getResizedUrl, getThumbnailUrl, isPdf } from '../utils/image.js'
import LoadingState from '../components/LoadingState.vue'
import ErrorState   from '../components/ErrorState.vue'
import MediaPreview from '../components/MediaPreview.vue'
import MediaInfo    from '../components/MediaInfo.vue'
import RecordMetadata from '../components/RecordMetadata.vue'

export default {
  components: {
    LoadingState,
    ErrorState,
    MediaPreview,
    MediaInfo,
    RecordMetadata
  },
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
      return getTitle(this.media)
    },
    getDescription() {
      return getDescription(this.media)
    },
    mediaUrl() {
      return getThumbnailUrl(this.media, 'large')
    },
    lightboxUrl() {
      // Intentamos original, si no large
      return getThumbnailUrl(this.media, 'original') || getThumbnailUrl(this.media, 'large')
    },
    isPdf() {
      if (this.media?.attachment?.mimetype === 'application/pdf') return true
      return isPdf(this.media)
    },
    fileUrl() {
      const attach = Array.isArray(this.media?.attachment) ? this.media.attachment[0] : this.media?.attachment
      let path = attach?.url || this.media?.path || null
      return toAbsUrl(path)
    },
    canonicalRows() {
      const meta = this.media?.canonical_joined_metadata
      if (!meta || typeof meta !== 'object') return []
      return applyFieldsOrder(
        Object.entries(meta)
          .map(([key, fd]) => parseJoinedField(fd?.term || key, fd))
          .filter(r => r.values.length)
      )
    },
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
      document.body.style.overflow = 'hidden' 
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
}
.btn-back:hover {
  color: var(--primary-pink);
}

.detail-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
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
}
</style>