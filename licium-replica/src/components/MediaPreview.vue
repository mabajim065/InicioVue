<template>
  <div class="media-preview" :class="{'is-pdf': isPdf}">
    <!-- PDF -->
    <iframe v-if="isPdf && fileUrl" :src="fileUrl" class="media-pdf" frameborder="0"></iframe>
    
    <!-- Imagen -->
    <img v-else-if="imageUrl && !isPdf" :src="imageUrl" :alt="title" class="media-img" @click="$emit('open-fullscreen')" />
    
    <!-- Fallback -->
    <div v-else class="no-media">
      <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p>Formato no soportado para previsualización</p>
    </div>
    
    <button v-if="imageUrl || fileUrl" class="btn-expand" @click.stop="$emit('open-fullscreen')" title="Ver a pantalla completa">⛶</button>
  </div>
</template>

<script>
export default {
  name: 'MediaPreview',
  props: {
    isPdf: Boolean,
    fileUrl: String,
    imageUrl: String,
    title: String
  }
}
</script>

<style scoped>
.media-preview {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.media-preview:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(255, 77, 141, 0.15);
  border-color: rgba(255, 77, 141, 0.3);
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000; 
  cursor: zoom-in;
}

.media-pdf {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.btn-expand {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0,0,0,0.4);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s, background 0.2s;
  z-index: 10;
}

.media-preview:hover .btn-expand {
  opacity: 1;
}

.btn-expand:hover {
  background: var(--primary-pink);
  transform: scale(1.05);
}

.no-media {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-muted);
}

.no-media .icon-svg {
  width: 64px;
  height: 64px;
  stroke: var(--soft-pink);
  opacity: 0.5;
}
</style>
