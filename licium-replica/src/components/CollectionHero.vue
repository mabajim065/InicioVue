<template>
  <div class="collection-hero" :style="imageUrl ? `background-image: url('${imageUrl}')` : ''" :class="{ 'no-image': !imageUrl }">
    <div class="collection-hero-overlay">
      <h1>{{ title }}</h1>
      <p v-if="description" class="col-description">{{ description }}</p>
    </div>
  </div>
</template>

<script>
import { getTitle, getDescription } from '../utils/data-utils.js'
import { getThumbnailUrl } from '../utils/image.js'

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
      return getThumbnailUrl(this.collection, 'large')
    },
    title() {
      return getTitle(this.collection)
    },
    description() {
      return getDescription(this.collection)
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
