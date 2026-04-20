<template>
  <BaseCard
    :to="`/records/${record.id}`"
    :image-url="imageUrl"
    :title="getTitle"
    aspect-ratio="4 / 3"
  >
    <template #badge>
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
    </template>

    <template #content>
      <div class="record-meta">
        <p v-if="getAuthor" class="author">{{ getAuthor }}</p>
        <p v-if="getDate" class="date">{{ getDate }}</p>
      </div>
    </template>
  </BaseCard>
</template>

<script>
import { getTitle, extractMultilingual } from '../utils/data-utils.js'
import { getThumbnailUrl, isPdf } from '../utils/image.js'
import BaseCard from './BaseCard.vue'

export default {
  components: { BaseCard },
  props: {
    record: {
      type: Object,
      required: true
    }
  },

  computed: {
    imageUrl() {
      return getThumbnailUrl(this.record)
    },

    hasPdf() {
      return isPdf(this.record)
    },

    getTitle() {
      return getTitle(this.record)
    },

    getAuthor() {
      if (!this.record.author) return null
      if (typeof this.record.author === 'string') return this.record.author
      if (Array.isArray(this.record.author)) return this.record.author.join(', ')
      return extractMultilingual(this.record.author, null)
    },

    getDate() {
      if (!this.record.date) return null
      if (typeof this.record.date === 'string') return this.record.date
      if (Array.isArray(this.record.date)) return this.record.date[0]
      return null
    }
  }
}
</script>

<style scoped>
/* Ensure the card allows the badge to overflow if needed, 
   though BaseCard has overflow: hidden by default. 
   We might need to override it or adjust the badge. */
:deep(.base-card) {
  overflow: visible;
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