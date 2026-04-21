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
/* Reset and global layout foundations */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
  background-color: var(--bg-marble);
  color: var(--text-main);
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  width: 100%;
  padding-top: 80px; /* Space for absolute navbar */
}

/* Global scrollbar aesthetic */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-marble); }
::-webkit-scrollbar-thumb { background: var(--gold-medium); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--gold-dark); }
</style>