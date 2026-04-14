<template>
  <router-link :to="`/collections/${collection.id}`" class="collection-card">

    <div
      class="card-image"
      :style="imageUrl ? `background-image: url('${imageUrl}')` : ''"
      :class="{ 'no-image': !imageUrl }"
    >
      <div v-if="!imageUrl" class="no-image-content">
        <svg class="placeholder-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4"/>
          <rect x="18" y="22" width="28" height="20" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
          <path d="M18 27h28" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
          <circle cx="24" cy="24.5" r="1.5" fill="currentColor" opacity="0.5"/>
          <circle cx="29" cy="24.5" r="1.5" fill="currentColor" opacity="0.5"/>
          <circle cx="34" cy="24.5" r="1.5" fill="currentColor" opacity="0.5"/>
          <path d="M24 33h16M24 37h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
        </svg>
        <span class="placeholder-label">Colección</span>
      </div>
    </div>

    <div class="card-info">
      <h3>{{ getTitle }}</h3>
      <p v-if="getDescription" class="col-desc">{{ getDescription }}</p>
    </div>

  </router-link>
</template>

<script>
const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

export default {
  props: {
    collection: {
      type: Object,
      required: true
    }
  },

  computed: {
    imageUrl() {
      let thumb = this.collection?.thumbnail
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

    getTitle() {
      if (!this.collection.title) return 'Sin título'
      if (typeof this.collection.title === 'string') return this.collection.title
      const keys = Object.keys(this.collection.title)
      return keys.length > 0 ? this.collection.title[keys[0]] : 'Sin título'
    },

    getDescription() {
      if (!this.collection.description) return ''
      if (typeof this.collection.description === 'string') return this.collection.description
      const keys = Object.keys(this.collection.description)
      return keys.length > 0 ? this.collection.description[keys[0]] : ''
    }
  }
}
</script>

<style scoped>
.collection-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(255, 77, 141, 0.15);
  border-color: rgba(255, 77, 141, 0.3);
}

.card-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  background-color: var(--image-placeholder-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s ease;
  overflow: hidden;
}
.collection-card:hover .card-image {
  transform: scale(1.03);
}
.card-image.no-image {
  background: linear-gradient(135deg, rgba(255,77,141,0.18) 0%, rgba(130,80,180,0.14) 50%, rgba(255,133,177,0.1) 100%);
  border-bottom: 1px solid rgba(255, 77, 141, 0.15);
  color: var(--primary-pink);
}

.no-image-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.placeholder-icon {
  width: 52px;
  height: 52px;
  color: var(--primary-pink);
  transition: transform 0.4s ease, opacity 0.4s ease;
  opacity: 0.7;
}
.collection-card:hover .placeholder-icon {
  transform: scale(1.1) rotate(3deg);
  opacity: 1;
}

.placeholder-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--primary-pink);
  opacity: 0.7;
}

.card-info {
  padding: 1.2rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.card-info h3 {
  font-size: 1.05rem;
  color: var(--text-main);
  margin: 0 0 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.col-desc {
  color: var(--card-date-color);
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
