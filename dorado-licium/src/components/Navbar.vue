<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand serif">
        <span class="gold-text">Licium</span>
        <span class="muted-text">Replica</span>
      </router-link>

      <!-- Navigation Links -->
      <div class="nav-wrapper">
        <div class="navbar-links desktop">
          <router-link to="/records" class="nav-link" active-class="active">Records</router-link>
          <router-link to="/collections" class="nav-link" active-class="active">Colecciones</router-link>
          <router-link to="/media" class="nav-link" active-class="active">Multimedia</router-link>
          <router-link to="/buscador" class="nav-link" active-class="active">Buscador</router-link>
        </div>

        <button class="hamburger" @click="menuAbierto = !menuAbierto" aria-label="Menú">
          <span :class="{ open: menuAbierto }"></span>
          <span :class="{ open: menuAbierto }"></span>
          <span :class="{ open: menuAbierto }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ open: menuAbierto }">
      <router-link to="/records" class="mobile-link" @click="menuAbierto = false">Records</router-link>
      <router-link to="/collections" class="mobile-link" @click="menuAbierto = false">Colecciones</router-link>
      <router-link to="/media" class="mobile-link" @click="menuAbierto = false">Multimedia</router-link>
      <router-link to="/buscador" class="mobile-link" @click="menuAbierto = false">Buscador</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuAbierto: false
    }
  },
  watch: {
    $route() {
      this.menuAbierto = false
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: transparent;
  padding: 1rem 2rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.4s ease;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  display: flex;
  gap: 0.5rem;
}

.gold-text {
  color: var(--gold-dark);
}

.muted-text {
  color: var(--text-muted);
  opacity: 0.7;
}

.nav-wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-links.desktop {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  opacity: 0.8;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 1.5px;
  background: var(--gold-medium);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover, .nav-link.active {
  opacity: 1;
  color: var(--gold-dark);
}

.nav-link.active::after {
  width: 60%;
}



/* Hamburguesa */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 1.5px;
  background-color: var(--gold-dark);
}

@media (max-width: 900px) {
  .navbar-links.desktop { display: none; }
  .hamburger { display: flex; }
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  height: 100vh;
  background: white;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  padding: 4rem 2rem;
  gap: 2rem;
  transition: right 0.4s ease;
  box-shadow: -10px 0 30px rgba(0,0,0,0.05);
}

.mobile-menu.open {
  right: 0;
}

.mobile-link {
  font-size: 1.5rem;
  font-family: var(--font-serif);
  color: var(--text-main);
}
</style>