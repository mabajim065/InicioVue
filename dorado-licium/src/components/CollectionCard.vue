<template>
  <BaseCard
    :to="`/collections/${collection.id}`"
    :image-url="imageUrl"
    :title="getTitle"
    aspect-ratio="16 / 9"
    placeholder-text="Colección"
  >
    <template #no-image>
      <div class="no-image-content">
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
    </template>

    <template #content>
      <p v-if="getDescription" class="col-desc">{{ getDescription }}</p>
    </template>
  </BaseCard>
</template>

<script>
import { getTitle, getDescription } from '../utils/data-utils.js'
import { getThumbnailUrl } from '../utils/image.js'
import BaseCard from './BaseCard.vue'

export default {
  components: { BaseCard },
  props: {
    collection: {
      type: Object,
      required: true
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
  }
}
</script>

<style scoped>
.no-image-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  color: var(--primary-pink);
}

.placeholder-icon {
  width: 52px;
  height: 52px;
  color: var(--primary-pink);
  transition: transform 0.4s ease, opacity 0.4s ease;
  opacity: 0.7;
}

.base-card:hover .placeholder-icon {
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

