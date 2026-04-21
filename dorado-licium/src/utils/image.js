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
 * Cambia el parámetro de tamaño ('size' o 's') de una URL de la API por otro
 */
export function getResizedUrl(url, size = 'large') {
  if (!url) return null
  if (typeof url !== 'string') return url
  
  // Manejar tanto 'size=' como 's=' que se usan en diferentes versiones de la API
  const sizePattern = /(size|s)=([a-zA-Z0-9_-]+)/
  
  if (sizePattern.test(url)) {
    return url.replace(sizePattern, `$1=${size}`)
  }
  
  // Si es una URL de thumnbail pero no tiene parámetro de tamaño, se lo añadimos
  if (url.includes('/thumb?') || url.includes('/thumbnail?')) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}size=${size}`
  }
  
  return url
}

/**
 * Obtiene la URL del thumbnail de un objeto buscando el mejor tamaño disponible o forzando uno.
 * @param {Object|String} item - El objeto con propiedad thumbnail o el string de la URL
 * @param {String} size - Tamaño deseado (small, medium, large, original)
 */
export function getThumbnailUrl(item, size = 'medium') {
  if (!item) return null
  
  let thumbVal = null
  
  // 1. Caso: item.thumbnail existe (puede ser objeto o string)
  if (item.thumbnail) {
    const t = item.thumbnail
    if (typeof t === 'object') {
      // Prioridad: el tamaño pedido -> large -> medium -> small -> cualquier string
      thumbVal = t[size] || t.large || t.medium || t.small || Object.values(t).find(v => typeof v === 'string')
    } else {
      thumbVal = t
    }
  }
  
  // 2. Caso: no hay thumbnail pero hay path (en medios)
  if (!thumbVal && item.path) {
    thumbVal = item.path
  }
  
  // 3. Caso: el item mismo es un string
  if (!thumbVal && typeof item === 'string') {
    thumbVal = item
  }

  if (!thumbVal) return null
  
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
