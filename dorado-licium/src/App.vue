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
/* 1. VARIABLES GLOBALES DE COLOR (Modo Oscuro por defecto) */
:root {
  /* Colores de marca (se mantienen igual en ambos modos) */
  --primary-pink: #ff4d8d;
  --soft-pink: #ff85b1;
  --hover-pink: #ffadd0;
  
  /* Colores de estructura (Modo Oscuro) */
  --bg-color: #0f0f1b;
  --card-bg: #1a1a2e;
  --text-main: #ffffff;
  --text-muted: rgba(255, 255, 255, 0.6);
  --border-color: rgba(255, 255, 255, 0.05);
  --glass-pink: rgba(255, 77, 141, 0.15);
  --image-placeholder-bg: #12121f;
  --disabled-bg: #2a2a3d;
  --disabled-color: rgba(255, 255, 255, 0.5);

  /* Inputs y formularios */
  --input-bg: #1a1a2e;
  --input-color: #ffffff;
  --input-placeholder: rgba(255, 255, 255, 0.3);
  --select-option-bg: #1a1a2e;

  /* Paginación */
  --page-btn-bg: #1a1a2e;
  --page-btn-color: #ffffff;

  /* Spinner */
  --spinner-track: rgba(255, 255, 255, 0.1);

  /* Texto en secciones */
  --text-body: rgba(255, 255, 255, 0.7);
  --text-subtle: rgba(255, 255, 255, 0.5);
  --text-faint: rgba(255, 255, 255, 0.4);

  /* Metadatos de tarjetas — contraste garantizado sobre fondo oscuro */
  --card-author-color: #e8a0c0;   /* rosa claro saturado, ~5.2:1 sobre #1a1a2e */
  --card-date-color: #b0b0c8;     /* gris lila claro, ~4.6:1 sobre #1a1a2e */
  --results-count-color: #c8c8e0; /* gris azulado claro, legible */

  /* Metadatos */
  --meta-key-color: rgba(255, 133, 177, 0.7);
  --meta-value-color: rgba(255, 255, 255, 0.8);
  --meta-row-border: rgba(255, 77, 141, 0.08);

  /* Tarjetas about/sección */
  --section-card-bg: rgba(255, 255, 255, 0.03);
  --section-card-border: rgba(255, 133, 177, 0.1);

  /* Badge hero */
  --badge-bg: rgba(255, 255, 255, 0.04);
  --badge-border: rgba(255, 133, 177, 0.15);

  /* Estado vacío / loading */
  --empty-color: rgba(255, 133, 177, 0.4);
  --loading-text: rgba(255, 255, 255, 0.6);

  /* No-image en detail */
  --no-image-detail-bg: #1a1a2e;

  /* Hero: texto blanco sobre fondo oscuro */
  --hero-title-color: #ffffff;
  --hero-desc-color: rgba(255, 255, 255, 0.55);
  --badge-label-color: rgba(255, 255, 255, 0.4);

  /* Heading gradient oscuro: blanco → rosa */
  --heading-gradient: linear-gradient(to right, #ffffff, var(--soft-pink));
}

/* 2. VARIABLES MODO CLARO (Sobrescriben las anteriores cuando se activa) */
[data-theme="light"] {
  --bg-color: #f4f4f9;
  --card-bg: #ffffff;
  --text-main: #1a1a2e;
  --text-muted: rgba(26, 26, 46, 0.65);
  --border-color: rgba(0, 0, 0, 0.08);
  --glass-pink: rgba(255, 77, 141, 0.08);
  --image-placeholder-bg: #e8e8f0;
  --disabled-bg: #d0d0dd;
  --disabled-color: rgba(26, 26, 46, 0.4);

  /* Inputs y formularios */
  --input-bg: #ffffff;
  --input-color: #1a1a2e;
  --input-placeholder: rgba(26, 26, 46, 0.35);
  --select-option-bg: #ffffff;

  /* Paginación */
  --page-btn-bg: #ffffff;
  --page-btn-color: #1a1a2e;

  /* Spinner */
  --spinner-track: rgba(0, 0, 0, 0.08);

  /* Texto en secciones */
  --text-body: rgba(26, 26, 46, 0.75);
  --text-subtle: rgba(26, 26, 46, 0.55);
  --text-faint: rgba(26, 26, 46, 0.45);

  /* Metadatos de tarjetas — contraste garantizado sobre fondo blanco */
  --card-author-color: #c0155a;   /* rosa oscuro, ~4.8:1 sobre #ffffff */
  --card-date-color: #555570;     /* gris azulado oscuro, ~5.8:1 sobre #ffffff */
  --results-count-color: #3a3a5c; /* casi negro-azulado, muy legible */

  /* Metadatos */
  --meta-key-color: var(--primary-pink);
  --meta-value-color: rgba(26, 26, 46, 0.8);
  --meta-row-border: rgba(255, 77, 141, 0.1);

  /* Tarjetas about/sección */
  --section-card-bg: #ffffff;
  --section-card-border: rgba(255, 77, 141, 0.15);

  /* Badge hero */
  --badge-bg: rgba(255, 255, 255, 0.7);
  --badge-border: rgba(255, 77, 141, 0.2);

  /* Estado vacío / loading */
  --empty-color: rgba(255, 77, 141, 0.5);
  --loading-text: rgba(26, 26, 46, 0.5);

  /* No-image en detail */
  --no-image-detail-bg: #e8e8f0;

  /* Hero: texto oscuro sobre fondo claro */
  --hero-title-color: #1a1a2e;
  --hero-desc-color: rgba(26, 26, 46, 0.65);
  --badge-label-color: rgba(26, 26, 46, 0.5);

  /* Heading gradient claro: oscuro → rosa */
  --heading-gradient: linear-gradient(to right, #1a1a2e, var(--primary-pink));
}

#app {
  max-width: none;
  margin: 0;
  padding: 0;
  text-align: left;
}

/* Reset global para evitar scroll horizontal */
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  /* Aplicamos las variables en lugar de colores fijos */
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  width: 100%;
  /* Transición suave al cambiar de tema */
  transition: background-color 0.4s ease, color 0.4s ease;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
}

.content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

/* Scrollbar personalizado */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-color); }
::-webkit-scrollbar-thumb { background: var(--primary-pink); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--soft-pink); }

h1, h2, h3, h4 { 
  color: var(--text-main); 
  margin-top: 0; 
  transition: color 0.4s ease; 
}

a { 
  color: var(--soft-pink); 
  text-decoration: none; 
  transition: all 0.3s ease; 
}

a:hover { 
  color: var(--primary-pink); 
}

/* Accesibilidad para navegación por teclado en enlaces */
a:focus-visible {
  outline: 2px dashed var(--soft-pink);
  outline-offset: 4px;
  border-radius: 4px;
}

button {
  background-color: var(--primary-pink);
  color: #ffffff;
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

/* Contraste mejorado para el botón deshabilitado */
button:disabled { 
  background-color: var(--disabled-bg); 
  color: var(--disabled-color);
  cursor: not-allowed; 
  transform: none; 
  box-shadow: none; 
}

/* Accesibilidad para navegación por teclado en botones */
button:focus-visible {
  outline: 3px solid var(--soft-pink);
  outline-offset: 3px;
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
  width: 40px; height: 40px;
  border: 3px solid rgba(255, 77, 141, 0.2);
  border-top-color: var(--primary-pink);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .content { padding: 1rem; }
}
</style>