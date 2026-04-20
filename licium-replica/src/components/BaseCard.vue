<template>
  <router-link :to="to" class="base-card" :class="{ 'has-hover': hoverEffect }">
    
    <!-- Slot for absolute positioned elements (like the PDF badge in RecordCard) -->
    <slot name="badge"></slot>

    <div class="card-image-wrapper" :style="wrapperStyle">
      <img
        v-if="imageUrl && !imageFailed"
        :src="imageUrl"
        :alt="title"
        class="card-image"
        @error="handleError"
      />
      <div v-else class="no-image">
        <slot name="no-image">
          <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="no-image-text">{{ placeholderText }}</span>
        </slot>
      </div>
      
      <!-- Slot for overlays on the image (like the media type badge) -->
      <slot name="image-overlay"></slot>
    </div>

    <div class="card-content">
      <h3 v-if="title" class="card-title">{{ title }}</h3>
      <slot name="content"></slot>
    </div>

  </router-link>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    to: { type: String, required: true },
    imageUrl: { type: String, default: null },
    title: { type: String, default: '' },
    aspectRatio: { type: String, default: '4 / 3' },
    hoverEffect: { type: Boolean, default: true },
    placeholderText: { type: String, default: 'Sin imagen' }
  },
  data() {
    return {
      imageFailed: false
    }
  },
  computed: {
    wrapperStyle() {
      return {
        aspectRatio: this.aspectRatio
      }
    }
  },
  methods: {
    handleError() {
      this.imageFailed = true
    }
  }
}
</script>

<style scoped>
.base-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
}

.base-card.has-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(255, 77, 141, 0.15);
  border-color: rgba(255, 77, 141, 0.3);
}

.card-image-wrapper {
  width: 100%;
  background-color: var(--image-placeholder-bg);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.base-card.has-hover:hover .card-image {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  padding: 1rem;
}

.icon-svg {
  width: 48px;
  height: 48px;
  stroke: var(--soft-pink);
  opacity: 0.4;
  transition: stroke 0.3s ease, opacity 0.3s ease;
}

.no-image-text {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.base-card.has-hover:hover .icon-svg {
  stroke: var(--primary-pink);
  opacity: 0.8;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.1rem;
  color: var(--text-main);
  margin-top: 0;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
