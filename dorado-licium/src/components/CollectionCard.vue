<template>
  <router-link :to="`/collections/${collection.id}`" class="collection-card-golden gold-border">
    <div class="image-wrapper">
      <img
        v-if="imageUrl && !imageFailed"
        :src="imageUrl"
        :alt="getTitle"
        class="collection-image"
        @error="handleError"
      />
      <div v-else class="placeholder-collection">
        <div class="placeholder-content">
          <span class="ornament">◈</span>
          <span class="placeholder-text">COLECCIÓN</span>
        </div>
      </div>

      <!-- Hover Overlay -->
      <div class="overlay glass-panel">
        <div class="overlay-content">
          <h3 class="collection-title serif">{{ getTitle }}</h3>
          <p v-if="getDescription" class="collection-desc">{{ getDescription }}</p>
          <div class="explore-btn">
            <span>VER COLECCIÓN</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { getTitle, getDescription } from '../utils/data-utils.js'
import { getThumbnailUrl } from '../utils/image.js'

export default {
  name: 'CollectionCard',
  props: {
    collection: {
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
      return getThumbnailUrl(this.collection)
    },
    getTitle() {
      return getTitle(this.collection)
    },
    getDescription() {
      return getDescription(this.collection)
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
.collection-card-golden {
  display: block;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background-color: var(--gold-soft);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(185, 158, 124, 0.15);
}

.collection-card-golden:hover {
  transform: scale(1.03);
  box-shadow: 0 25px 50px rgba(138, 109, 59, 0.2);
  border-color: var(--gold-dark);
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.collection-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.collection-card-golden:hover .collection-image {
  transform: scale(1.1);
}

.placeholder-collection {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;
}

.placeholder-collection::after {
  content: '';
  position: absolute;
  inset: 1rem;
  border: 1px solid var(--gold-light);
  border-radius: 12px;
  pointer-events: none;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--gold-medium);
}

.ornament { font-size: 2rem; opacity: 0.6; }
.placeholder-text { font-size: 0.7rem; font-weight: 800; letter-spacing: 3px; }

/* OVERLAY */
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top, 
    rgba(74, 64, 49, 0.95) 0%, 
    rgba(74, 64, 49, 0.4) 50%, 
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 2.5rem;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  border: none;
}

.collection-card-golden:hover .overlay {
  opacity: 1;
  transform: translateY(0);
}

.overlay-content {
  color: white;
  width: 100%;
}

.collection-title {
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.collection-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.explore-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--gold-light);
}

.arrow { transition: transform 0.3s; }
.collection-card-golden:hover .arrow { transform: translateX(5px); }

@media (max-width: 600px) {
  .collection-title { font-size: 1.3rem; }
  .overlay { padding: 1.5rem; }
}
</style>

