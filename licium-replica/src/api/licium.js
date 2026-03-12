import axios from 'axios'

const api = axios.create({
  baseURL: 'https://urjc.licium.libnamic.com/api/glam'
})

// ========== RECORDS ==========

/**
 * Obtiene un listado de registros desde la API 
 * @param {number} offset es el punto de inicio (ej: si es 24, empieza a contar desde el 25).
 * @param {number} limit es la cantidad de resultados por página (por defecto trae 24).
 */
export function getRecords(offset = 0, limit = 24) {
  // Realizamos una petición tipo GET a la ruta '/record'
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
