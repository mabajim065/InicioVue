<template>
  <nav class="navbar">
    <div class="navbar-container">

      <router-link to="/" class="navbar-brand">Licium Replica</router-link>

      <!-- Botón hamburguesa  -->
      <button class="hamburger" @click="menuAbierto = !menuAbierto" aria-label="Menú">
        <span :class="{ open: menuAbierto }"></span>
        <span :class="{ open: menuAbierto }"></span>
        <span :class="{ open: menuAbierto }"></span>
      </button>

      <!-- Links escritorio -->
      <div class="navbar-links desktop">
        <router-link to="/record" class="nav-link" active-class="active">Records</router-link>
        <router-link to="/collections" class="nav-link" active-class="active">Colecciones</router-link>
        <router-link to="/buscador" class="nav-link" active-class="active">Buscador</router-link>
      </div>

    </div>

    <!-- Menú desplegable móvil -->
    <div class="mobile-menu" :class="{ open: menuAbierto }">
      <router-link to="/record" class="mobile-link" active-class="active" @click="menuAbierto = false">Records</router-link>
      <router-link to="/collections" class="mobile-link" active-class="active" @click="menuAbierto = false">Colecciones</router-link>
      <router-link to="/buscador" class="mobile-link" active-class="active" @click="menuAbierto = false">Buscador</router-link>
    </div>

  </nav>
</template>

<script>
export default {
  data() {
    return {
      // Controla si el menú móvil está abierto o cerrado
      menuAbierto: false
    }
  },
  watch: {
    // Cierra el menú al cambiar de página
    $route() {
      this.menuAbierto = false
    }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1a1a2e, #2a1a2e);
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255, 77, 141, 0.15);
  width: 100%;
  box-sizing: border-box;
}
.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.navbar-brand {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}
.navbar-links.desktop {
  display: flex;
  gap: 0.5rem;
}
.nav-link {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.nav-link:hover, .nav-link.active {
  color: #ff85b1;
  background: rgba(255, 77, 141, 0.1);
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
.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
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
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(255, 77, 141, 0.1);
  transition: color 0.3s;
}
.mobile-link:hover, .mobile-link.active { color: #ff85b1; }
@media (max-width: 600px) {
  .hamburger { display: flex; }
  .navbar-links.desktop { display: none; }
}
</style>