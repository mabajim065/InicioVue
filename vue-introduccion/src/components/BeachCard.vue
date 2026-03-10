<template>
  <v-card class="mx-auto" max-width="350" variant="elevated" elevation="3" rounded="xl">
    <v-img :src="imagen" height="200" cover></v-img>
    
    <v-card-item class="pt-4 text-center">
      <v-card-title class="font-weight-regular text-pink-darken-4 text-h6">
        {{ nombre }}
      </v-card-title>
      <v-card-subtitle class="mt-1">
        <v-icon icon="mdi-map-marker-outline" size="small" class="mr-1" color="pink-darken-3"></v-icon>
        {{ ubicacion }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-actions class="justify-center pb-5">
      <v-btn color="pink-darken-3" variant="tonal" rounded="pill" block class="mx-4" to="/detalles">
        Info
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  nombre: String,
  ubicacion: String,
  imagen: String
})
</script>