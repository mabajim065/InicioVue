<template>
  <v-container class="mt-8">
    
    <v-card v-if="playa" class="mx-auto pa-4" max-width="500" elevation="2" rounded="xl">
      <v-btn icon="mdi-arrow-left" variant="text" color="pink-darken-3" class="mb-2" to="/"></v-btn>

      <div class="text-center">
        <v-avatar color="pink-lighten-4" size="90" class="mb-4">
          <v-img v-if="playa.imagen" :src="playa.imagen" cover></v-img>
          <v-icon v-else icon="mdi-umbrella-beach" color="pink-darken-3" size="50"></v-icon>
        </v-avatar>
        
        <h2 class="text-pink-darken-4 font-weight-light">{{ playa.nombre }}</h2>
        <p class="text-medium-emphasis">Información en tiempo real</p>
      </div>

      <v-divider class="my-5 border-opacity-50" color="pink-lighten-3"></v-divider>

      <v-list bg-color="transparent">
        <v-list-item prepend-icon="mdi-map-marker-outline" :title="playa.ubicacion" subtitle="Ubicación"></v-list-item>
        <v-list-item prepend-icon="mdi-grain" :title="'Arena ' + playa.arena" subtitle="Tipo de arena"></v-list-item>
        
        <v-list-item 
          prepend-icon="mdi-thermometer" 
          :title="temperaturaActual !== null ? temperaturaActual + ' °C' : 'Consultando satélite...'" 
          subtitle="Temperatura actual">
        </v-list-item>
      </v-list>
    </v-card>

    <v-card v-else-if="!cargando && !playa" class="mx-auto pa-4 text-center" max-width="500" elevation="2" rounded="xl">
      <v-icon icon="mdi-alert-circle-outline" color="red-darken-2" size="60" class="mb-4"></v-icon>
      <h2 class="text-pink-darken-4 font-weight-light">Playa no encontrada</h2>
      <p class="text-medium-emphasis mb-4">El destino que buscas no existe en nuestra base de datos.</p>
      <v-btn color="pink-darken-3" variant="tonal" rounded="pill" to="/">Volver al inicio</v-btn>
    </v-card>

    <div v-else class="text-center mt-10">
      <v-progress-circular indeterminate color="pink-darken-3" size="60"></v-progress-circular>
      <p class="mt-4 text-pink-darken-3">Conectando con la API...</p>
    </div>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPlayaById, getClima } from '../services/api' 

const route = useRoute()
const playa = ref(null)
const temperaturaActual = ref(null)
const cargando = ref(true)

onMounted(async () => {
  try {
   
    const idUrl = parseInt(route.params.id)
    playa.value = await getPlayaById(idUrl)
    if (playa.value) {
      const datosClima = await getClima(playa.value.lat, playa.value.lng)
      temperaturaActual.value = datosClima.current_weather.temperature
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error)
  } finally {
    cargando.value = false 
  }
})
</script>