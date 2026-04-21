<template>
  <BaseCard
    :to="`/media/${media.id}`"
    :image-url="imageUrl"
    :title="getTitle"
    aspect-ratio="4 / 3"
  >
    <template #image-overlay>
      <div v-if="getType" class="media-badge">{{ getType }}</div>
    </template>

    <template #content>
      <div v-if="getDescription" class="media-meta">
        <p class="description">{{ getDescription }}</p>
      </div>
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
    media: {
      type: Object,
      required: true
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
  }
}
</script>

<style scoped>
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

