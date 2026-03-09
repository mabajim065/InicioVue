<template>
  <v-container class="text-center mt-10">
    <h1 class="text-teal-darken-3">Página de Inicio</h1>
    <p>Ahora pongo la nueva tarjeta.</p>

    <UserCard />
  </v-container>
</template>

<script setup>
// importo la tarjeta de Usuario 
import UserCard from '../components/UserCard.vue'
</script>