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
:root {
  --primary-pink: #ff4d8d;
  --soft-pink: #ff85b1;
  --hover-pink: #ffadd0;
  --bg-dark: #0f0f1b;
  --card-bg: #1a1a2e;
  --glass-pink: rgba(255, 77, 141, 0.15);
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-dark);
  color: #fff;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-pink);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--soft-pink);
}

h1, h2, h3, h4 {
  color: #fff;
  margin-top: 0;
}

a {
  color: var(--soft-pink);
  text-decoration: none;
  transition: all 0.3s ease;
}

a:hover {
  color: var(--primary-pink);
}

button {
  background-color: var(--primary-pink);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

button:hover {
  background-color: var(--hover-pink);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 77, 141, 0.4);
}

button:disabled {
  background-color: #333;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--soft-pink);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 77, 141, 0.2);
  border-top-color: var(--primary-pink);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>