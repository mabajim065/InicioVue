<template>
  <v-container fluid class="pa-0">
    
    <v-img
      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073"
      cover
      height="60vh"
      class="align-center"
    >
      <v-overlay scrim="pink-darken-4" opacity="0.4" contained class="align-center justify-center">
        <div class="text-center pa-10">
          <v-icon icon="mdi-palm-tree" color="white" size="70" class="mb-4"></v-icon>
          <h1 class="text-white text-h2 font-weight-light mb-4">
            Introducción a Vue Prácticas 2º DAW
          </h1>
          <p class="text-white text-h5 font-weight-regular mb-10" style="max-width: 700px; margin-left: auto; margin-right: auto;">
           Paso a paso de introducción a Vue.
          </p>
          <v-btn color="white" variant="elevated" rounded="pill" size="x-large" prepend-icon="mdi-rocket-launch" to="/detalles/1" class="text-pink-darken-4">
            Explorar Destino
          </v-btn>
        </div>
      </v-overlay>
    </v-img>

    <v-container class="mt-12 mb-12">
      <div class="text-center mb-10">
        <h2 class="text-pink-darken-3 text-h4 font-weight-light">Playas Recomendadas</h2>
        <p class="text-medium-emphasis">Mejores playas de Cádiz (Cargadas desde la API).</p>
      </div>

      <div v-if="cargando" class="text-center mt-10">
        <v-progress-circular indeterminate color="pink-darken-3" size="50"></v-progress-circular>
      </div>

      <v-row v-else>
        <v-col cols="12" sm="6" md="4" v-for="playa in playas" :key="playa.id">
          <BeachCard 
            :id="playa.id"
            :nombre="playa.nombre" 
            :ubicacion="playa.ubicacion" 
            :imagen="playa.imagen" 
          />
        </v-col>
      </v-row>

    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BeachCard from '../components/BeachCard.vue'
import { getPlayas } from '../services/api' // Importamos tu servicio de la API

// Variables reactivas
const playas = ref([])
const cargando = ref(true)

// onMounted se ejecuta nada más abrir la página
onMounted(async () => {
  try {
    // Llamamos a tu API y guardamos el resultado en la variable 'playas'
    playas.value = await getPlayas()
  } catch (error) {
    console.error('Error al cargar las playas:', error)
  } finally {
    // Ocultamos el spinner de carga
    cargando.value = false
  }
})
</script>