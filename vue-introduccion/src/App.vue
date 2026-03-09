<template>
  <v-app>
    <v-app-bar color="teal-darken-3" elevation="2">
      <v-app-bar-title>Mi Proyecto Paso a Paso</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <HomeView />
    </v-main>

  </v-app>
</template>

<script setup>
// importo el archivo creado en la carpeta view
import HomeView from './views/HomeView.vue'
</script>