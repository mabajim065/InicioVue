<template>
  <div class="home">
    <div class="hero">
      <div class="hero-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>
      <div class="hero-content">
        <p class="eyebrow">Replica Licium con Vue</p>
        <h1 class="hero-title">
          <span class="line-1">Licium</span>
          <span class="line-2">Replica</span>
        </h1>
        <p class="hero-desc">
          Réplica del catálogo digital de Granada construida con Vue 3
          y la API real de Arcadium. Explora registros históricos,
          fotografías y colecciones culturales.
        </p>
        <div class="hero-buttons">
          <router-link to="/records" class="btn btn-primary">
            Ver Records <span class="btn-arrow">→</span>
          </router-link>
          <router-link to="/collections" class="btn btn-secondary">
            Ver Colecciones
          </router-link>
        </div>
      </div>
      <div class="hero-badge">
        <div class="badge-inner">
          <span class="badge-num">24+</span>
          <span class="badge-label">registros por página</span>
        </div>
        <div class="badge-inner">
          <span class="badge-num">API</span>
          <span class="badge-label">datos reales</span>
        </div>
      </div>
    </div>

    <section class="about">
      <div class="about-card">
        <span class="about-tag">Sobre el proyecto</span>
        <p>
          Este proyecto replica la interfaz de <strong>Licium Granada</strong>,
          una plataforma de patrimonio digital. Consumiendo su API pública,
          mostramos colecciones y registros con paginación, detalle de cada
          elemento y navegación entre secciones.
        </p>
      </div>
      <div class="about-card">
        <span class="about-tag">Tecnologías</span>
        <p>
          Desarrollado con <strong>Vue 3</strong>, <strong>Vue Router</strong>
          y <strong>Axios</strong>. Los datos provienen de la API REST de
          Arcadium, con soporte para campos multiidioma y thumbnails dinámicos.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default { name: 'Home' }
</script>

<style scoped>
.home { min-height: 80vh; overflow-x: hidden; }

.hero {
  position: relative;
  padding: 5rem 2rem 4rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3rem;
}

.hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }

.blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; }
.blob-1 { width: 500px; height: 500px; background: #ff4d8d; top: -150px; left: -100px; animation: drift 8s ease-in-out infinite alternate; }
.blob-2 { width: 350px; height: 350px; background: #ffadd0; top: 50px; right: -80px; animation: drift 10s ease-in-out infinite alternate-reverse; }
.blob-3 { width: 250px; height: 250px; background: #ff85b1; bottom: -50px; left: 40%; animation: drift 7s ease-in-out infinite alternate; }

@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(30px, 20px) scale(1.08); }
}

.hero-content { position: relative; z-index: 1; max-width: 640px; width: 100%; }

.eyebrow {
  font-size: 0.78rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--soft-pink);
  margin-bottom: 1.2rem;
  opacity: 0.8;
}

.hero-title { display: flex; flex-direction: column; line-height: 1; margin-bottom: 1.5rem; }

/* "Licium" usa variable: blanco en oscuro, color oscuro en claro */
.line-1 {
  font-size: clamp(2.5rem, 10vw, 6.5rem);
  font-weight: 800;
  color: var(--hero-title-color);
  letter-spacing: -3px;
}

/* "Replica" siempre en gradiente rosa, contrasta en ambos fondos */
.line-2 {
  font-size: clamp(2.5rem, 10vw, 6.5rem);
  font-weight: 800;
  letter-spacing: -3px;
  background: linear-gradient(90deg, #ff4d8d, #ffadd0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  color: var(--hero-desc-color);
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #ff4d8d, #ff85b1);
  color: #fff;
  box-shadow: 0 4px 20px rgba(255, 77, 141, 0.35);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255, 77, 141, 0.5); color: #fff; }
.btn-arrow { transition: transform 0.3s; }
.btn-primary:hover .btn-arrow { transform: translateX(4px); }

.btn-secondary {
  background: transparent;
  color: var(--primary-pink);
  border: 1px solid rgba(255, 77, 141, 0.4);
}
.btn-secondary:hover { background: var(--glass-pink); border-color: rgba(255,77,141,0.7); transform: translateY(-2px); color: var(--primary-pink); }

.hero-badge { position: relative; z-index: 1; display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }

.badge-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--badge-bg);
  border: 1px solid var(--badge-border);
  border-radius: 16px;
  padding: 1rem 1.8rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.badge-num { font-size: 1.8rem; font-weight: 800; color: var(--primary-pink); line-height: 1; }
.badge-label { font-size: 0.72rem; color: var(--badge-label-color); text-transform: uppercase; letter-spacing: 1px; margin-top: 0.3rem; }

.about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 0 2rem 4rem;
  max-width: 900px;
  margin: 0 auto;
  box-sizing: border-box;
}

.about-card {
  background: var(--section-card-bg);
  border: 1px solid var(--section-card-border);
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
}

.about-card p { color: var(--text-body); line-height: 1.9; margin: 0; }
.about-tag { display: inline-block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 2px; color: var(--soft-pink); margin-bottom: 0.8rem; opacity: 0.8; }
.about-card strong { color: var(--text-main); font-weight: 600; }

@media (max-width: 600px) {
  .hero { padding: 3rem 1rem 2rem; gap: 2rem; }
  .about { grid-template-columns: 1fr; padding: 0 0 3rem; }
  .hero-desc { font-size: 0.9rem; }
  .btn { width: 100%; justify-content: center; }
  .hero-buttons { width: 100%; flex-direction: column; }
}
</style>