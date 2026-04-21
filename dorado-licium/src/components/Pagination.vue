<template>
  <div v-if="totalPages > 1" class="pagination">
    <button class="page-btn" :disabled="currentPage <= 1" @click="$emit('page-change', currentPage - 1)">
      ← Anterior
    </button>
    <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
    <button class="page-btn" :disabled="currentPage >= totalPages" @click="$emit('page-change', currentPage + 1)">
      Siguiente →
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: { type: Number, required: true },
    totalPages:  { type: Number, required: true }
  },
  emits: ['page-change']
}
</script>

<style scoped>
.pagination { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: 2rem; padding: 1rem 0; }

.page-btn {
  background: var(--page-btn-bg);
  color: var(--page-btn-color);
  border: 1px solid rgba(255, 77, 141, 0.2);
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}
.page-btn:hover:not(:disabled) {
  background: rgba(255, 77, 141, 0.1);
  border-color: rgba(255, 77, 141, 0.5);
  color: var(--primary-pink);
}
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.page-info { color: var(--text-subtle); font-size: 0.9rem; }
</style>