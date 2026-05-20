<template>
  <div class="record-detail">

    <LoadingState v-if="loading" message="Cargando detalle..." />

    <ErrorState v-else-if="error" :message="error" />

    <template v-else-if="record">
      <div class="header-actions">
        <button @click="$router.back()" class="back-btn">← Volver</button>
        <button @click="downloadPDF" class="pdf-btn">📄 Descargar PDF</button>
      </div>

      <div ref="pdfContent" class="pdf-wrapper">
        <PdfNoticeBanner v-if="hasPdf" :media-id="pdfMediaId" />

        <div class="detail-layout">

          <!-- Columna izquierda: galería -->
          <RecordGallery
            :images="galleryImages"
            :title="getTitle"
            :class="{ 'no-image-col': !galleryImages.length }"
          />

          <!-- Columna derecha: título + metadatos + Wikipedia -->
          <div class="detail-info">
            <h1>{{ getTitle }}</h1>
            <RecordMetadata
              :collections="getCollections"
              :description="getDescription"
              :canonical-rows="canonicalRows"
              :joined-rows="joinedRows"
            />

            <!-- Panel de Wikipedia — se muestra solo si hay resultado -->
            <WikipediaPanel :record-title="getTitle" />
          </div>

        </div>
      </div>
    </template>

  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import { getRecordDetail } from '../api/licium.js'
import PdfNoticeBanner  from '../components/PdfNoticeBanner.vue'
import RecordGallery    from '../components/RecordGallery.vue'
import RecordMetadata   from '../components/RecordMetadata.vue'
import LoadingState     from '../components/LoadingState.vue'
import ErrorState       from '../components/ErrorState.vue'
import WikipediaPanel   from '../components/WikipediaPanel.vue'
import { 
  getTitle, 
  getDescription, 
  parseJoinedField, 
  applyFieldsOrder,
  extractMultilingual
} from '../utils/data-utils.js'
import { toAbsUrl, getResizedUrl, isPdf, getAttachmentId, getThumbnailUrl } from '../utils/image.js'

export default {
  components: { 
    PdfNoticeBanner, 
    RecordGallery, 
    RecordMetadata, 
    LoadingState, 
    ErrorState,
    WikipediaPanel
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
      return getThumbnailUrl(this.record, 'large')
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
        let displayUrl = getThumbnailUrl(item, 'large')
        let largeUrl = getResizedUrl(displayUrl, 'original')

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
    },
    downloadPDF() {
      const element = this.$refs.pdfContent;
      const title = this.getTitle ? this.getTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'record';
      const opt = {
        margin:       10,
        filename:     `${title}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    }
  }
}
</script>

<style scoped>
.back-btn {
  display: inline-block; color: var(--gold-medium); text-decoration: none;
  margin-bottom: 1.5rem; font-size: 0.9rem; transition: all 0.3s;
  background: transparent; border: none; cursor: pointer; padding: 0.5rem 1rem;
  font-weight: 600; box-shadow: none;
  border: 1px solid var(--gold-light);
  border-radius: 50px;
}
.back-btn:hover { color: var(--gold-dark); border-color: var(--gold-dark); background: var(--gold-soft); }

.header-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.pdf-btn {
  display: inline-flex; 
  align-items: center;
  gap: 0.5rem;
  color: #fff; 
  text-decoration: none; 
  font-size: 0.9rem; 
  transition: all 0.3s;
  background: var(--gold-medium); 
  border: 1px solid var(--gold-medium); 
  cursor: pointer; 
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
}

.pdf-btn:hover {
  background: var(--gold-dark);
  border-color: var(--gold-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(185, 158, 124, 0.3);
}

.pdf-wrapper {
  background-color: var(--bg-marble);
  padding: 1rem;
  border-radius: 8px;
}

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
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-family: var(--font-serif);
  color: var(--text-main);
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-weight: 700;
}
</style>