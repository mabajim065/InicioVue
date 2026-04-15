<template>
  <div class="record-gallery">

    <!-- Imagen principal -->
    <div class="detail-image" :class="{ 'no-image-col': !images.length }">
      <template v-if="images.length">
        <div style="position: relative; display: inline-block; width: 100%;">
          <img
            :src="images[0].display"
            :alt="title"
            class="main-img"
            @click="openLightbox(0)"
          />
          <span v-if="images[0].isPdf" class="media-type-chip main-chip">PDF</span>
        </div>
        <div class="main-media-link-container">
          <router-link
            v-if="images[0].id"
            :to="`/media/${images[0].id}`"
            class="view-media-link"
          >Ver medio</router-link>
        </div>
      </template>
      <div v-else class="no-image">🖼</div>
    </div>

    <!-- Galería de miniaturas (solo si hay más de una imagen) -->
    <div v-if="images.length > 1" class="gallery-section">
      <h3 class="gallery-title">Imágenes asociadas</h3>
      <div class="gallery-scroll">
        <div
          v-for="(img, i) in images"
          :key="i"
          class="gallery-item-wrapper"
        >
          <div
            class="gallery-item"
            :class="{ active: i === activeIndex }"
            @click="openLightbox(i)"
          >
            <img :src="img.display" :alt="`Imagen ${i + 1}`" />
            <span v-if="img.isPdf" class="media-type-chip">PDF</span>
          </div>
          <router-link v-if="img.id" :to="`/media/${img.id}`" class="view-media-link">
            Ver medio
          </router-link>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">✕</button>
      <button
        v-if="images.length > 1"
        class="lightbox-nav lightbox-prev"
        @click.stop="prev"
      >‹</button>
      <img :src="currentUrl" :alt="title" @click.stop />
      <button
        v-if="images.length > 1"
        class="lightbox-nav lightbox-next"
        @click.stop="next"
      >›</button>
      <div v-if="images.length > 1" class="lightbox-counter">
        {{ activeIndex + 1 }} / {{ images.length }}
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    // Array de { id, display, large, isPdf, attachId }
    images: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      lightboxOpen: false,
      activeIndex: 0
    }
  },

  computed: {
    currentUrl() {
      return this.images[this.activeIndex]?.large || null
    }
  },

  mounted() {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown)
  },

  methods: {
    openLightbox(index) {
      this.activeIndex = index
      this.lightboxOpen = true
      document.body.style.overflow = 'hidden'
    },
    closeLightbox() {
      this.lightboxOpen = false
      document.body.style.overflow = ''
    },
    prev() {
      this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length
    },
    next() {
      this.activeIndex = (this.activeIndex + 1) % this.images.length
    },
    onKeydown(e) {
      if (!this.lightboxOpen) return
      if (e.key === 'Escape')      this.closeLightbox()
      if (e.key === 'ArrowLeft')   this.prev()
      if (e.key === 'ArrowRight')  this.next()
    }
  }
}
</script>

<style scoped>
/* Imagen principal */
.detail-image img { width: 100%; border-radius: 12px; box-shadow: 0 8px 30px rgba(255,77,141,0.1); }
.detail-image .main-img { cursor: zoom-in; transition: transform 0.2s; }
.detail-image .main-img:hover { transform: scale(1.01); }
.detail-image .no-image {
  width: 100%; aspect-ratio: 4/3; background: var(--no-image-detail-bg);
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  font-size: 4rem; opacity: 0.3;
}

.main-media-link-container { margin-top: 1rem; text-align: center; }

/* Chip de tipo */
.media-type-chip {
  position: absolute;
  top: 12px; left: -8px;
  background: #E63946; color: white;
  font-size: 0.75rem; font-weight: 800;
  padding: 4px 12px; border-radius: 4px;
  letter-spacing: 1px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  pointer-events: none;
  transform: rotate(-4deg);
  z-index: 5;
  border: 1px solid rgba(255,255,255,0.3);
}
.main-chip { top: 25px; left: -15px; font-size: 1.2rem; padding: 8px 26px; box-shadow: 0 6px 15px rgba(230, 57, 70, 0.4); }

/* Enlace Ver medio */
.view-media-link {
  font-size: 0.8rem; color: var(--primary-pink);
  text-decoration: none; font-weight: 500;
  transition: color 0.2s; text-align: center; padding: 0.2rem;
}
.view-media-link:hover { color: var(--soft-pink); text-decoration: underline; }

/* Galería de miniaturas */
.gallery-section { margin-top: 2.5rem; }
.gallery-title { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; }
.gallery-scroll {
  display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.75rem;
  scrollbar-width: thin; scrollbar-color: rgba(255,77,141,0.4) transparent;
}
.gallery-scroll::-webkit-scrollbar { height: 6px; }
.gallery-scroll::-webkit-scrollbar-thumb { background: rgba(255,77,141,0.4); border-radius: 10px; }
.gallery-item-wrapper {
  flex: 0 0 160px;
  display: flex; flex-direction: column;
  align-items: center; gap: 0.4rem;
}
.gallery-item {
  width: 100%; height: 110px; border-radius: 10px;
  overflow: hidden; position: relative;
  cursor: pointer; border: 2px solid transparent; transition: all 0.25s;
}
.gallery-item:hover { border-color: rgba(255,133,177,0.5); transform: translateY(-2px); }
.gallery-item.active { border-color: var(--primary-pink); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }

/* Lightbox */
.lightbox {
  position: fixed; inset: 0; background: rgba(0,0,0,0.92);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
  cursor: default;
}
.lightbox img {
  max-width: 80vw; max-height: 85vh; object-fit: contain;
  border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  cursor: zoom-out; user-select: none;
}
.lightbox-close {
  position: absolute; top: 1.5rem; right: 1.5rem;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; font-size: 1.4rem; width: 42px; height: 42px;
  border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; z-index: 1;
}
.lightbox-close:hover { background: rgba(255,77,141,0.5); box-shadow: none; transform: none; }
.lightbox-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; font-size: 2.5rem; width: 52px; height: 52px;
  border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; z-index: 1; line-height: 1; padding-bottom: 2px;
}
.lightbox-nav:hover { background: rgba(255,77,141,0.5); box-shadow: none; transform: translateY(-50%); }
.lightbox-prev { left: 1.5rem; }
.lightbox-next { right: 1.5rem; }
.lightbox-counter {
  position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.7); font-size: 0.85rem;
  background: rgba(0,0,0,0.4); padding: 0.3rem 0.8rem; border-radius: 20px;
}
</style>
