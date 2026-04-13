<template>
  <router-link :to="`/records/${record.id}`" class="record-card">
    
    <!-- SVG PDF Icon Badge -->
    <div v-if="hasPdf" class="pdf-icon-badge" title="Documento PDF">
      <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 0h28l16 16v44c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V4c0-2.2 1.8-4 4-4z" fill="#fff" stroke="#e0e0e0" stroke-width="2"/>
        <path d="M32 0v16h16L32 0z" fill="#f0f0f0" stroke="#e0e0e0" stroke-width="2" stroke-linejoin="round"/>
        <rect x="0" y="14" width="34" height="16" fill="#e91e63" />
        <text x="17" y="26" fill="#fff" font-family="Arial, sans-serif" font-size="11" font-weight="900" text-anchor="middle" letter-spacing="1">PDF</text>
        <path d="M22 52c-2-5-5-5-6-3c-1 1-1 4 2 2c3-2 5-6 8-8c1-1 3-2 3-1c0 1-2 2-3 4c-2 3-3 6-3 8c0 2 2 3 3 2c1-1 2-2 1-3c-1-2-3-4-5-1z" fill="none" stroke="#e91e63" stroke-width="2.5" stroke-linejoin="round"/>
      </svg>
    </div>
    
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
  overflow: visible; /* Changed to visible to let the icon stick out */
  position: relative;
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
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.pdf-icon-badge {
  position: absolute;
  top: -12px;
  right: -10px;
  width: 36px;
  height: auto;
  z-index: 20;
  filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.25));
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
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
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