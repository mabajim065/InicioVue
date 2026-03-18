<template>
  <nav class="navbar">
    <div class="navbar-container">

   
      <router-link to="/" class="navbar-brand">
        Licium Replica
      </router-link>

      <!-- Links de navegación principal -->
      <div class="navbar-links">
        <router-link to="/record" class="nav-link" active-class="active">
          Records
        </router-link>
        <router-link to="/collections" class="nav-link" active-class="active">
          Colecciones
        </router-link>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar { background: linear-gradient(135deg, #1a1a2e, #2a1a2e); padding: 0 2rem; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255, 77, 141, 0.15); }
.navbar-container { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; }
.navbar-brand { color: #fff; font-size: 1.4rem; font-weight: 700; text-decoration: none; letter-spacing: 1px; }
.navbar-links { display: flex; gap: 1.5rem; }
.nav-link { color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.3s ease; }
.nav-link:hover, .nav-link.active { color: #ff85b1; background: rgba(255, 77, 141, 0.1); }
</style>