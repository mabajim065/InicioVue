<template>
  <v-container class="mt-8">
    <v-card class="mx-auto pa-4" max-width="500" elevation="2" rounded="xl">
      
      <v-btn icon="mdi-arrow-left" variant="text" color="pink-darken-3" class="mb-2" to="/"></v-btn>

      <div class="text-center">
        <v-avatar color="pink-lighten-4" size="90" class="mb-4">
          <v-icon icon="mdi-umbrella-beach" color="pink-darken-3" size="50"></v-icon>
        </v-avatar>
        
        <h2 class="text-pink-darken-4 font-weight-light">Playa de Las Redes</h2>
        <p class="text-medium-emphasis">Información del destino costero</p>
      </div>

      <v-divider class="my-5 border-opacity-50" color="pink-lighten-3"></v-divider>

      <v-list bg-color="transparent">
        <v-list-item prepend-icon="mdi-water" title="Oleaje Moderado" subtitle="Estado del mar ideal para el baño"></v-list-item>
        <v-list-item prepend-icon="mdi-grain" title="Arena Fina y Dorada" subtitle="Tipo de arena"></v-list-item>
        <v-list-item prepend-icon="mdi-map-marker-outline" title="El Puerto de Santa María, Cádiz" subtitle="Ubicación"></v-list-item>
      </v-list>

    </v-card>
  </v-container>
</template>

<script setup>
// Vista de detalles de la playa de Las Redes
</script>