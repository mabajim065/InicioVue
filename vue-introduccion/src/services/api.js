
const API_URL = 'https://api.npoint.io/50fe013c0447be64db70'

// Función para obtener todas las playas
export async function getPlayas() {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error al cargar las playas')
  return await response.json()
}

// Función para obtener una sola playa por su ID
export async function getPlayaById(id) {
  const playas = await getPlayas()
  return playas.find(playa => playa.id === id)
}

// Función para obtener el clima usando Open-Meteo
export async function getClima(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Error al cargar el clima')
  return await response.json()
}