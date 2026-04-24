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
  min-height: 400px;
  background-size: cover;
  background-position: center;
  background-color: var(--gold-soft);
  border-radius: 24px;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  border: 1px solid var(--gold-light);
}
.collection-hero.no-image {
  background: white;
  align-items: center;
  justify-content: center;
}
.collection-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(74, 64, 49, 0.9) 0%, rgba(74, 64, 49, 0.2) 50%, transparent 100%);
  pointer-events: none;
}
.collection-hero-overlay {
  position: relative;
  width: 100%;
  padding: 4rem;
  z-index: 2;
}
.no-image .collection-hero-overlay {
  text-align: center;
}
.collection-hero h1 { 
  font-size: clamp(2rem, 5vw, 3.5rem); 
  color: #fff; 
  margin-bottom: 1rem; 
  font-family: var(--font-serif);
  font-weight: 700;
  line-height: 1.1;
}
.no-image .collection-hero h1 { 
  background: linear-gradient(135deg, var(--gold-dark) 0%, var(--gold-medium) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.col-description { 
  color: rgba(255,255,255,0.8); 
  line-height: 1.7; 
  max-width: 700px; 
  font-size: 1.1rem; 
}
.no-image .col-description { color: var(--text-muted); }
</style>
