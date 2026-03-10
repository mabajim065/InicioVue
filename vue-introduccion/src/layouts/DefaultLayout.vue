<template>
  <v-app>
    
    <v-navigation-drawer v-model="drawer" color="pink-lighten-5" temporary>
      <v-list-item title="Guía de Playas" subtitle="Explorador Costero" class="py-4">
        <template v-slot:prepend>
          <v-avatar color="pink-lighten-4">
            <v-icon icon="mdi-sunglasses" color="pink-darken-3"></v-icon>
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider color="pink-lighten-3"></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-heart" title="Inicio" to="/" color="pink-darken-3"></v-list-item>
        <v-list-item prepend-icon="mdi-beach" title="Ver Detalles" to="/detalles" color="pink-darken-3"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="pink-lighten-4" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="pink-darken-4"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-pink-darken-4 font-weight-light">Rutas Costeras de Cádiz</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
      <slot></slot>
    </v-main>

    <v-footer app color="pink-lighten-4" class="text-center d-flex flex-column py-3" elevation="2">
      <div class="text-pink-darken-4 mt-1">
        {{ new Date().getFullYear() }} — <strong>Guía de Playas</strong>
      </div>
      <div class="text-caption text-pink-darken-3 mt-1 mb-1">
        Introduccion paso a paso de Vue y Vuetify 
      </div>
    </v-footer>
    
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>