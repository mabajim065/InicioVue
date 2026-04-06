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
          <img
            v-if="mainImageUrl"
            :src="mainImageUrl"
            :alt="getTitle"
            @click="openLightbox(mainImageUrl)"
            class="main-img"
          />
          <div v-else class="no-image"></div>
        </div>

        <div class="detail-info">
          <h1>{{ getTitle }}</h1>

          <div v-if="getCollections.length" class="collections-list">
            <h3>Colecciones</h3>
            <div class="col-tags">
              <router-link
                v-for="col in getCollections"
                :key="col.id"
                :to="`/collections/${col.id}`"
                class="col-tag"
              >
                {{ col.title }}
              </router-link>
            </div>
          </div>

          <div v-if="getDescription" class="description">
            <h3>Descripción</h3>
            <p>{{ getDescription }}</p>
          </div>

          <div v-if="canonicalRows.length" class="canonical-metadata">
            <table>
              <tr v-for="row in canonicalRows" :key="row.key">
                <td class="meta-key">{{ row.label }}</td>
                <td class="meta-value">{{ row.value }}</td>
              </tr>
            </table>
          </div>

          <div v-if="joinedRows.length" class="metadata">
            <button class="metadata-toggle" @click="metadatosAbiertos = !metadatosAbiertos">
              Metadatos {{ metadatosAbiertos ? '▲' : '▼' }}
            </button>
            <table v-if="metadatosAbiertos">
              <tr v-for="row in joinedRows" :key="row.key">
                <td class="meta-key">{{ row.label }}</td>
                <td class="meta-value">{{ row.value }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div v-if="galleryImages.length > 1" class="gallery-section">
        <h3 class="gallery-title">Imágenes asociadas</h3>
        <div class="gallery-scroll">
          <div
            v-for="(img, i) in galleryImages"
            :key="i"
            class="gallery-item"
            :class="{ active: img.display === activeGalleryUrl }"
            @click="openLightbox(img.large)"
          >
            <img :src="img.display" :alt="`Imagen ${i + 1}`" />
          </div>
        </div>
      </div>

      <div v-if="lightboxUrl" class="lightbox" @click.self="lightboxUrl = null">
        <button class="lightbox-close" @click="lightboxUrl = null">✕</button>
        <img :src="lightboxUrl" :alt="getTitle" />
      </div>
    </template>
  </div>
</template>

<script>
import { getRecordDetail } from '../api/licium.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

// Orden de campos (metadata_fields_order)
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

// Etiquetas en español como fallback si la API no devuelve "label"
const LABEL_FALLBACK = {
  'dcterms:title': 'Título', 'dcterms:creator': 'Creador',
  'dcterms:contributor': 'Colaborador', 'dcterms:subject': 'Materia',
  'dcterms:description': 'Descripción', 'dcterms:abstract': 'Resumen',
  'dcterms:publisher': 'Editorial', 'dcterms:date': 'Fecha',
  'dcterms:created': 'Fecha de creación', 'dcterms:issued': 'Fecha de publicación',
  'dcterms:modified': 'Última modificación', 'dcterms:type': 'Tipo',
  'dcterms:format': 'Formato', 'dcterms:extent': 'Extensión',
  'dcterms:medium': 'Soporte', 'dcterms:identifier': 'Identificador',
  'dcterms:source': 'Fuente', 'dcterms:language': 'Idioma',
  'dcterms:relation': 'Relación', 'dcterms:isPartOf': 'Parte de',
  'dcterms:hasPart': 'Contiene', 'dcterms:coverage': 'Cobertura',
  'dcterms:spatial': 'Lugar', 'dcterms:temporal': 'Período',
  'dcterms:rights': 'Derechos', 'dcterms:license': 'Licencia',
  'dcterms:rightsHolder': 'Titular de derechos', 'dcterms:provenance': 'Procedencia',
  'dcterms:audience': 'Audiencia', 'dcterms:alternative': 'Título alternativo',
  'dc:title': 'Título', 'dc:creator': 'Creador', 'dc:subject': 'Materia',
  'dc:description': 'Descripción', 'dc:publisher': 'Editorial',
  'dc:contributor': 'Colaborador', 'dc:date': 'Fecha', 'dc:type': 'Tipo',
  'dc:format': 'Formato', 'dc:identifier': 'Identificador',
  'dc:source': 'Fuente', 'dc:language': 'Idioma',
  'dc:relation': 'Relación', 'dc:coverage': 'Cobertura', 'dc:rights': 'Derechos',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toAbsUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return API_BASE + (url.startsWith('/') ? url : '/' + url)
}

function forceLargeSize(url) {
  if (!url) return null
  const absUrl = toAbsUrl(url)
  try {
    const u = new URL(absUrl)
    u.searchParams.set('size', 'large')
    return u.toString()
  } catch (e) {
    return absUrl
  }
}

/**
 * Extrae texto legible de un objeto value según su "type".
 * Soporta: literal, authority, resource, y objetos genéricos.
 */
function extractValueText(v) {
  if (v === null || v === undefined) return ''
  if (typeof v !== 'object') return String(v)

  const type = v.type || v['@type'] || ''

  if (type === 'literal' || type === 'xsd:string') {
    return String(v['@value'] ?? v.value ?? '')
  }

  if (type === 'authority' || type === 'resource') {
    if (v.label) {
      if (typeof v.label === 'string') return v.label
      const k = Object.keys(v.label)
      return k.length ? v.label[k[0]] : ''
    }
    return v.uri || v['@id'] || v.id || ''
  }

  // Sin type explícito → intentar extraer valor más probable
  return String(v['@value'] ?? v.value ?? v.label ?? v.uri ?? v['@id'] ?? JSON.stringify(v))
}

/**
 * Parsea un campo de joined_metadata (estructura { label, values: [...] })
 * y devuelve { key, label, value }.
 * La etiqueta viene de la API (fieldData.label), con fallback en LABEL_FALLBACK.
 */
function parseJoinedField(key, fieldData) {
  const lowerKey = key.toLowerCase()
  let label = LABEL_FALLBACK[lowerKey] || key
  let values = []

  if (fieldData && typeof fieldData === 'object' && !Array.isArray(fieldData)) {
    if (fieldData.label) label = fieldData.label
    if (fieldData.values) {
      values = Array.isArray(fieldData.values) ? fieldData.values : [fieldData.values]
    }
  } else if (Array.isArray(fieldData)) {
    values = fieldData
  } else {
    values = [fieldData]
  }

  const value = values.map(extractValueText).filter(Boolean).join(', ')
  return { key: lowerKey, label, value }
}

function applyFieldsOrder(rows) {
  const orderMap = {}
  METADATA_FIELDS_ORDER.forEach((k, i) => { orderMap[k.toLowerCase()] = i })
  return [...rows].sort((a, b) => (orderMap[a.key] ?? 9999) - (orderMap[b.key] ?? 9999))
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default {
  data() {
    return {
      record: null,
      loading: true,
      error: null,
      metadatosAbiertos: false,
      lightboxUrl: null,
      activeGalleryUrl: null,
    }
  },

  computed: {
    mainImageUrl() {
      let thumb = this.record?.thumbnail
      if (!thumb) return null
      if (typeof thumb === 'object') {
        const keys = Object.keys(thumb)
        thumb = keys.length ? thumb[keys[0]] : null
      }
      return forceLargeSize(thumb)
    },

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
        title: typeof col.title === 'string'
          ? col.title
          : col.title?.[Object.keys(col.title)[0]] || 'Colección'
      }))
    },

    // canonical_joined_metadata → siempre visible, misma estructura { label, values }
    canonicalRows() {
      const meta = this.record?.canonical_joined_metadata
      if (!meta || typeof meta !== 'object') return []
      const rows = Object.entries(meta)
        .map(([key, fieldData]) => parseJoinedField(key, fieldData))
        .filter(r => r.value)
      return applyFieldsOrder(rows)
    },

    // joined_metadata → desplegable
    joinedRows() {
      const meta = this.record?.joined_metadata
      if (!meta || typeof meta !== 'object') return []
      const rows = Object.entries(meta)
        .map(([key, fieldData]) => parseJoinedField(key, fieldData))
        .filter(r => r.value)
      return applyFieldsOrder(rows)
    },

    // Galería desde media_items, prefiriendo size=large
    galleryImages() {
      const result = []
      if (this.mainImageUrl) {
        result.push({ display: this.mainImageUrl, large: this.mainImageUrl })
      }

      const items = this.record?.media_items
      if (!Array.isArray(items)) return result

      for (const item of items) {
        let displayUrl = null

        // Preferir large, luego medium, luego small
        if (item.thumbnail && typeof item.thumbnail === 'object') {
          displayUrl = toAbsUrl(item.thumbnail.large || item.thumbnail.medium || item.thumbnail.small || null)
        } else if (typeof item.thumbnail === 'string' && item.thumbnail) {
          displayUrl = toAbsUrl(item.thumbnail)
        } else if (item.path) {
          // Fallback: path del item
          displayUrl = toAbsUrl(item.path)
        }

        if (displayUrl && !result.find(r => r.display === displayUrl)) {
          // Añadir ?size=large si la URL es relativa al servidor
          result.push({ 
            display: displayUrl, 
            large: forceLargeSize(displayUrl) 
          })
        }
      }

      return result
    },
  },

  created() { this.fetchRecord() },

  methods: {
    async fetchRecord() {
      this.loading = true
      this.error = null
      try {
        const id = this.$route.params.id
        const response = await getRecordDetail(id)
        this.record = response.data.data || response.data
        this.$nextTick(() => { this.activeGalleryUrl = this.mainImageUrl })
      } catch (err) {
        console.error('Error cargando record:', err)
        this.error = 'No se pudo cargar el registro.'
      } finally {
        this.loading = false
      }
    },

    openLightbox(url) {
      this.lightboxUrl = url
      this.activeGalleryUrl = url
    },
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
.detail-image .no-image {
  width: 100%; aspect-ratio: 4/3;
  background: var(--no-image-detail-bg);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 4rem; opacity: 0.3;
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

.canonical-metadata { margin-bottom: 1.5rem; }
.canonical-metadata table { width: 100%; border-collapse: collapse; }
.canonical-metadata tr { border-bottom: 1px solid var(--meta-row-border); }
.canonical-metadata td { padding: 0.7rem 0; vertical-align: top; }

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

.meta-key   { color: var(--meta-key-color);   font-size: 0.85rem; width: 35%; font-weight: 500; text-transform: capitalize; }
.meta-value { color: var(--meta-value-color); font-size: 0.85rem; }

.gallery-section { margin-top: 2.5rem; }
.gallery-title { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; }
.gallery-scroll {
  display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.75rem;
  scrollbar-width: thin; scrollbar-color: rgba(255,77,141,0.4) transparent;
}
.gallery-scroll::-webkit-scrollbar { height: 6px; }
.gallery-scroll::-webkit-scrollbar-thumb { background: rgba(255,77,141,0.4); border-radius: 10px; }
.gallery-item {
  flex: 0 0 160px; height: 110px;
  border-radius: 10px; overflow: hidden;
  cursor: pointer; border: 2px solid transparent; transition: all 0.25s;
}
.gallery-item:hover { border-color: rgba(255,133,177,0.5); transform: translateY(-2px); }
.gallery-item.active { border-color: var(--primary-pink); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }

.lightbox {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.88);
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  cursor: zoom-out;
}
.lightbox img { max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
.lightbox-close {
  position: absolute; top: 1.5rem; right: 1.5rem;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; font-size: 1.4rem; width: 42px; height: 42px;
  border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.lightbox-close:hover { background: rgba(255,77,141,0.5); box-shadow: none; transform: none; }

.loading { text-align: center; padding: 4rem 0; color: var(--loading-text); }
.spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--spinner-track); border-top-color: #ff4d8d;
  border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
.error { text-align: center; padding: 3rem; color: var(--primary-pink); }
</style>