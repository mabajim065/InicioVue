<template>
  <div class="collection-hero" :style="imageUrl ? `background-image: url('${imageUrl}')` : ''" :class="{ 'no-image': !imageUrl }">
    <div class="collection-hero-overlay">
      <h1>{{ title }}</h1>
      <p v-if="description" class="col-description">{{ description }}</p>
    </div>
  </div>
</template>

<script>
const API_BASE = import.meta.env.VITE_API_BASE || 'https://arcadium.cluster24.libnamic.eu'

export default {
  name: 'CollectionHero',
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
    title() {
      if (!this.collection?.title) return 'Sin título'
      if (typeof this.collection.title === 'string') return this.collection.title
      const keys = Object.keys(this.collection.title)
      return keys.length > 0 ? this.collection.title[keys[0]] : 'Sin título'
    },
    description() {
      if (!this.collection?.description) return ''
      if (typeof this.collection.description === 'string') return this.collection.description
      const keys = Object.keys(this.collection.description)
      return keys.length > 0 ? this.collection.description[keys[0]] : ''
    }
  }
}
</script>

<style scoped>
.collection-hero {
  width: 100%;
  min-height: 280px;
  background-size: cover;
  background-position: center;
  background-color: var(--glass-pink);
  border-radius: 16px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}
.collection-hero.no-image {
  background: linear-gradient(135deg, rgba(255,77,141,0.15), rgba(255,133,177,0.05));
  border: 1px solid rgba(255,133,177,0.2);
  align-items: center;
  justify-content: center;
}
.collection-hero-overlay {
  width: 100%;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
}
.no-image .collection-hero-overlay {
  background: none;
  text-align: center;
}
.collection-hero h1 { font-size: 2rem; color: #fff; margin-bottom: 0.4rem; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
.no-image .collection-hero h1 { color: var(--text-main); text-shadow: none; }
.col-description { color: rgba(255,255,255,0.85); line-height: 1.6; max-width: 800px; font-size: 0.95rem; }
.no-image .col-description { color: var(--text-body); }
</style>
