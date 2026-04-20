const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

/**
 * Convierte una URL relativa en absoluta usando el API_BASE
 */
export function toAbsUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  const path = url.startsWith('/') ? url : '/' + url
  return `${API_BASE}${path}`
}

/**
 * Cambia el parámetro 'size' de una URL de la API por otro (ej: small -> large)
 */
export function getResizedUrl(url, size = 'large') {
  if (!url) return null
  if (typeof url !== 'string') return url
  if (url.includes('size=')) {
    return url.replace(/size=[a-zA-Z0-9_-]+/, `size=${size}`)
  }
  if (url.includes('/thumb?') && !url.includes('size=')) {
    return `${url}&size=${size}`
  }
  return url
}

/**
 * Obtiene la URL del thumbnail de un objeto buscando el mejor tamaño disponible o forzando uno.
 * @param {Object|String} item - El objeto con propiedad thumbnail o el string de la URL
 * @param {String} size - Tamaño deseado (small, medium, large, original)
 */
export function getThumbnailUrl(item, size = 'medium') {
  const thumb = item?.thumbnail || item
  if (!thumb) return null
  
  let thumbVal = ''
  if (typeof thumb === 'object') {
    thumbVal = thumb[size] || thumb.large || thumb.medium || thumb.small || Object.values(thumb)[0] || null
  } else {
    thumbVal = thumb
  }
  
  const absUrl = toAbsUrl(thumbVal)
  return getResizedUrl(absUrl, size)
}

/**
 * Detecta si un item (media o record con media_items) contiene un PDF
 */
export function isPdf(item) {
  if (!item) return false
  
  const checkMedia = (m) => {
    return (
      m.media_type === 'pdf' ||
      m.media_type === 'application/pdf' ||
      (m.path && m.path.toLowerCase().includes('.pdf')) ||
      (m.file_name && m.file_name.toLowerCase().includes('.pdf')) ||
      (m.title && typeof m.title === 'string' && m.title.toLowerCase().includes('.pdf'))
    )
  }

  if (checkMedia(item)) return true
  if (Array.isArray(item.media_items)) {
    return item.media_items.some(checkMedia)
  }

  return false
}

/**
 * Extrae el ID de adjunto de una URL de la API
 */
export function getAttachmentId(url) {
  if (!url) return null
  const match = url.match(/attachment_id=(\d+)/)
  return match ? match[1] : null
}
