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
      
      <!-- Aviso de que es un PDF (arriba) -->
      <div v-if="hasPdf" class="pdf-notice-banner">
        <div class="pdf-notice-content">
          <svg class="pdf-notice-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <div class="pdf-notice-text">
            <strong>Documento PDF asociado</strong>
            <p>Este registro contiene o es un documento PDF que puedes previsualizar y descargar.</p>
          </div>
        </div>
        <router-link v-if="pdfMediaId" :to="`/media/${pdfMediaId}`" class="pdf-notice-btn">
          Ir a leer o descargar <span aria-hidden="true">&rarr;</span>
        </router-link>
      </div>

      <div class="detail-layout">

        <!-- Columna izquierda: imagen principal (oculta en móvil si no hay imagen) -->
        <div class="detail-image" :class="{ 'no-image-col': !mainImageUrl }">
          <template v-if="mainImageUrl">
            <div style="position: relative; display: inline-block; width: 100%;">
              <img
                :src="mainImageUrl"
                :alt="getTitle"
                @click="openLightbox(0)"
                class="main-img"
              />
              <span v-if="galleryImages[0] && galleryImages[0].isPdf" class="media-type-chip main-chip">PDF</span>
            </div>
            <div class="main-media-link-container">
              <router-link 
                v-if="galleryImages[0] && galleryImages[0].id" 
                :to="`/media/${galleryImages[0].id}`" 
                class="view-media-link"
              >
                {{ galleryImages[0].isPdf ? 'Ver documento PDF' : 'Ver detalles del medio principal' }}
              </router-link>
            </div>
          </template>
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
                  <span class="meta-values-list">
                    <span v-for="(v, i) in row.values" :key="i" class="meta-value-item">
                      <span v-if="i > 0" class="meta-sep"> · </span>
                      <span v-if="v.type === 'literal'" class="mv-literal">{{ v.text }}</span>
                      <a v-else-if="v.type === 'uri'" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-uri">{{ v.text }}</a>
                      <template v-else-if="v.type === 'resource'">
                        <router-link v-if="v.routerTo" :to="v.routerTo" class="mv-link mv-resource">{{ v.text }}</router-link>
                        <a v-else-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-resource">{{ v.text }}</a>
                        <span v-else class="mv-resource no-href">{{ v.text }}</span>
                      </template>
                      <span v-else-if="v.type === 'authority'" class="mv-authority">
                        <a v-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link">{{ v.text }}</a>
                        <span v-else>{{ v.text }}</span>
                        <span v-for="b in v.badges" :key="b" class="mv-badge">{{ b }}</span>
                      </span>
                      <span v-else-if="v.type === 'vocabulary'" class="mv-vocabulary">
                        <a v-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-vocab-link">{{ v.text }}</a>
                        <span v-else>{{ v.text }}</span>
                      </span>
                      <span v-else>{{ v.text }}</span>
                    </span>
                  </span>
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
                  <span class="meta-values-list">
                    <span v-for="(v, i) in row.values" :key="i" class="meta-value-item">
                      <span v-if="i > 0" class="meta-sep"> · </span>
                      <span v-if="v.type === 'literal'" class="mv-literal">{{ v.text }}</span>
                      <a v-else-if="v.type === 'uri'" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-uri">{{ v.text }}</a>
                      <template v-else-if="v.type === 'resource'">
                        <router-link v-if="v.routerTo" :to="v.routerTo" class="mv-link mv-resource">{{ v.text }}</router-link>
                        <a v-else-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-resource">{{ v.text }}</a>
                        <span v-else class="mv-resource no-href">{{ v.text }}</span>
                      </template>
                      <span v-else-if="v.type === 'authority'" class="mv-authority">
                        <a v-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link">{{ v.text }}</a>
                        <span v-else>{{ v.text }}</span>
                        <span v-for="b in v.badges" :key="b" class="mv-badge">{{ b }}</span>
                      </span>
                      <span v-else-if="v.type === 'vocabulary'" class="mv-vocabulary">
                        <a v-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-vocab-link">{{ v.text }}</a>
                        <span v-else>{{ v.text }}</span>
                      </span>
                      <span v-else>{{ v.text }}</span>
                    </span>
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Galería media_items -->
      <div v-if="galleryImages.length > 1" class="gallery-section">
        <h3 class="gallery-title">Imágenes asociadas</h3>
        <div class="gallery-scroll">
          <div
            v-for="(img, i) in galleryImages"
            :key="i"
            class="gallery-item-wrapper"
          >
            <div
              class="gallery-item"
              :class="{ active: i === lightboxIndex }"
              @click="openLightbox(i)"
            >
              <img :src="img.display" :alt="`Imagen ${i + 1}`" />
              <span v-if="img.isPdf" class="media-type-chip">PDF</span>
            </div>
            <router-link v-if="img.id" :to="`/media/${img.id}`" class="view-media-link">
              {{ img.isPdf ? 'Ver documento PDF' : 'Ver detalles del medio' }}
            </router-link>
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

//Helpers 

function toAbsUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return API_BASE + (url.startsWith('/') ? url : '/' + url)
}


function parseValueObject(v) {
  if (v === null || v === undefined) return null
  if (typeof v !== 'object') return { type: 'literal', text: String(v), href: null }

  // La API puede usar 'type' para indicar el tipo del valor
  const rawType = v.type || v['@type'] || ''
  const type = rawType.toLowerCase()

  // literal / xsd:* 
  if (type === 'literal' || type.startsWith('xsd:')) {
    const text = String(v['@value'] ?? v.value ?? '')
    return { type: 'literal', text, href: null }
  }

  // uri
  if (type === 'uri') {
    const href = v.uri || v['@id'] || v.value || ''
    let text = ''
    if (v.label) {
      text = typeof v.label === 'string' ? v.label : (Object.values(v.label)[0] || '')
    }
    if (!text) text = href
    return { type: 'uri', text, href }
  }

  // resource
  if (type === 'resource') {
    const id = v.id ?? null
    const model = v.model || ''
    let routerTo = null
    let href = v.uri || v['@id'] || null

    if (model === 'glam.record' && id !== null) {
      routerTo = `/records/${id}`
    } else if (model === 'glam.collection' && id !== null) {
      routerTo = `/collections/${id}`
    } else if (model === 'glam.media' && id !== null) {
      routerTo = `/media/${id}`
    }

    let text = ''
    if (v.label) {
      text = typeof v.label === 'string' ? v.label : Object.values(v.label)[0] || ''
    }
    if (!text) text = routerTo || href || ''
    return { type: 'resource', text, href, routerTo }
  }

  // authority 
  if (type === 'authority') {
    let text = ''
    if (v.label) {
      text = typeof v.label === 'string' ? v.label : Object.values(v.label)[0] || ''
    }
    if (!text) text = v.uri || v['@id'] || ''
    const badges = Array.isArray(v.entity_types) ? v.entity_types : []
    const desc = v.canonical_data?.description || null
    return { type: 'authority', text, href: v.uri || null, badges, desc }
  }

  // vocabulary 
  if (type === 'vocabulary' || type === 'skos:concept') {
    let text = ''
    if (v.label) {
      text = typeof v.label === 'string' ? v.label : Object.values(v.label)[0] || ''
    }
    if (!text) text = v['@value'] || v.value || ''
    return { type: 'vocabulary', text, href: v.uri || v['@id'] || null }
  }

  // fallback genérico 
  const text = String(v['@value'] ?? v.value ?? v.label ?? v.uri ?? v['@id'] ?? '')
  return { type: 'literal', text, href: null }
}


function parseJoinedField(key, fieldData) {
  // La clave real a buscar en LABEL_FALLBACK: si hay 'term' se usa, si no, usa la propia key
  const termKey = fieldData?.term || key
  // El label viene de la API si es genérico usa el fallback
  const apiLabel = typeof fieldData?.label === 'string' ? fieldData.label : ''
  // Es trivial si está vacío, coincide con la clave, o es un identificador sin traducción humana (no contiene ':' ni espacios)
  const isTrivialLabel = !apiLabel || apiLabel === key || apiLabel === termKey || (!apiLabel.includes(':') && !apiLabel.includes(' '))
  const label = isTrivialLabel
    ? (LABEL_FALLBACK[termKey] || LABEL_FALLBACK[key] || apiLabel || key)
    : apiLabel
  const rawValues = Array.isArray(fieldData?.values) ? fieldData.values : []
  const values = rawValues.map(parseValueObject).filter(v => v && v.text)
  return { key, label, values }
}

function applyFieldsOrder(rows) {
  const orderMap = {}
  METADATA_FIELDS_ORDER.forEach((k, i) => { orderMap[k] = i })
  return [...rows].sort((a, b) => (orderMap[a.key] ?? 9999) - (orderMap[b.key] ?? 9999))
}

// Componente principal
export default {

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
      // Normalizamos la clave usando el 'term' de la API para el orden correcto
      const rows = Object.entries(meta).map(([key, fd]) => {
        const sortKey = fd?.term || key
        const row = parseJoinedField(sortKey, fd)
        return row
      }).filter(r => r.values.length)
      return applyFieldsOrder(rows)
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

    hasPdf() {
      if (!this.record?.media_items) return false;
      return this.record.media_items.some(item => item.media_type === 'pdf' || (item.path && item.path.includes('.pdf')));
    },

    pdfMediaId() {
      if (!this.record?.media_items) return null;
      const pdfItem = this.record.media_items.find(item => item.media_type === 'pdf' || (item.path && item.path.includes('.pdf')));
      return pdfItem ? pdfItem.id : null;
    },

    // Galería thumbnail principal + media_items
    galleryImages() {
      const result = []

      // 1. Añadimos primero el main image si existe para que siempre sea el index 0
      const mainAttachId = this.mainImageUrl
        ? (this.mainImageUrl.match(/attachment_id=(\d+)/) || [])[1] || null
        : null

      if (this.mainImageUrl) {
        const mainMedium = mainAttachId
          ? toAbsUrl(`/api/core/attachment/action_get/thumb?attachment_id=${mainAttachId}&size=medium`)
          : this.mainImageUrl
        result.push({ 
          display: mainMedium, 
          large: this.mainImageUrl, // guardamos el grande original
          isPdf: false, // se actualizará en el loop si está en media_items
          id: null,
          attachId: mainAttachId
        })
      }

      // 2. Procesamos media_items
      const items = this.record?.media_items
      if (!Array.isArray(items)) return result

      for (const item of items) {
        let displayUrl = null, largeUrl = null

        if (item.thumbnail && typeof item.thumbnail === 'object') {
          const thumbVal = item.thumbnail.medium || item.thumbnail.large || item.thumbnail.small || null
          largeUrl = toAbsUrl(thumbVal)
          displayUrl = largeUrl
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
        const isPdf = item.media_type === 'pdf' || (item.path && item.path.includes('.pdf'))

        // Verificamos si este item es el mismo que el principal
        if (result.length > 0 && ((attachId && attachId === result[0].attachId) || (!attachId && displayUrl === result[0].display))) {
          // Actualizamos la información del principal si este media item tiene más datos
          result[0].id = item.id
          result[0].isPdf = isPdf
          continue
        }

        // Si no es el principal, y no está ya añadido, lo metemos en result
        const alreadyAdded = attachId
          ? result.some(r => r.attachId === attachId)
          : result.some(r => r.display === displayUrl)

        if (!alreadyAdded) {
          result.push({ 
            id: item.id, 
            display: displayUrl, 
            large: largeUrl || displayUrl,
            isPdf: isPdf,
            attachId: attachId
          })
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

/* Aviso PDF Superior */
.pdf-notice-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(255, 77, 141, 0.05) 100%);
  border: 1px solid rgba(230, 57, 70, 0.3);
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(230, 57, 70, 0.08);
}

.pdf-notice-content {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.pdf-notice-icon {
  width: 40px;
  height: 40px;
  color: #E63946;
  flex-shrink: 0;
}

.pdf-notice-text strong {
  display: block;
  font-size: 1.1rem;
  color: #E63946;
  margin-bottom: 0.2rem;
}

.pdf-notice-text p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-body);
}

.pdf-notice-btn {
  background: #E63946;
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.6rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.pdf-notice-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 57, 70, 0.3);
}

@media (max-width: 640px) {
  .pdf-notice-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .pdf-notice-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Layout */
.detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }

/* Sin imagen oculto la columna en móvil/tablet */
@media (max-width: 768px) {
  .detail-layout { grid-template-columns: 1fr; }
  .detail-image.no-image-col { display: none; }
}

/* Imagen principal */
.detail-image img { width: 100%; border-radius: 12px; box-shadow: 0 8px 30px rgba(255,77,141,0.1); }
/* cursor zoom-in al pasar, zoom-out solo dentro del lightbox */
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

/* Estilos de valores tipados */
.meta-values-list { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: baseline; }
.meta-sep { color: var(--text-faint); }

.mv-literal { color: var(--meta-value-color); }

/* URI y Resource */
.mv-link {
  color: var(--primary-pink); text-decoration: underline;
  text-underline-offset: 2px; transition: color 0.2s;
  word-break: break-all;
}
.mv-link:hover { color: var(--soft-pink); }
.mv-link.no-href { cursor: default; text-decoration: none; color: var(--meta-value-color); }

/* Authority */
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
.gallery-item-wrapper {
  flex: 0 0 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}
.gallery-item {
  width: 100%; height: 110px; border-radius: 10px; overflow: hidden;
  position: relative;
  cursor: pointer; border: 2px solid transparent; transition: all 0.25s;
}
.gallery-item:hover { border-color: rgba(255,133,177,0.5); transform: translateY(-2px); }
.gallery-item.active { border-color: var(--primary-pink); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.media-type-chip {
  position: absolute; 
  top: 12px; 
  left: -8px; 
  background: #E63946;
  color: white; 
  font-size: 0.75rem; 
  font-weight: 800; 
  padding: 4px 12px;
  border-radius: 4px; 
  letter-spacing: 1px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
  pointer-events: none;
  transform: rotate(-4deg);
  z-index: 5;
  border: 1px solid rgba(255,255,255,0.3);
}
.view-media-link {
  font-size: 0.8rem;
  color: var(--primary-pink);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  text-align: center;
  padding: 0.2rem;
}
.view-media-link:hover {
  color: var(--soft-pink);
  text-decoration: underline;
}
.main-media-link-container {
  margin-top: 1rem;
  text-align: center;
}
.main-chip {
  top: 25px;
  left: -15px;
  font-size: 1.2rem;
  padding: 8px 26px;
  box-shadow: 0 6px 15px rgba(230, 57, 70, 0.4);
}

/* Lightbox */
.lightbox {
  position: fixed; inset: 0; background: rgba(0,0,0,0.92);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
  /* cursor normal sobre el fondo, zoom-out solo al pasar sobre la imagen */
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

/* Botones anterior/siguiente */
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

/* Responsive Metadatos */
@media (max-width: 768px) {
  /* Convertir las tablas en bloques apilados */
  .canonical-metadata table, .canonical-metadata tbody, .canonical-metadata tr, .canonical-metadata td,
  .metadata table, .metadata tbody, .metadata tr, .metadata td {
    display: block;
    width: 100%;
  }
  
  .canonical-metadata tr, .metadata tr {
    padding: 0.75rem 0;
  }
  
  .canonical-metadata td, .metadata td {
    padding: 0;
  }

  .meta-key {
    width: 100%;
    margin-bottom: 0.3rem;
    color: var(--soft-pink); /* Un color un poco más destacado arriba */
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .meta-value {
    width: 100%;
    font-size: 0.95rem; /* Un poco más grande para leer mejor */
  }

  .meta-values-list {
    gap: 0.4rem;
  }
}
</style>