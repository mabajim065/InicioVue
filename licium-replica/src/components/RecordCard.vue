<template>
  <router-link :to="`/record/${record.id}`" class="record-card">
    <div class="card-image">
      <img
        v-if="record.thumbnail"
        :src="record.thumbnail"
        :alt="getTitle"
        loading="lazy"
        @error="handleImageError"
      />
      <div v-else class="no-image"></div>
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
      e.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.record-card {
  background: #1a1a2e;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
}

.record-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(255, 77, 141, 0.15);
  border-color: rgba(255, 77, 141, 0.3);
}

.card-image {
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #12121f;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.record-card:hover .card-image img {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  opacity: 0.3;
}

.card-body {
  padding: 1rem 1.2rem 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-author {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.5);
}

.card-date {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
}

.card-collections {
  margin-top: auto;
  padding-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.collection-badge {
  font-size: 0.7rem;
  background: rgba(255, 77, 141, 0.12);
  color: #ff85b1;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  white-space: nowrap;
}
</style>