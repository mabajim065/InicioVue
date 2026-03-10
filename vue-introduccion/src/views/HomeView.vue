<template>
  <v-container class="text-center mt-10">
    <h1 class="text-pink-darken-3 mb-5">Página de Inicio</h1>
    <p class="mb-8">Aquí debajo voy a poner mi nuevo componente:</p>

    <UserCard />
    
  </v-container>
</template>

<script setup>
import UserCard from '../components/UserCard.vue'
</script>