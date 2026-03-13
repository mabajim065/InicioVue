<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="app-container">
    <Navbar />
    
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Estilos globales básicos */
body {
  margin: 0;
  padding: 0;
  background-color: #0f0f1b; /* Color oscuro a juego con tu diseño */
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}
</style>