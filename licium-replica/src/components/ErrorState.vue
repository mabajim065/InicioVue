<template>
  <div class="error-state">
    <div class="error-icon" v-if="showIcon">!</div>
    <p class="error-message">{{ message }}</p>
    <button v-if="showBack" @click="$router.back()" class="back-btn">
      ← Volver atrás
    </button>
  </div>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    message: { type: String, default: 'Ha ocurrido un error.' },
    showIcon: { type: Boolean, default: true },
    showBack: { type: Boolean, default: true }
  }
}
</script>

<style scoped>
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--primary-pink);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.error-icon {
  width: 60px;
  height: 60px;
  border: 2px solid var(--primary-pink);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  opacity: 0.8;
}

.error-message {
  font-size: 1.1rem;
  max-width: 400px;
  line-height: 1.5;
}

.back-btn {
  display: inline-block;
  color: var(--soft-pink);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s;
  background: transparent;
  border: 1px solid var(--border-color);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.back-btn:hover {
  color: var(--primary-pink);
  border-color: var(--primary-pink);
  background: rgba(255, 77, 141, 0.05);
}
</style>
