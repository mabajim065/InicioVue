<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="year">© 2026 Maria Abascal</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.app-footer {
  width: 100%;
  padding: 3rem 0 1.5rem 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.year {
  font-size: 0.75rem;
  color: var(--text-faint, #a0988e);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
}
</style>
