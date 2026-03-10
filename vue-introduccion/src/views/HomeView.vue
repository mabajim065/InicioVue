<template>
  <v-container class="mt-10">
    
    <div class="text-center mb-10">
      <h1 class="text-pink-darken-3 mb-2">Nuestro Equipo</h1>
      <p class="text-medium-emphasis">Conoce a los usuarios de nuestra empresa.</p>
    </div>

    <v-row>
      
      <v-col cols="12" sm="6" md="4">
        <UserCard />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <UserCard />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <UserCard />
      </v-col>

    </v-row>
    
  </v-container>
</template>

<script setup>
// Seguimos importando nuestra pieza de Lego exacta de antes
import UserCard from '../components/UserCard.vue'
</script>