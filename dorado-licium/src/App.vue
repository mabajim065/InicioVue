<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-container">
    <Navbar />
    <main class="content">
      <router-view />
    </main>
    <Footer />
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
  padding: 100px 2rem 2rem 2rem; /* Space for absolute navbar + global padding */
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .content {
    padding: 90px 1.2rem 2rem 1.2rem;
  }
}

/* Global scrollbar aesthetic */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-marble); }
::-webkit-scrollbar-thumb { background: var(--gold-medium); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--gold-dark); }
</style>