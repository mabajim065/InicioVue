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

        <!-- Columna izquierda: imagen principal (oculta en móvil si no hay imagen) -->
        <div class="detail-image" :class="{ 'no-image-col': !mainImageUrl }">
          <img
            v-if="mainImageUrl"
            :src="mainImageUrl"
            :alt="getTitle"
            @click="openLightbox(0)"
            class="main-img"
          />
          <!-- Sin imagen: solo se muestra en desktop -->
          <div v-else class="no-image">🖼</div>
        </div>

        <!-- Columna derecha: info + metadatos -->
        <div class="detail-info">
          <h1>{{ getTitle }}</h1>

          <!-- Colecciones -->
          <div v-if="getCollections.length" class="collections-list">
            <h3>Colecciones</h3>
            <div class="col-tags">
              <router-link
                v-for="col in getCollections"
                :key="col.id"
                :to="`/collections/${col.id}`"
                class="col-tag"
              >{{ col.title }}</router-link>
            </div>
          </div>

          <!-- Descripción -->
          <div v-if="getDescription" class="description">
            <h3>Descripción</h3>
            <p>{{ getDescription }}</p>
          </div>

          <!-- Metadatos canónicos: siempre visibles -->
          <div v-if="canonicalRows.length" class="canonical-metadata">
            <table>
              <tr v-for="row in canonicalRows" :key="row.key">
                <td class="meta-key">{{ row.label }}</td>
                <td class="meta-value">
                  <MetaValues :values="row.values" />
                </td>
              </tr>
            </table>
          </div>

          <!-- joined_metadata: desplegable -->
          <div v-if="joinedRows.length" class="metadata">
            <button class="metadata-toggle" @click="metadatosAbiertos = !metadatosAbiertos">
              Metadatos {{ metadatosAbiertos ? '▲' : '▼' }}
            </button>
            <table v-if="metadatosAbiertos">
              <tr v-for="row in joinedRows" :key="row.key">
                <td class="meta-key">{{ row.label }}</td>
                <td class="meta-value">
                  <MetaValues :values="row.values" />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Galería (media_items) -->
      <div v-if="galleryImages.length > 1" class="gallery-section">
        <h3 class="gallery-title">Imágenes asociadas</h3>
        <div class="gallery-scroll">
          <div
            v-for="(img, i) in galleryImages"
            :key="i"
            class="gallery-item"
            :class="{ active: i === lightboxIndex }"
            @click="openLightbox(i)"
          >
            <img :src="img.display" :alt="`Imagen ${i + 1}`" />
          </div>
        </div>
      </div>

      <!-- Lightbox con navegación prev/next -->
      <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">✕</button>
        <!-- Anterior -->
        <button
          v-if="galleryImages.length > 1"
          class="lightbox-nav lightbox-prev"
          @click.stop="prevImage"
        >‹</button>
        <!-- Imagen -->
        <img :src="currentLightboxUrl" :alt="getTitle" @click.stop />
        <!-- Siguiente -->
        <button
          v-if="galleryImages.length > 1"
          class="lightbox-nav lightbox-next"
          @click.stop="nextImage"
        >›</button>
        <!-- Contador -->
        <div v-if="galleryImages.length > 1" class="lightbox-counter">
          {{ lightboxIndex + 1 }} / {{ galleryImages.length }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getRecordDetail } from '../api/licium.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

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

// ─── Helpers ──────

function toAbsUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return API_BASE + (url.startsWith('/') ? url : '/' + url)
}


function parseValueObject(v) {
  if (v === null || v === undefined) return null
  if (typeof v !== 'object') return { type: 'literal', text: String(v), href: null }

  const type = (v.type || v['@type'] || '').toLowerCase()

  // ── literal ─────
  if (type === 'literal' || type === 'xsd:string') {
    return { type: 'literal', text: String(v['@value'] ?? v.value ?? ''), href: null }
  }

  // ── uri ──────
  if (type === 'uri') {
    const href = v.uri || v['@id'] || v.value || ''
    return { type: 'uri', text: href, href }
  }

  // ── resource ─────
  if (type === 'resource') {
    const href = v.uri || v['@id'] || v.id || null
    let text = ''
    if (v.label) {
      text = typeof v.label === 'string' ? v.label : Object.values(v.label)[0] || ''
    }
    if (!text) text = href || ''
    return { type: 'resource', text, href }
  }

  // ── authority ─────
  if (type === 'authority') {
    let text = ''
    if (v.label) {
      text = typeof v.label === 'string' ? v.label : Object.values(v.label)[0] || ''
    }
    if (!text) text = v.uri || v['@id'] || ''
    // entity_types para el badge (ej: "person", "place")
    const badges = Array.isArray(v.entity_types) ? v.entity_types : []
    // descripción canónica si viene
    const desc = v.canonical_data?.description || null
    return { type: 'authority', text, href: v.uri || null, badges, desc }
  }

  // ── vocabulary ──────
  if (type === 'vocabulary' || type === 'skos:concept') {
    let text = ''
    if (v.label) {
      text = typeof v.label === 'string' ? v.label : Object.values(v.label)[0] || ''
    }
    if (!text) text = v['@value'] || v.value || ''
    return { type: 'vocabulary', text, href: v.uri || v['@id'] || null }
  }

  // ── fallback genérico ─────
  const text = String(v['@value'] ?? v.value ?? v.label ?? v.uri ?? v['@id'] ?? '')
  return { type: 'literal', text, href: null }
}

/**
 * Parsea un campo de joined/canonical_metadata y devuelve
 * { key, label, values: [parseValueObject, ...] }
 */
function parseJoinedField(key, fieldData) {
  const label = (typeof fieldData?.label === 'string' && fieldData.label)
    || LABEL_FALLBACK[key] || key
  const rawValues = Array.isArray(fieldData?.values) ? fieldData.values : []
  const values = rawValues.map(parseValueObject).filter(v => v && v.text)
  return { key, label, values }
}

function applyFieldsOrder(rows) {
  const orderMap = {}
  METADATA_FIELDS_ORDER.forEach((k, i) => { orderMap[k] = i })
  return [...rows].sort((a, b) => (orderMap[a.key] ?? 9999) - (orderMap[b.key] ?? 9999))
}

// ─── Subcomponente MetaValues ──
// Renderiza la lista de values enriquecidos para una fila de metadatos.
const MetaValues = {
  name: 'MetaValues',
  props: { values: Array },
  template: `
    <span class="meta-values-list">
      <span v-for="(v, i) in values" :key="i" class="meta-value-item">
        <span v-if="i > 0" class="meta-sep"> · </span>

        <!-- literal -->
        <span v-if="v.type === 'literal'" class="mv-literal">{{ v.text }}</span>

        <!-- uri: enlace -->
        <a v-else-if="v.type === 'uri'"
           :href="v.href" target="_blank" rel="noopener"
           class="mv-link mv-uri">{{ v.text }}</a>

        <!-- resource: enlace con label -->
        <a v-else-if="v.type === 'resource'"
           :href="v.href || undefined" target="_blank" rel="noopener"
           :class="['mv-link', 'mv-resource', !v.href && 'no-href']">{{ v.text }}</a>

        <!-- authority: nombre + badges -->
        <span v-else-if="v.type === 'authority'" class="mv-authority">
          <a v-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link">{{ v.text }}</a>
          <span v-else>{{ v.text }}</span>
          <span v-for="b in v.badges" :key="b" class="mv-badge">{{ b }}</span>
        </span>

        <!-- vocabulary -->
        <span v-else-if="v.type === 'vocabulary'" class="mv-vocabulary">
          <a v-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-vocab-link">{{ v.text }}</a>
          <span v-else>{{ v.text }}</span>
        </span>

        <!-- fallback -->
        <span v-else>{{ v.text }}</span>
      </span>
    </span>
  `
}

// ─── Componente principal ────────
export default {
  components: { MetaValues },

  data() {
    return {
      record: null,
      loading: true,
      error: null,
      metadatosAbiertos: false,
      lightboxOpen: false,
      lightboxIndex: 0,
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
      return toAbsUrl(thumb)
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

    canonicalRows() {
      const meta = this.record?.canonical_joined_metadata
      if (!meta || typeof meta !== 'object') return []
      return applyFieldsOrder(
        Object.entries(meta)
          .map(([key, fd]) => parseJoinedField(key, fd))
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

    // Galería: thumbnail principal + media_items
    galleryImages() {
      const result = []
      if (this.mainImageUrl) {
        result.push({ display: this.mainImageUrl, large: this.mainImageUrl })
      }
      const items = this.record?.media_items
      if (!Array.isArray(items)) return result

      for (const item of items) {
        let displayUrl = null, largeUrl = null

        if (item.thumbnail && typeof item.thumbnail === 'object') {
          largeUrl = toAbsUrl(item.thumbnail.large || item.thumbnail.medium || item.thumbnail.small || null)
          displayUrl = largeUrl
        } else if (typeof item.thumbnail === 'string' && item.thumbnail) {
          const base = toAbsUrl(item.thumbnail)
          largeUrl = base ? base.replace(/(\?.*)?$/, '?size=large') : null
          displayUrl = largeUrl || base
        }
        if (!displayUrl && item.path) {
          displayUrl = toAbsUrl(item.path)
          largeUrl = displayUrl
        }
        if (displayUrl && !result.find(r => r.display === displayUrl)) {
          result.push({ display: displayUrl, large: largeUrl || displayUrl })
        }
      }
      return result
    },

    currentLightboxUrl() {
      return this.galleryImages[this.lightboxIndex]?.large || null
    },
  },

  created() { this.fetchRecord() },

  mounted() {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown)
  },

  methods: {
    async fetchRecord() {
      this.loading = true; this.error = null
      try {
        const id = this.$route.params.id
        const response = await getRecordDetail(id)
        this.record = response.data.data || response.data
      } catch (err) {
        console.error('Error cargando record:', err)
        this.error = 'No se pudo cargar el registro.'
      } finally {
        this.loading = false
      }
    },

    openLightbox(index) {
      this.lightboxIndex = index
      this.lightboxOpen = true
      document.body.style.overflow = 'hidden'
    },

    closeLightbox() {
      this.lightboxOpen = false
      document.body.style.overflow = ''
    },

    prevImage() {
      this.lightboxIndex = (this.lightboxIndex - 1 + this.galleryImages.length) % this.galleryImages.length
    },

    nextImage() {
      this.lightboxIndex = (this.lightboxIndex + 1) % this.galleryImages.length
    },

    onKeydown(e) {
      if (!this.lightboxOpen) return
      if (e.key === 'Escape') this.closeLightbox()
      if (e.key === 'ArrowLeft') this.prevImage()
      if (e.key === 'ArrowRight') this.nextImage()
    },
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

/* Layout */
.detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }

/* FIX 1: Sin imagen → ocultar columna en móvil/tablet */
@media (max-width: 768px) {
  .detail-layout { grid-template-columns: 1fr; }
  .detail-image.no-image-col { display: none; }
}

/* Imagen principal */
.detail-image img { width: 100%; border-radius: 12px; box-shadow: 0 8px 30px rgba(255,77,141,0.1); }
/* FIX 3: cursor zoom-in al pasar, zoom-out solo dentro del lightbox */
.detail-image .main-img { cursor: zoom-in; transition: transform 0.2s; }
.detail-image .main-img:hover { transform: scale(1.01); }
.detail-image .no-image {
  width: 100%; aspect-ratio: 4/3; background: var(--no-image-detail-bg);
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  font-size: 4rem; opacity: 0.3;
}

.detail-info h1 { font-size: 1.8rem; color: var(--text-main); margin-bottom: 1.5rem; line-height: 1.3; }

.collections-list { margin-bottom: 1.5rem; }
.collections-list h3 { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.6rem; }
.col-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.col-tag {
  background: var(--glass-pink); border: 1px solid rgba(255,133,177,0.3);
  color: var(--primary-pink); padding: 0.3rem 0.8rem; border-radius: 50px;
  font-size: 0.8rem; text-decoration: none; transition: all 0.3s;
}
.col-tag:hover { background: rgba(255,77,141,0.15); color: var(--primary-pink); }

.description { margin-bottom: 2rem; }
.description h3 { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; }
.description p { color: var(--text-body); line-height: 1.7; }

/* Metadatos canónicos */
.canonical-metadata { margin-bottom: 1.5rem; }
.canonical-metadata table { width: 100%; border-collapse: collapse; }
.canonical-metadata tr { border-bottom: 1px solid var(--meta-row-border); }
.canonical-metadata td { padding: 0.7rem 0; vertical-align: top; }

/* Metadatos técnicos */
.metadata { margin-top: 1.5rem; }
.metadata-toggle {
  background: var(--glass-pink); border: 1px solid rgba(255,133,177,0.2);
  color: var(--primary-pink); padding: 0.5rem 1.2rem; border-radius: 8px;
  cursor: pointer; font-size: 0.85rem; font-weight: 500; margin-bottom: 1rem;
  transition: all 0.3s; box-shadow: none;
}
.metadata-toggle:hover { background: rgba(255,77,141,0.15); transform: none; box-shadow: none; }
.metadata table { width: 100%; border-collapse: collapse; }
.metadata tr { border-bottom: 1px solid var(--meta-row-border); }
.metadata td { padding: 0.7rem 0; vertical-align: top; }

.meta-key { color: var(--meta-key-color); font-size: 0.85rem; width: 35%; font-weight: 500; }
.meta-value { color: var(--meta-value-color); font-size: 0.85rem; }

/* ── Estilos de valores tipados (MetaValues) ── */
.meta-values-list { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: baseline; }
.meta-sep { color: var(--text-faint); }

.mv-literal { color: var(--meta-value-color); }

/* URI y Resource → enlace */
.mv-link {
  color: var(--primary-pink); text-decoration: underline;
  text-underline-offset: 2px; transition: color 0.2s;
  word-break: break-all;
}
.mv-link:hover { color: var(--soft-pink); }
.mv-link.no-href { cursor: default; text-decoration: none; color: var(--meta-value-color); }

/* Authority → nombre + badges */
.mv-authority { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.3rem; }
.mv-badge {
  display: inline-block; font-size: 0.7rem; padding: 0.1rem 0.45rem;
  border-radius: 50px; background: var(--glass-pink);
  border: 1px solid rgba(255,133,177,0.3); color: var(--soft-pink);
  font-weight: 500; text-transform: capitalize;
}

/* Vocabulary */
.mv-vocabulary { color: var(--meta-value-color); }
.mv-vocab-link { color: var(--soft-pink); }

/* Galería */
.gallery-section { margin-top: 2.5rem; }
.gallery-title { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; }
.gallery-scroll {
  display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.75rem;
  scrollbar-width: thin; scrollbar-color: rgba(255,77,141,0.4) transparent;
}
.gallery-scroll::-webkit-scrollbar { height: 6px; }
.gallery-scroll::-webkit-scrollbar-thumb { background: rgba(255,77,141,0.4); border-radius: 10px; }
.gallery-item {
  flex: 0 0 160px; height: 110px; border-radius: 10px; overflow: hidden;
  cursor: pointer; border: 2px solid transparent; transition: all 0.25s;
}
.gallery-item:hover { border-color: rgba(255,133,177,0.5); transform: translateY(-2px); }
.gallery-item.active { border-color: var(--primary-pink); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }

/* ── Lightbox con navegación ── */
.lightbox {
  position: fixed; inset: 0; background: rgba(0,0,0,0.92);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
  /* FIX 3: cursor normal sobre el fondo, zoom-out solo al pasar sobre la imagen */
  cursor: default;
}
/* La imagen dentro sí muestra zoom-out */
.lightbox img {
  max-width: 80vw; max-height: 85vh; object-fit: contain;
  border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  cursor: zoom-out; user-select: none;
}

.lightbox-close {
  position: absolute; top: 1.5rem; right: 1.5rem;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; font-size: 1.4rem; width: 42px; height: 42px;
  border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; z-index: 1;
}
.lightbox-close:hover { background: rgba(255,77,141,0.5); box-shadow: none; transform: none; }

/* FIX 2: Botones anterior/siguiente */
.lightbox-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; font-size: 2.5rem; width: 52px; height: 52px;
  border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; z-index: 1; line-height: 1;
  padding-bottom: 2px;
}
.lightbox-nav:hover { background: rgba(255,77,141,0.5); box-shadow: none; transform: translateY(-50%); }
.lightbox-prev { left: 1.5rem; }
.lightbox-next { right: 1.5rem; }

/* Contador de imágenes */
.lightbox-counter {
  position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.7); font-size: 0.85rem;
  background: rgba(0,0,0,0.4); padding: 0.3rem 0.8rem; border-radius: 20px;
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