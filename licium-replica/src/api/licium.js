import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

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
  if (collectionId) {
    params['domain'] = JSON.stringify({
      op: 'and',
      children: [{ type: 'condition', field: 'collections', operator: 'in', value: [Number(collectionId)] }]
    })
  }
  return api.get('/record', { params })
}

export function getRecordDetail(id) {
  return api.get(`/record/${id}`, {
    params: {
      with_labels: 1,
      fields: 'id,title,description,canonical_joined_metadata,joined_metadata,thumbnail,collections.id,collections.title,media_items.id,media_items.path,media_items.thumbnail,media_items.title'
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

// trae los medias, de 24 en 24
export function getMedias(offset = 0, limit = 24) {
  return api.get('/media', {
    params: {
      with_labels: 1,
      fields: 'id,thumbnail,title,path,media_type,description',
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
      fields: 'id,title,description,thumbnail,joined_metadata'
    }
  })
}

// busca records — texto y colección van SIEMPRE dentro del domain, nunca como &search=
export function searchRecords({ query = '', collectionId = '', offset = 0, limit = 24 } = {}) {
  const params = {
    with_labels: 1,
    search_all_languages: 1,
    fields: 'thumbnail,title,author,date,collections.id,collections.title,id',
    limit,
    offset
  }

  const children = []
  if (query) children.push({ type: 'text', mode: 'fulltext', value: query })
  if (collectionId) children.push({ type: 'condition', field: 'collections', operator: 'in', value: [Number(collectionId)] })

  if (children.length > 0) {
    params['domain'] = JSON.stringify({ op: 'and', children })
  }

  return api.get('/record', { params })
}

export function getMediaDetail(id) {
  return api.get(`/media/${id}`, {
    params: {
      with_labels: 1,
      fields: 'id,title,description,path,thumbnail,media_type,metadata,joined_metadata,attachment'
    }
  })
}