<template>
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
</template>

<script>
export default {
  name: 'HomeQuickAccess'
}
</script>

<style scoped>
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
</style>
