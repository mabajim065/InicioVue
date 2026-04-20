<template>
  <div class="loading-state">
    <div class="spinner"></div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    message: { type: String, default: 'Cargando...' }
  }
}
</script>

<style scoped>
.loading-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--loading-text);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--spinner-track);
  border-top-color: var(--primary-pink);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
