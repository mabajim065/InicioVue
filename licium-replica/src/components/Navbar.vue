<template>
  <nav class="navbar">
    <div class="navbar-container">

      <router-link to="/" class="navbar-brand">Licium Replica</router-link>

      <div class="nav-actions">
        
        <div class="navbar-links desktop">
          <router-link to="/records" class="nav-link" active-class="active">Records</router-link>
          <router-link to="/collections" class="nav-link" active-class="active">Colecciones</router-link>
          <router-link to="/media" class="nav-link" active-class="active">Multimedia</router-link>
          <router-link to="/buscador" class="nav-link" active-class="active">Buscador</router-link>
        </div>

        <button 
          class="theme-toggle" 
          @click="toggleTheme" 
          :aria-label="isLightMode ? 'Activar modo oscuro' : 'Activar modo claro'"
        >
          <span v-if="isLightMode">☀️</span>
          <span v-else>🌙</span>
        </button>

        <button class="hamburger" @click="menuAbierto = !menuAbierto" aria-label="Menú">
          <span :class="{ open: menuAbierto }"></span>
          <span :class="{ open: menuAbierto }"></span>
          <span :class="{ open: menuAbierto }"></span>
        </button>

      </div>
    </div>

    <div class="mobile-menu" :class="{ open: menuAbierto }">
      <router-link to="/records" class="mobile-link" active-class="active" @click="menuAbierto = false">Records</router-link>
      <router-link to="/collections" class="mobile-link" active-class="active" @click="menuAbierto = false">Colecciones</router-link>
      <router-link to="/media" class="mobile-link" active-class="active" @click="menuAbierto = false">Multimedia</router-link>
      <router-link to="/buscador" class="mobile-link" active-class="active" @click="menuAbierto = false">Buscador</router-link>
    </div>

  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuAbierto: false,
      isLightMode: false // Estado inicial del tema
    }
  },
  
  // Al montar el componente, miramos si el usuario ya tenía el modo claro guardado
  mounted() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      this.isLightMode = true
      document.documentElement.setAttribute('data-theme', 'light')
    }
  },

  watch: {
    // Cierra el menú al cambiar de página
    $route() {
      this.menuAbierto = false
    }
  },

  methods: {
    // Función para alternar entre claro y oscuro
    toggleTheme() {
      this.isLightMode = !this.isLightMode
      const theme = this.isLightMode ? 'light' : 'dark'
      
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }
  }
}
</script>

<style scoped>
/* Usamos var(--card-bg) para que cambie de oscuro a blanco según el tema */
.navbar {
  background-color: var(--card-bg);
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-bottom: 1px solid var(--border-color);
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.4s ease, border-color 0.4s ease;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px; /* Un pelín más alto para acomodar los botones holgadamente */
}

.navbar-brand {
  color: var(--text-main);
  font-size: 1.15rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  letter-spacing: -0.5px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-links.desktop {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-pink);
  background: var(--glass-pink);
}

/* Estilos del nuevo botón de tema */
.theme-toggle {
  background: transparent;
  border: 1px solid var(--border-color);
  font-size: 1.1rem;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  transition: all 0.3s ease;
  box-shadow: none;
}

.theme-toggle:hover {
  background: var(--glass-pink);
  transform: rotate(15deg) scale(1.05);
  border-color: var(--soft-pink);
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  box-shadow: none;
}

/* La hamburguesa usa var(--text-main) para verse en modo claro (negra) y oscuro (blanca) */
.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--text-main);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger span:nth-child(1).open { transform: translateY(7px) rotate(45deg); }
.hamburger span:nth-child(2).open { opacity: 0; }
.hamburger span:nth-child(3).open { transform: translateY(-7px) rotate(-45deg); }

.mobile-menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mobile-menu.open { max-height: 250px; }

.mobile-link {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--border-color);
  transition: color 0.3s;
}

.mobile-link:hover, .mobile-link.active { 
  color: var(--primary-pink); 
}

@media (max-width: 600px) {
  .hamburger { display: flex; }
  .navbar-links.desktop { display: none; }
}
</style>