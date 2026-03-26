import axios from 'axios'

// conexión con la API
const api = axios.create({
 baseURL: '/api/glam'
})

// trae los records, de 24 en 24
export function getRecords(offset = 0, limit = 24, collectionId = null) {
  const params = {
    with_labels: 1,
    search_all_languages: 1,
    fields: 'thumbnail,title,author,date,collections.id,collections.title,id',
    limit,
    offset
  }
  // si le pasas una colección, filtra por ella usando el parámetro domain
  if (collectionId) {
    params['domain'] = JSON.stringify({
      op: 'and',
      children: [{ type: 'condition', field: 'collections', operator: 'in', value: [Number(collectionId)] }]
    })
  }

  return api.get('/record', { params })
}

// trae todo el detalle de un record concreto
export function getRecordDetail(id) {
  return api.get(`/record/${id}`, {
    params: {
      with_labels: 1,
      fields: 'id,title,description,canonical_joined_metadata,thumbnail,collections.id,collections.title'
    }
  })
}

// trae las colecciones, de 24 en 24
export function getCollections(offset = 0, limit = 24) {
  return api.get('/collection', {
    params: {
      with_labels: 1,
      fields: 'id,thumbnail,title,description',
      limit,
      offset
    }
  })
}

// trae el detalle de una colección concreta
export function getCollectionDetail(id) {
  return api.get(`/collection/${id}`, {
    params: {
      with_labels: 1,
      fields: 'id,title,description,thumbnail,canonical_joined_metadata'
    }
  })
}

// busca records por texto o por colección
export function searchRecords({ query = '', collectionId = '', offset = 0, limit = 24 } = {}) {
  const params = {
    with_labels: 1,
    search_all_languages: 1,
    fields: 'thumbnail,title,author,date,collections.id,collections.title,id',
    limit,
    offset
  }
  // añade el texto de búsqueda si hay
  if (query) params['search'] = query
  // añade el filtro de colección usando domain (soporta múltiples colecciones)
  if (collectionId) {
    params['domain'] = JSON.stringify({
      op: 'and',
      children: [{ type: 'condition', field: 'collections', operator: 'in', value: [Number(collectionId)] }]
    })
  }

  return api.get('/record', { params })
}
