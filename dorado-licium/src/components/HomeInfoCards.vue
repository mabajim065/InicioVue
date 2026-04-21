<template>
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
</template>

<script>
export default {
  name: 'HomeInfoCards'
}
</script>

<style scoped>
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
  .about { grid-template-columns: 1fr; padding: 0 0 3rem; }
}
</style>
