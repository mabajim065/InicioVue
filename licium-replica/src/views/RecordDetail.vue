<template>
  <div class="record-detail">

    <LoadingState v-if="loading" message="Cargando detalle..." />

    <ErrorState v-else-if="error" :message="error" />

    <template v-else-if="record">
      <button @click="$router.back()" class="back-btn">← Volver</button>

      <PdfNoticeBanner v-if="hasPdf" :media-id="pdfMediaId" />

      <div class="detail-layout">

        <!-- Columna izquierda: galería -->
        <RecordGallery
          :images="galleryImages"
          :title="getTitle"
          :class="{ 'no-image-col': !galleryImages.length }"
        />

        <!-- Columna derecha: título + metadatos -->
        <div class="detail-info">
          <h1>{{ getTitle }}</h1>
          <RecordMetadata
            :collections="getCollections"
            :description="getDescription"
            :canonical-rows="canonicalRows"
            :joined-rows="joinedRows"
          />
        </div>

      </div>
    </template>

  </div>
</template>

<script>
import { getRecordDetail } from '../api/licium.js'
import PdfNoticeBanner from '../components/PdfNoticeBanner.vue'
import RecordGallery   from '../components/RecordGallery.vue'
import RecordMetadata  from '../components/RecordMetadata.vue'
import LoadingState    from '../components/LoadingState.vue'
import ErrorState      from '../components/ErrorState.vue'
import { 
  getTitle, 
  getDescription, 
  parseJoinedField, 
  applyFieldsOrder,
  extractMultilingual
} from '../utils/data-utils.js'
import { toAbsUrl, getResizedUrl, isPdf, getAttachmentId } from '../utils/image.js'

export default {
  components: { 
    PdfNoticeBanner, 
    RecordGallery, 
    RecordMetadata, 
    LoadingState, 
    ErrorState 
  },

  data() {
    return {
      record: null,
      loading: true,
      error: null,
    }
  },

  computed: {
    getTitle() {
      return getTitle(this.record)
    },

    getDescription() {
      return getDescription(this.record)
    },

    getCollections() {
      if (!this.record?.collections) return []
      return this.record.collections.map(col => ({
        id: col.id,
        title: getTitle(col)
      }))
    },

    hasPdf() {
      return isPdf(this.record)
    },

    pdfMediaId() {
      return this.record?.media_items?.find(m => isPdf(m))?.id ?? null
    },

    mainImageUrl() {
      const url = toAbsUrl(extractMultilingual(this.record?.thumbnail, null))
      return getResizedUrl(url, 'large')
    },

    galleryImages() {
      const result = []
      const mainImageUrl = this.mainImageUrl
      const mainAttachId = getAttachmentId(mainImageUrl)

      if (mainImageUrl) {
        result.push({ 
          display: mainImageUrl, 
          large: getResizedUrl(mainImageUrl, 'original'), 
          isPdf: false, 
          id: null, 
          attachId: mainAttachId 
        })
      }

      const items = this.record?.media_items
      if (!Array.isArray(items)) return result

      for (const item of items) {
        let displayUrl = null, largeUrl = null

        const thumb = item.thumbnail
        if (thumb) {
          const rawUrl = toAbsUrl(typeof thumb === 'object' ? (thumb.large || thumb.medium || thumb.small || Object.values(thumb)[0]) : thumb)
          displayUrl = getResizedUrl(rawUrl, 'large')
          largeUrl = getResizedUrl(rawUrl, 'original')
        }

        if (!displayUrl && item.path) {
          displayUrl = toAbsUrl(item.path)
          largeUrl = displayUrl
        }

        if (!displayUrl) continue

        const attachId = getAttachmentId(displayUrl)
        const itemIsPdf = isPdf(item)

        if (result.length > 0 && ((attachId && attachId === result[0].attachId) || (!attachId && displayUrl === result[0].display))) {
          result[0].id = item.id
          result[0].isPdf = itemIsPdf
          continue
        }

        const alreadyAdded = attachId
          ? result.some(r => r.attachId === attachId)
          : result.some(r => r.display === displayUrl)

        if (!alreadyAdded) {
          result.push({ id: item.id, display: displayUrl, large: largeUrl || displayUrl, isPdf: itemIsPdf, attachId })
        }
      }

      return result
    },

    canonicalRows() {
      const meta = this.record?.canonical_joined_metadata
      if (!meta || typeof meta !== 'object') return []
      return applyFieldsOrder(
        Object.entries(meta)
          .map(([key, fd]) => parseJoinedField(fd?.term || key, fd))
          .filter(r => r.values.length)
      )
    },

    joinedRows() {
      const meta = this.record?.joined_metadata
      if (!meta || typeof meta !== 'object') return []
      return applyFieldsOrder(
        Object.entries(meta)
          .map(([key, fd]) => parseJoinedField(key, fd))
          .filter(r => r.values.length)
      )
    },
  },

  created() {
    this.fetchRecord()
  },

  methods: {
    async fetchRecord() {
      this.loading = true
      this.error = null
      try {
        const response = await getRecordDetail(this.$route.params.id)
        this.record = response.data.data || response.data
      } catch (err) {
        console.error('Error cargando record:', err)
        this.error = 'No se pudo cargar el registro.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.back-btn {
  display: inline-block; color: var(--soft-pink); text-decoration: none;
  margin-bottom: 1.5rem; font-size: 0.9rem; transition: color 0.3s;
  background: transparent; border: none; cursor: pointer; padding: 0;
  font-weight: 500; box-shadow: none;
}
.back-btn:hover { color: var(--primary-pink); transform: none; box-shadow: none; }

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (max-width: 768px) {
  .detail-layout { grid-template-columns: 1fr; }
  .detail-layout > .no-image-col { display: none; }
}

.detail-info h1 {
  font-size: 1.8rem;
  color: var(--text-main);
  margin-bottom: 1.5rem;
  line-height: 1.3;
}
</style>