<template>
  <v-container class="mt-8">
    <v-card class="mx-auto pa-4" max-width="500" elevation="2" rounded="xl">
      
      <v-btn icon="mdi-arrow-left" variant="text" color="pink-darken-3" class="mb-2"></v-btn>

      <div class="text-center">
        <v-avatar color="pink-lighten-4" size="90" class="mb-4">
          <v-icon icon="mdi-account-heart" color="pink-darken-3" size="50"></v-icon>
        </v-avatar>
        
        <h2 class="text-pink-darken-4 font-weight-light">Perfil Detallado</h2>
        <p class="text-medium-emphasis">Información completa del usuario</p>
      </div>

      <v-divider class="my-5 border-opacity-50" color="pink-lighten-3"></v-divider>

      <v-list bg-color="transparent">
        <v-list-item prepend-icon="mdi-email-outline" title="contacto@estilo.com" subtitle="Email principal"></v-list-item>
        <v-list-item prepend-icon="mdi-phone-outline" title="+34 600 000 000" subtitle="Teléfono móvil"></v-list-item>
        <v-list-item prepend-icon="mdi-map-marker-outline" title="Madrid, España" subtitle="Ubicación"></v-list-item>
      </v-list>

    </v-card>
  </v-container>
</template>

<script setup>
// Esta es nuestra segunda vista independiente
</script>