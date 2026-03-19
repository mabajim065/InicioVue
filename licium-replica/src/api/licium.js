import axios from 'axios'


const api = axios.create({
  baseURL: '/api/glam'
})

// Obtiene el listado de records con paginación
export function getRecords(offset = 0, limit = 24) {
  return api.get('/record', {
    params: {
      with_labels: 1,
      search_all_languages: 1,
      fields: 'thumbnail,title,author,date,collections.id,collections.title,id',
      limit,
      offset
    }
  })
}

export function getRecordDetail(id) {
  return api.get(`/record/${id}`, {
    params: {
      with_labels: 1,
      fields: 'id,title,description,canonical_joined_metadata,thumbnail'
    }
  })
}

// Obtiene el listado de colecciones con paginación
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

// Obtiene el detalle de una colección con sus records
export function getCollectionDetail(id) {
  return api.get(`/collection/${id}`, {
    params: {
      with_labels: 1,
      fields: 'id,title,description,records.id,records.title,records.thumbnail'
    }
  })
}
// busca los records
export function searchRecords({ query = '', field = 'title', offset = 0, limit = 24 } = {}) {
  const params = {
    with_labels: 1,
    search_all_languages: 1,
    fields: 'thumbnail,title,author,date,collections.id,collections.title,id',
    limit,
    offset
  }
 
  // añade el filtro de busqueda 
  if (query) {
    if (field === 'title') params['search[title]'] = query
    else if (field === 'author') params['search[author]'] = query
    else if (field === 'date') params['search[date]'] = query
    else if (field === 'collection') params['search[collections.title]'] = query
    else params['search[title]'] = query
  }
 
  return api.get('/record', { params })
}