<template>
  <div class="pdf-notice-banner">
    <div class="pdf-notice-content">
      <svg class="pdf-notice-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>
      <div class="pdf-notice-text">
        <strong>Documento PDF asociado</strong>
        <p>Este registro contiene o es un documento PDF que puedes previsualizar y descargar.</p>
      </div>
    </div>
    <router-link v-if="mediaId" :to="`/media/${mediaId}`" class="pdf-notice-btn">
      Ir a leer o descargar <span aria-hidden="true">&rarr;</span>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    mediaId: {
      type: [Number, String],
      default: null
    }
  }
}
</script>

<style scoped>
.pdf-notice-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(255, 77, 141, 0.05) 100%);
  border: 1px solid rgba(230, 57, 70, 0.3);
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(230, 57, 70, 0.08);
}

.pdf-notice-content {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.pdf-notice-icon {
  width: 40px;
  height: 40px;
  color: #E63946;
  flex-shrink: 0;
}

.pdf-notice-text strong {
  display: block;
  font-size: 1.1rem;
  color: #E63946;
  margin-bottom: 0.2rem;
}

.pdf-notice-text p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-body);
}

.pdf-notice-btn {
  background: #E63946;
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.6rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.pdf-notice-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 57, 70, 0.3);
}

@media (max-width: 640px) {
  .pdf-notice-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .pdf-notice-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
