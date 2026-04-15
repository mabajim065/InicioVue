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

const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

// ─── Constantes de metadatos ────────────────────────────────────────────────

const METADATA_FIELDS_ORDER = [
  'dcterms:title', 'dcterms:creator', 'dcterms:contributor',
  'dcterms:subject', 'dcterms:description', 'dcterms:abstract',
  'dcterms:publisher', 'dcterms:date', 'dcterms:created',
  'dcterms:issued', 'dcterms:modified', 'dcterms:type',
  'dcterms:format', 'dcterms:extent', 'dcterms:medium',
  'dcterms:identifier', 'dcterms:source', 'dcterms:language',
  'dcterms:relation', 'dcterms:isPartOf', 'dcterms:hasPart',
  'dcterms:coverage', 'dcterms:spatial', 'dcterms:temporal',
  'dcterms:rights', 'dcterms:license', 'dcterms:rightsHolder',
  'dcterms:provenance', 'dcterms:audience', 'dcterms:alternative',
  'dc:title', 'dc:creator', 'dc:subject', 'dc:description',
  'dc:publisher', 'dc:contributor', 'dc:date', 'dc:type',
  'dc:format', 'dc:identifier', 'dc:source', 'dc:language',
  'dc:relation', 'dc:coverage', 'dc:rights',
]

const LABEL_FALLBACK = {
  'dcterms:title': 'Título',         'dcterms:creator': 'Creador',
  'dcterms:contributor': 'Colaborador', 'dcterms:subject': 'Materia',
  'dcterms:description': 'Descripción', 'dcterms:abstract': 'Resumen',
  'dcterms:publisher': 'Editorial',  'dcterms:date': 'Fecha',
  'dcterms:created': 'Fecha de creación', 'dcterms:issued': 'Fecha de publicación',
  'dcterms:modified': 'Última modificación', 'dcterms:type': 'Tipo',
  'dcterms:format': 'Formato',       'dcterms:extent': 'Extensión',
  'dcterms:medium': 'Soporte',       'dcterms:identifier': 'Identificador',
  'dcterms:source': 'Fuente',        'dcterms:language': 'Idioma',
  'dcterms:relation': 'Relación',    'dcterms:isPartOf': 'Parte de',
  'dcterms:hasPart': 'Contiene',     'dcterms:coverage': 'Cobertura',
  'dcterms:spatial': 'Lugar',        'dcterms:temporal': 'Período',
  'dcterms:rights': 'Derechos',      'dcterms:license': 'Licencia',
  'dcterms:rightsHolder': 'Titular de derechos', 'dcterms:provenance': 'Procedencia',
  'dcterms:audience': 'Audiencia',   'dcterms:alternative': 'Título alternativo',
  'dc:title': 'Título',    'dc:creator': 'Creador',   'dc:subject': 'Materia',
  'dc:description': 'Descripción',   'dc:publisher': 'Editorial',
  'dc:contributor': 'Colaborador',   'dc:date': 'Fecha',   'dc:type': 'Tipo',
  'dc:format': 'Formato',            'dc:identifier': 'Identificador',
  'dc:source': 'Fuente',             'dc:language': 'Idioma',
  'dc:relation': 'Relación',         'dc:coverage': 'Cobertura', 'dc:rights': 'Derechos',
}

// ─── Helpers de parseo ───────────────────────────────────────────────────────

function toAbsUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return API_BASE + (url.startsWith('/') ? url : '/' + url)
}

function parseValueObject(v) {
  if (v === null || v === undefined) return null
  if (typeof v !== 'object') return { type: 'literal', text: String(v), href: null }

  const rawType = v.type || v['@type'] || ''
  const type = rawType.toLowerCase()

  if (type === 'literal' || type.startsWith('xsd:')) {
    return { type: 'literal', text: String(v['@value'] ?? v.value ?? ''), href: null }
  }

  if (type === 'uri') {
    const href = v.uri || v['@id'] || v.value || ''
    let text = v.label ? (typeof v.label === 'string' ? v.label : (Object.values(v.label)[0] || '')) : ''
    return { type: 'uri', text: text || href, href }
  }

  if (type === 'resource') {
    const id = v.id ?? null
    const model = v.model || ''
    let routerTo = null
    const href = v.uri || v['@id'] || null
    if (model === 'glam.record'     && id !== null) routerTo = `/records/${id}`
    else if (model === 'glam.collection' && id !== null) routerTo = `/collections/${id}`
    else if (model === 'glam.media' && id !== null) routerTo = `/media/${id}`
    let text = v.label ? (typeof v.label === 'string' ? v.label : Object.values(v.label)[0] || '') : ''
    if (!text) text = routerTo || href || ''
    return { type: 'resource', text, href, routerTo }
  }

  if (type === 'authority') {
    let text = v.label ? (typeof v.label === 'string' ? v.label : Object.values(v.label)[0] || '') : ''
    if (!text) text = v.uri || v['@id'] || ''
    const badges = Array.isArray(v.entity_types) ? v.entity_types : []
    return { type: 'authority', text, href: v.uri || null, badges, desc: v.canonical_data?.description || null }
  }

  if (type === 'vocabulary' || type === 'skos:concept') {
    let text = v.label ? (typeof v.label === 'string' ? v.label : Object.values(v.label)[0] || '') : ''
    if (!text) text = v['@value'] || v.value || ''
    return { type: 'vocabulary', text, href: v.uri || v['@id'] || null }
  }

  // fallback
  return { type: 'literal', text: String(v['@value'] ?? v.value ?? v.label ?? v.uri ?? v['@id'] ?? ''), href: null }
}

function parseJoinedField(key, fieldData) {
  const termKey = fieldData?.term || key
  const apiLabel = typeof fieldData?.label === 'string' ? fieldData.label : ''
  const isTrivialLabel = !apiLabel || apiLabel === key || apiLabel === termKey || (!apiLabel.includes(':') && !apiLabel.includes(' '))
  const label = isTrivialLabel ? (LABEL_FALLBACK[termKey] || LABEL_FALLBACK[key] || apiLabel || key) : apiLabel
  const values = (Array.isArray(fieldData?.values) ? fieldData.values : [])
    .map(parseValueObject).filter(v => v && v.text)
  return { key, label, values }
}

function applyFieldsOrder(rows) {
  const orderMap = {}
  METADATA_FIELDS_ORDER.forEach((k, i) => { orderMap[k] = i })
  return [...rows].sort((a, b) => (orderMap[a.key] ?? 9999) - (orderMap[b.key] ?? 9999))
}

function isPdfItem(item) {
  return (
    item.media_type === 'pdf' ||
    item.media_type === 'application/pdf' ||
    (item.path      && item.path.toLowerCase().includes('.pdf')) ||
    (item.file_name && item.file_name.toLowerCase().includes('.pdf')) ||
    (item.title     && item.title.toLowerCase().includes('.pdf'))
  )
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default {
  components: { PdfNoticeBanner, RecordGallery, RecordMetadata },

  data() {
    return {
      record: null,
      loading: true,
      error: null,
    }
  },

  computed: {
    getTitle() {
      if (!this.record?.title) return 'Sin título'
      if (typeof this.record.title === 'string') return this.record.title
      const keys = Object.keys(this.record.title)
      return keys.length ? this.record.title[keys[0]] : 'Sin título'
    },

    getDescription() {
      if (!this.record?.description) return null
      if (typeof this.record.description === 'string') return this.record.description
      const keys = Object.keys(this.record.description)
      return keys.length ? this.record.description[keys[0]] : null
    },

    getCollections() {
      if (!this.record?.collections) return []
      return this.record.collections.map(col => ({
        id: col.id,
        title: typeof col.title === 'string' ? col.title : (col.title?.[Object.keys(col.title)[0]] || 'Colección')
      }))
    },

    hasPdf() {
      return !!this.record?.media_items?.some(isPdfItem)
    },

    pdfMediaId() {
      return this.record?.media_items?.find(isPdfItem)?.id ?? null
    },

    mainImageUrl() {
      let thumb = this.record?.thumbnail
      if (!thumb) return null
      if (typeof thumb === 'object') {
        const keys = Object.keys(thumb)
        thumb = keys.length ? thumb[keys[0]] : null
      }
      return toAbsUrl(thumb)
    },

    galleryImages() {
      const result = []
      const mainAttachId = this.mainImageUrl
        ? (this.mainImageUrl.match(/attachment_id=(\d+)/) || [])[1] || null
        : null

      if (this.mainImageUrl) {
        const mainMedium = mainAttachId
          ? toAbsUrl(`/api/core/attachment/action_get/thumb?attachment_id=${mainAttachId}&size=medium`)
          : this.mainImageUrl
        result.push({ display: mainMedium, large: this.mainImageUrl, isPdf: false, id: null, attachId: mainAttachId })
      }

      const items = this.record?.media_items
      if (!Array.isArray(items)) return result

      for (const item of items) {
        let displayUrl = null, largeUrl = null

        if (item.thumbnail && typeof item.thumbnail === 'object') {
          const thumbVal = item.thumbnail.medium || item.thumbnail.large || item.thumbnail.small || null
          if (thumbVal) {
            const medium = toAbsUrl(thumbVal.replace ? thumbVal.replace(/size=\w+/, 'size=medium') : thumbVal)
            largeUrl  = toAbsUrl(thumbVal)
            displayUrl = medium || largeUrl
          }
        } else if (typeof item.thumbnail === 'string' && item.thumbnail) {
          const base = toAbsUrl(item.thumbnail)
          displayUrl = base ? base.replace(/size=\w+/, 'size=medium') : null
          largeUrl = displayUrl
        }

        if (!displayUrl && item.path) {
          displayUrl = toAbsUrl(item.path)
          largeUrl = displayUrl
        }

        if (!displayUrl) continue

        const attachId = (displayUrl.match(/attachment_id=(\d+)/) || [])[1] || null
        const itemIsPdf = isPdfItem(item)

        // Si coincide con la imagen principal, completamos sus datos
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

/* Layout de dos columnas */
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