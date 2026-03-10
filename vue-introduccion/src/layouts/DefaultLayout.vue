<template>
  <v-app>
    <v-app-bar color="pink-lighten-4" elevation="1">
      <v-app-bar-title class="text-pink-darken-4 font-weight-light">
        Proyecto de Introduccion Prácticas 2ºDAW 
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script setup>
</script>