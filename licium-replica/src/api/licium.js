import axios from 'axios'

const api = axios.create({
  baseURL: 'https://arcadium.cluster24.libnamic.eu/api/glam' 
})

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

// SOLO UNA VEZ ESTA FUNCIÓN:
export function getCollectionDetail(id) {
  return api.get(`/collection/${id}`, {
    params: {
      with_labels: 1,
      fields: 'id,title,description,records.id,records.title,records.thumbnail'
    }
  })
}