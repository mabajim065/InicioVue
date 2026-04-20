<template>
  <router-link :to="`/media/${media.id}`" class="media-card">
    
    <div class="card-image">
      <img
        v-if="imageUrl && !imageFailed"
        :src="imageUrl"
        :alt="getTitle"
        @error="handleImageError"
      />
      <div v-else class="no-image">
        <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text">Sin imagen</span>
      </div>
      <div v-if="getType" class="media-badge">{{ getType }}</div>
    </div>
    
    <div class="card-info">
      <h3 class="media-title">{{ getTitle }}</h3>
      
      <div class="media-meta" v-if="getDescription">
        <p class="description">{{ getDescription }}</p>
      </div>
    </div>

  </router-link>
</template>

<script>
import { getTitle, getDescription } from '../utils/data-utils.js'
import { getThumbnailUrl } from '../utils/image.js'

export default {
  props: {
    media: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      imageFailed: false
    }
  },

  computed: {
    imageUrl() {
      return getThumbnailUrl(this.media, 'medium')
    },

    getTitle() {
      return getTitle(this.media)
    },

    getDescription() {
      return getDescription(this.media)
    },

    getType() {
      if (this.media.media_type) return this.media.media_type.toUpperCase()
      if (this.media.path) {
        const ext = this.media.path.split('.').pop()
        return ext ? ext.toUpperCase() : 'UNKNOWN'
      }
      return null
    }
  },

  methods: {
    handleImageError() {
      this.imageFailed = true
    }
  }
}
</script>

<style scoped>
.media-card {
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

.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(255, 77, 141, 0.15);
  border-color: rgba(255, 77, 141, 0.3);
}

.card-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  background-color: var(--image-placeholder-bg);
  overflow: hidden;
  position: relative;
}

.media-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 77, 141, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.media-card:hover .card-image img {
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
}

.no-image .icon-svg {
  stroke: var(--soft-pink);
  opacity: 0.4;
  transition: stroke 0.3s ease, opacity 0.3s ease;
}

.no-image .text {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.media-card:hover .no-image .icon-svg {
  stroke: var(--primary-pink);
  opacity: 0.8;
}
.media-card:hover .no-image .text {
  color: var(--primary-pink);
}

.card-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.media-title {
  font-size: 1.1rem;
  color: var(--text-main);
  margin-top: 0;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-meta {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.description {
  color: var(--card-date-color);
  font-size: 0.85rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.8;
}
</style>
