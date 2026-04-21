<template>
  <div class="home-container">
    <!-- Hero / Top Section -->
    <div class="top-section">
      <div class="hero-text-block">
        <h1 class="main-title">
          <span class="gold-text-gradient">Licium</span>
          <span class="muted-text">Replica</span>
        </h1>
        <p class="description">
          Réplica del catálogo digital de Granada construida con Vue 3 y la API 
          real de Arcadium. Explora registros históricos, fotografías y 
          colecciones culturales.
        </p>
      </div>

      <div class="quick-links">
        <router-link to="/records" class="pill-btn gold-border">
          Ver Records <span class="arrow">→</span>
        </router-link>
        <router-link to="/collections" class="pill-btn gold-border">
          Ver Colecciones
        </router-link>
        <router-link to="/media" class="pill-btn gold-border">
          Ver Multimedia
        </router-link>
      </div>
    </div>

    <!-- Glass Information Card -->
    <div class="glass-card-container">
      <div class="glass-panel main-info-card">
        <!-- Floating Header Badge -->
        <div class="glass-panel header-badge">
          <div class="badge-item">
            <span class="icon">📄</span>
            <div class="badge-content">
              <span class="value">24+</span>
              <span class="label">REGISTROS POR PÁGINA</span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="badge-item">
            <span class="icon">⚙️</span>
            <div class="badge-content">
              <span class="value">API</span>
              <span class="label">DATOS REALES</span>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="card-grid">
          <div class="grid-item thin-border">
            <h3 class="item-title gold-text">SOBRE EL PROYECTO</h3>
            <p class="item-text">
              Este proyecto replica la interfaz de <strong>Licium Granada</strong>, una plataforma de patrimonio digital. 
              Consumiendo su API pública, mostramos colecciones y registros con paginación, detalle de cada elemento y navegación entre secciones.
            </p>
          </div>
          <div class="grid-item thin-border">
            <h3 class="item-title gold-text">TECNOLOGÍAS</h3>
            <p class="item-text">
              Desarrollado con <strong>Vue 3, Vue Router y Axios</strong>. Los datos provienen de la API REST de Arcadium, 
              con soporte para campos multiidioma y thumbnails dinámicos.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Pagination Dots (Aesthetic Only) -->
    <div class="pagination-dots">
      <span class="dot active"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>

    <!-- Ornamental Star -->
    <div class="star-ornament">✦</div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 80px);
  position: relative;
}

/* TOP SECTION */
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 5rem;
  gap: 4rem;
}

.hero-text-block {
  text-align: left;
  max-width: 600px;
}

.main-title {
  display: flex;
  flex-direction: column;
  line-height: 0.9;
  margin: 0 0 1.5rem 0;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  letter-spacing: -2px;
}

.muted-text {
  color: #c9b9a5;
  filter: saturate(0.5);
}

.description {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 480px;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pill-btn {
  padding: 0.8rem 2.5rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  color: var(--text-main);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 220px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pill-btn:hover {
  transform: translateX(10px);
  background: var(--gold-soft);
  border-color: var(--gold-dark);
}

.arrow {
  margin-left: 1rem;
}

/* GLASS CARD SECTION */
.glass-card-container {
  width: 100%;
  max-width: 900px;
  position: relative;
}

.main-info-card {
  padding: 4rem 3rem 3rem;
  border-radius: 24px;
  position: relative;
  border: 1px solid rgba(185, 158, 124, 0.3);
}

.header-badge {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  gap: 2rem;
  align-items: center;
  background: rgba(255,255,255,0.8);
  border: 1px solid rgba(185, 158, 124, 0.4);
  box-shadow: 0 10px 40px rgba(138, 109, 59, 0.1);
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge-item .icon {
  font-size: 1.5rem;
  filter: sepia(1) saturate(0.5) hue-rotate(5deg);
}

.badge-content {
  display: flex;
  flex-direction: column;
}

.badge-content .value {
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--text-main);
  line-height: 1;
}

.badge-content .label {
  font-size: 0.65rem;
  letter-spacing: 1px;
  color: var(--text-muted);
  font-weight: 600;
}

.divider {
  width: 1px;
  height: 40px;
  background: var(--gold-light);
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.grid-item {
  padding: 2rem;
  border: 1px solid rgba(185, 158, 124, 0.15);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
}

.thin-border {
  position: relative;
}

/* Corner details (Aesthetic) */
.thin-border::before {
  content: '⌞';
  position: absolute;
  bottom: 5px;
  left: 5px;
  color: var(--gold-medium);
  font-size: 20px;
}
.thin-border::after {
  content: '⌝';
  position: absolute;
  top: 5px;
  right: 5px;
  color: var(--gold-medium);
  font-size: 20px;
}

.item-title {
  font-size: 0.75rem;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  font-family: var(--font-sans);
  font-weight: 600;
}

.gold-text {
  color: #a68b5a;
}

.item-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-main);
}

/* PAGINATION & DECORATIONS */
.pagination-dots {
  display: flex;
  gap: 0.8rem;
  margin-top: 4rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold-light);
  transition: all 0.3s;
}

.dot.active {
  width: 24px;
  border-radius: 10px;
  background: var(--gold-medium);
}

.star-ornament {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  font-size: 2rem;
  color: #fff;
  text-shadow: 0 0 10px var(--gold-light);
  opacity: 0.8;
}

@media (max-width: 900px) {
  .top-section {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  .hero-text-block {
    text-align: center;
  }
  .main-title {
    align-items: center;
  }
  .card-grid {
    grid-template-columns: 1fr;
  }
  .header-badge {
    width: 90%;
    gap: 1rem;
    padding: 1rem;
  }
}
</style>