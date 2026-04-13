<template>
  <router-link :to="`/records/${record.id}`" class="record-card">
    
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
      
      <!-- Pegatina de PDF a la derecha -->
      <div v-if="hasPdf" class="pdf-sticker-right">
        PDF
      </div>
    </div>
    
    <div class="card-info">
      <h3 class="record-title">{{ getTitle }}</h3>
      
      <div class="record-meta">
        <p v-if="getAuthor" class="author">{{ getAuthor }}</p>
        <p v-if="getDate" class="date">{{ getDate }}</p>
      </div>
    </div>

  </router-link>
</template>

<script>
const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

export default {
  props: {
    record: {
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
      let thumb = this.record.thumbnail
      if (!thumb) return null
      if (typeof thumb === 'object') {
        const keys = Object.keys(thumb)
        thumb = keys.length > 0 ? thumb[keys[0]] : null
      }
      if (!thumb) return null
      if (thumb.startsWith('http')) return thumb
      const path = thumb.startsWith('/') ? thumb : `/${thumb}`
      return `${API_BASE}${path}`
    },

    hasPdf() {
      if (this.record.media_type === 'pdf') return true;
      if (this.record.media_items && Array.isArray(this.record.media_items)) {
        return this.record.media_items.some(item => 
          item.media_type === 'pdf' || (item.path && item.path.includes('.pdf'))
        );
      }
      return false;
    },

    getTitle() {
      if (!this.record.title) return 'Sin título'
      if (typeof this.record.title === 'string') return this.record.title
      const keys = Object.keys(this.record.title)
      return keys.length > 0 ? this.record.title[keys[0]] : 'Sin título'
    },

    getAuthor() {
      if (!this.record.author) return null
      if (typeof this.record.author === 'string') return this.record.author
      if (Array.isArray(this.record.author)) return this.record.author.join(', ')
      const keys = Object.keys(this.record.author)
      return keys.length > 0 ? this.record.author[keys[0]] : null
    },

    getDate() {
      if (!this.record.date) return null
      if (typeof this.record.date === 'string') return this.record.date
      if (Array.isArray(this.record.date)) return this.record.date[0]
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
.record-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.record-card:hover {
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

.pdf-sticker-right {
  position: absolute;
  top: 15px;
  right: -6px;
  background: #E63946;
  color: white;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 6px 16px;
  border-radius: 4px;
  letter-spacing: 1px;
  box-shadow: -2px 4px 10px rgba(230, 57, 70, 0.4), inset 0 0 0 1px rgba(255,255,255,0.2);
  transform: rotate(4deg);
  z-index: 10;
  pointer-events: none;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.record-card:hover .card-image img {
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

.record-card:hover .no-image .icon-svg {
  stroke: var(--primary-pink);
  opacity: 0.8;
}
.record-card:hover .no-image .text {
  color: var(--primary-pink);
}

.card-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.record-title {
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

.record-meta {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.author {
  color: var(--card-author-color);
  font-size: 0.85rem;
  margin: 0;
  font-weight: 600;
}

.date {
  color: var(--card-date-color);
  font-size: 0.82rem;
  margin: 0;
  font-weight: 500;
}
</style>