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
            Introduccion a vue practicas 2ºdaw
          </h1>
          <p class="text-white text-h5 font-weight-regular mb-10" style="max-width: 700px; margin-left: auto; margin-right: auto;">
           paso a paso de introduccion a vue.
          </p>
          <v-btn color="white" variant="elevated" rounded="pill" size="x-large" prepend-icon="mdi-rocket-launch" to="/detalles" class="text-pink-darken-4">
            Explorar Destino
          </v-btn>
        </div>
      </v-overlay>
    </v-img>

    <v-container class="mt-12 mb-12">
      <div class="text-center mb-10">
        <h2 class="text-pink-darken-3 text-h4 font-weight-light">Playas Recomendadas</h2>
        <p class="text-medium-emphasis">Mejores playas de Cádiz.</p>
      </div>

      <v-row>
        <v-col cols="12" sm="6" md="4">
          <BeachCard 
            nombre="Playa de Valdelagrana" 
            ubicacion="El Puerto de Santa María" 
            imagen="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=60" 
          />
        </v-col>
        
        <v-col cols="12" sm="6" md="4">
          <BeachCard 
            nombre="Playa de la Muralla" 
            ubicacion="Puerto Sherry" 
            imagen="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=60" 
          />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <BeachCard 
            nombre="Playa de la Barrosa" 
            ubicacion="Chiclana de la Frontera" 
            imagen="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600" 
          />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <BeachCard 
            nombre="Playa de Las Redes" 
            ubicacion="El Puerto de Santa María" 
            imagen="hhttps://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=60" 
          />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <BeachCard 
            nombre="Playa de Bolonia" 
            ubicacion="Tarifa" 
            imagen="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=60" 
          />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <BeachCard 
            nombre="Playa de la Caleta" 
            ubicacion="Cádiz Capital" 
            imagen="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=60" 
          />
        </v-col>
      </v-row>
      
    </v-container>
    
  </v-container>
</template>

<script setup>
import BeachCard from '../components/BeachCard.vue'
</script>