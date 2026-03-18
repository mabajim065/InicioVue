<template>
  <!-- Enlace a la vista de detalle del record -->
  <router-link :to="`/record/${record.id}`" class="record-card">

    
    <div class="card-image">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="getTitle"
        @error="handleImageError"
      />
      <div v-else class="no-image"></div>
    </div>

    
    <div class="card-info">
      <h3>{{ getTitle }}</h3>
      <p v-if="getAuthor">{{ getAuthor }}</p>
      <p v-if="getDate">{{ getDate }}</p>
    </div>

  </router-link>
</template>

<script>
export default {
  // Recibe el objeto record desde el componente padre
  props: {
    record: {
      type: Object,
      required: true
    }
  },

  computed: {
    imageUrl() {
      let thumb = this.record.thumbnail
      if (!thumb) return null

 
      if (typeof thumb === 'object') {
        const keys = Object.keys(thumb)
        thumb = keys.length > 0 ? thumb[keys[0]] : null
      }

      if (!thumb) return null
      if (thumb.startsWith('http')) return thumb

      // Añade el dominio base si la ruta es relativa
      const path = thumb.startsWith('/') ? thumb : `/${thumb}`
      return `https://arcadium.cluster24.libnamic.eu${path}`
    },

    // Extrae el título
    getTitle() {
      if (!this.record.title) return 'Sin título'
      if (typeof this.record.title === 'string') return this.record.title
      const keys = Object.keys(this.record.title)
      return keys.length > 0 ? this.record.title[keys[0]] : 'Sin título'
    },

    // Extrae el autor
    getAuthor() {
      if (!this.record.author) return null
      if (typeof this.record.author === 'string') return this.record.author
      if (Array.isArray(this.record.author)) return this.record.author.join(', ')
      const keys = Object.keys(this.record.author)
      return keys.length > 0 ? this.record.author[keys[0]] : null
    },

    // Extrae la fecha
    getDate() {
      if (!this.record.date) return null
      if (typeof this.record.date === 'string') return this.record.date
      if (Array.isArray(this.record.date)) return this.record.date[0]
      return null
    }
  },

  methods: {
    // Oculta la imagen si no carga correctamente
    handleImageError(e) {
      e.target.style.display = 'none'
    }
  }
}
</script>