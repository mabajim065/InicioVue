<template>
  <div class="media-info">
    <div v-if="description" class="description-block">
      <h3>Descripción</h3>
      <p>{{ description }}</p>
    </div>
    
    <div class="actions">
      <a :href="downloadUrl" target="_blank" download class="btn-download">
        Descargar archivo
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaInfo',
  props: {
    description: String,
    downloadUrl: String
  }
}
</script>

<style scoped>
.media-info {
  width: 100%;
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.description-block h3 {
  color: var(--soft-pink);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.8rem;
}

.description-block p {
  color: var(--text-body);
  line-height: 1.7;
}

.actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
}

.btn-download {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #ff4d8d, #ff85b1);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 77, 141, 0.4);
}
</style>
