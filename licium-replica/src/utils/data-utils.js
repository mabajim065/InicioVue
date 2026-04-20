/**
 * Extrae texto de un campo multilingüe (objeto con claves de idioma)
 * o devuelve el string si ya lo es.
 */
export function extractMultilingual(field, fallback = '') {
  if (!field) return fallback
  if (typeof field === 'string') return field
  if (typeof field === 'object') {
    const keys = Object.keys(field)
    return keys.length > 0 ? field[keys[0]] : fallback
  }
  return fallback
}

/**
 * Obtiene el título de un registro, colección o media
 */
export function getTitle(item) {
  return extractMultilingual(item?.title, 'Sin título')
}

/**
 * Obtiene la descripción de un registro, colección o media
 */
export function getDescription(item) {
  return extractMultilingual(item?.description, '')
}

// ─── Metadatos ───────────────────────────────────────────────────────────────

export const METADATA_FIELDS_ORDER = [
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

export const LABEL_FALLBACK = {
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

export function parseValueObject(v) {
  if (v === null || v === undefined) return null
  if (typeof v !== 'object') return { type: 'literal', text: String(v), href: null }

  const rawType = v.type || v['@type'] || ''
  const type = rawType.toLowerCase()

  if (type === 'literal' || type.startsWith('xsd:')) {
    return { type: 'literal', text: String(v['@value'] ?? v.value ?? ''), href: null }
  }

  if (type === 'uri') {
    const href = v.uri || v['@id'] || v.value || ''
    let text = extractMultilingual(v.label, '')
    return { type: 'uri', text: text || href, href }
  }

  if (type === 'resource') {
    const id = v.id ?? null
    const model = v.model || ''
    let routerTo = null
    const href = v.uri || v['@id'] || null
    
    if (model === 'glam.record' && id !== null) routerTo = `/records/${id}`
    else if (model === 'glam.collection' && id !== null) routerTo = `/collections/${id}`
    else if (model === 'glam.media' && id !== null) routerTo = `/media/${id}`
    
    let text = extractMultilingual(v.label, '')
    if (!text) text = routerTo || href || ''
    return { type: 'resource', text, href, routerTo }
  }

  if (type === 'authority') {
    let text = extractMultilingual(v.label, '')
    if (!text) text = v.uri || v['@id'] || ''
    const badges = Array.isArray(v.entity_types) ? v.entity_types : []
    return { type: 'authority', text, href: v.uri || null, badges, desc: v.canonical_data?.description || null }
  }

  if (type === 'vocabulary' || type === 'skos:concept') {
    let text = extractMultilingual(v.label, '')
    if (!text) text = v['@value'] || v.value || ''
    return { type: 'vocabulary', text, href: v.uri || v['@id'] || null }
  }

  return { type: 'literal', text: String(v['@value'] ?? v.value ?? v.label ?? v.uri ?? v['@id'] ?? ''), href: null }
}

export function parseJoinedField(key, fieldData) {
  const termKey = fieldData?.term || key
  const apiLabel = typeof fieldData?.label === 'string' ? fieldData.label : ''
  const isTrivialLabel = !apiLabel || apiLabel === key || apiLabel === termKey || (!apiLabel.includes(':') && !apiLabel.includes(' '))
  const label = isTrivialLabel ? (LABEL_FALLBACK[termKey] || LABEL_FALLBACK[key] || apiLabel || key) : apiLabel
  
  const values = (Array.isArray(fieldData?.values) ? fieldData.values : [])
    .map(parseValueObject)
    .filter(v => v && v.text)
    
  return { key, label, values }
}

export function applyFieldsOrder(rows) {
  const orderMap = {}
  METADATA_FIELDS_ORDER.forEach((k, i) => { orderMap[k] = i })
  return [...rows].sort((a, b) => (orderMap[a.key] ?? 9999) - (orderMap[b.key] ?? 9999))
}
