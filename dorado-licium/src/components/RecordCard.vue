<template>
  <router-link :to="`/records/${record.id}`" class="record-card-golden gold-border">
    <div class="image-wrapper">
      <img
        v-if="imageUrl && !imageFailed"
        :src="imageUrl"
        :alt="getTitle"
        class="record-image"
        @error="handleError"
      />
      <div v-else class="placeholder-image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="placeholder-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Subtle PDF Indicator -->
      <div v-if="hasPdf" class="pdf-indicator" title="Documento PDF">
        <span>PDF</span>
      </div>

      <!-- Hover Overlay: Glassmorphism -->
      <div class="overlay glass-panel">
        <div class="overlay-content">
          <h3 class="record-title serif">{{ getTitle }}</h3>
          <div class="record-meta-minimal" v-if="getAuthor || getDate">
            <span v-if="getAuthor" class="meta-author">{{ getAuthor }}</span>
            <span v-if="getAuthor && getDate" class="meta-sep">·</span>
            <span v-if="getDate" class="meta-date">{{ getDate }}</span>
          </div>
          <div class="view-details">
            <span>EXPLORAR</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { getTitle, extractMultilingual } from '../utils/data-utils.js'
import { getThumbnailUrl, isPdf } from '../utils/image.js'

export default {
  name: 'RecordCard',
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
      const author = typeof this.record.author === 'string' 
        ? this.record.author 
        : Array.isArray(this.record.author) 
          ? this.record.author[0] 
          : extractMultilingual(this.record.author, null)
      return author
    },
    getDate() {
      if (!this.record.date) return null
      return Array.isArray(this.record.date) ? this.record.date[0] : this.record.date
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
.record-card-golden {
  display: block;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  background-color: var(--gold-soft);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(185, 158, 124, 0.1);
}

.record-card-golden:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(138, 109, 59, 0.15);
  border-color: var(--gold-dark);
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.record-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.record-card-golden:hover .record-image {
  transform: scale(1.1);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold-soft) 100%);
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  color: var(--gold-medium);
  opacity: 0.5;
}

.pdf-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--gold-dark);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* OVERLAY */
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  opacity: 0;
  transition: all 0.4s ease;
  transform: translateY(20px);
  background: linear-gradient(to top, rgba(74, 64, 49, 0.8) 0%, rgba(74, 64, 49, 0) 100%);
  border: none; /* Override glass-panel border if needed */
}

.record-card-golden:hover .overlay {
  opacity: 1;
  transform: translateY(0);
}

.overlay-content {
  color: white;
  width: 100%;
}

.record-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: white;
}

.record-meta-minimal {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.2rem;
  font-family: var(--font-sans);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.meta-sep {
  margin: 0 0.5rem;
  opacity: 0.5;
}

.view-details {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gold-light);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
}

.arrow {
  transition: transform 0.3s ease;
}

.record-card-golden:hover .arrow {
  transform: translateX(5px);
}
</style>