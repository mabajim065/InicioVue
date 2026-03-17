<template>
  <router-link :to="`/record/${record.id}`" class="record-card">
    <div class="card-image">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="getTitle"
        loading="lazy"
        @error="handleImageError"
      />
      <div v-else class="no-image">🖼️</div>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ getTitle }}</h3>
      <p v-if="getAuthor" class="card-author">{{ getAuthor }}</p>
      <p v-if="getDate" class="card-date"> {{ getDate }}</p>
      <div v-if="record.collections && record.collections.length" class="card-collections">
        <span
          v-for="col in record.collections"
          :key="col.id"
          class="collection-badge"
        >
          {{ col.title || 'Colección' }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageUrl() {
      let thumb = this.record.thumbnail;
      if (!thumb) return null;

      // Si el thumbnail viene como un objeto con idiomas
      if (typeof thumb === 'object') {
        const keys = Object.keys(thumb);
        thumb = keys.length > 0 ? thumb[keys[0]] : null;
      }

      if (!thumb) return null;

      // Si la ruta es relativa (no empieza por http), le pegamos la base de la URJC
      if (!thumb.startsWith('http')) {
        return `https://urjc.licium.libnamic.com${thumb}`;
      }
      
      return thumb;
    },
    getTitle() {
      if (!this.record.title) return 'Sin título'
      if (typeof this.record.title === 'string') return this.record.title
      const keys = Object.keys(this.record.title)
      return keys.length > 0 ? this.record.title[keys[0]] : 'Sin título'
    },
    getAuthor() {
      if (!this.record.author) return null
      if (typeof this.record.author === 'string') return this.record.author
      if (Array.isArray(this.record.author)) return this.record.author.join(', ')
      const keys = Object.keys(this.record.author)
      return keys.length > 0 ? this.record.author[keys[0]] : null
    },
    getDate() {
      if (!this.record.date) return null
      if (typeof this.record.date === 'string') return this.record.date
      if (Array.isArray(this.record.date)) return this.record.date[0]
      return null
    }
  },
  methods: {
    handleImageError(e) {
      // Si falla la imagen, ponemos un placeholder rosado sutil
      e.target.src = 'https://via.placeholder.com/300x400/1a1a2e/ff4d8d?text=Licium'
    }
  }
}
</script>

<style scoped>
.record-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 77, 141, 0.2); /* Borde rosita sutil */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.record-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(255, 77, 141, 0.3);
  border-color: var(--primary-pink);
}

.card-image {
  width: 100%;
  aspect-ratio: 3/4; /* Cambiado a formato libro/vertical */
  overflow: hidden;
  background: #12121f;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.record-card:hover .card-image img {
  transform: scale(1.1);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: linear-gradient(135deg, #1a1a2e, #2a1a2e);
  color: var(--primary-pink);
  opacity: 0.5;
}

.card-body {
  padding: 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: linear-gradient(to bottom, transparent, rgba(255, 77, 141, 0.05));
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-author {
  font-size: 0.85rem;
  color: var(--soft-pink);
  margin: 0;
}

.card-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.card-collections {
  margin-top: auto;
  padding-top: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.collection-badge {
  font-size: 0.7rem;
  background: var(--primary-pink);
  color: #fff;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>