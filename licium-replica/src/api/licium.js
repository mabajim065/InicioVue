import axios from 'axios'


// src/api/licium.js
const api = axios.create({
  // Asegúrate de que termine exactamente en /api/glam
  baseURL: 'https://arcadium.cluster24.libnamic.eu/api/glam' 
})

// ========== RECORDS ==========

/**
 * Obtiene un listado de registros desde la API 
 * @param {number} offset es el punto de inicio 
 * @param {number} limit es la cantidad de resultados por página 
 */
export function getRecords(offset = 0, limit = 24) {
  // Realizamos una petición tipo GET a la ruta /record
  return api.get('/record', {
    // Los 'params' son los filtros que se añaden a la URL 
    params: {
      with_labels: 1,          
      search_all_languages: 1,  
      
      // Filtramos que datos queremos recibir para que la carga sea rápida:
      fields: 'thumbnail,title,author,date,collections.id,collections.title,id',
      
      limit,  
      offset 
    }
  })
}

// ========== DETALLE DE UN RECORD ==========

/**
 * Obtiene toda la información específica de un solo registro mediante su ID.
 * @param {string|number} 
 */
export function getRecordDetail(id) {
  // Realiza una petición GET a la ruta específica del recurso 
  return api.get(`/record/${id}`, {
    params: {
      // with_labels: 1 devuelve los nombres legibles de los campos 
      with_labels: 1,
      
      // fields define qué columnas de la base de datos queremos traer:
      fields: 'id,title,description,canonical_joined_metadata,thumbnail'
    }
  })
}

// ========== COLLECTIONS ==========

// Listado de colecciones con paginación
export function getCollections(offset = 0, limit = 24) {
  return api.get('/collection', {
    params: {
      with_labels: 1,
      fields: 'id,thumbnail,title,description', // Añadimos los campos necesarios
      limit,
      offset
    }
  })
}

// Detalle de una colección específica (ESTO TE FALTABA)
export function getCollectionDetail(id) {
  return api.get(`/collection/${id}`, {
    params: {
      with_labels: 1,
      fields: 'id,title,description,records.id,records.title,records.thumbnail'
    }
  })
}

// ========== DETALLE DE UNA COLECCION ==========
export function getCollectionDetail(id) {
  return api.get(`/collection/${id}`, {
    params: {
      with_labels: 1
    }
  })
}