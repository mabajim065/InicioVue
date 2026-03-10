<template>
  <v-app>
    
    <v-navigation-drawer v-model="drawer" color="pink-lighten-5" temporary>
      <v-list-item title="Mi Perfil" subtitle="Usuario " class="py-4"></v-list-item>
      <v-divider color="pink-lighten-3"></v-divider>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-heart" title="Inicio" to="/" color="pink-darken-3"></v-list-item>
        <v-list-item prepend-icon="mdi-account-details" title="Ver Detalles" to="/detalles" color="pink-darken-3"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="pink-lighten-4" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="pink-darken-4"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-pink-darken-4 font-weight-light">Proyecto de Introducción</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
      <slot></slot>
    </v-main>
    
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false) // Controla si el menú está abierto o cerrado
</script>