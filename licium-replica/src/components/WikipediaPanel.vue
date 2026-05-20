<template>
  <div class="wiki-panel" v-if="status !== 'hidden'">

    <div class="wiki-header">
      <span class="wiki-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </span>
      <h3>Wikipedia</h3>
    </div>

    <!-- Cargando -->
    <div v-if="status === 'loading'" class="wiki-loading">
      <span class="wiki-spinner"></span>
      <span>Buscando en Wikipedia...</span>
    </div>

    <!-- Resultado encontrado -->
    <div v-else-if="status === 'found'" class="wiki-content">
      <div class="wiki-body">
        <img v-if="thumbnail" :src="thumbnail" :alt="wikiTitle" class="wiki-thumb" />
        <div class="wiki-text">
          <p class="wiki-title-text">{{ wikiTitle }}</p>
          <p class="wiki-extract">{{ extract }}</p>
        </div>
      </div>
      <a :href="wikiUrl" target="_blank" rel="noopener" class="wiki-link">
        Leer en Wikipedia →
      </a>
    </div>

    <!-- No encontrado: no renderiza nada -->
  </div>
</template>

<script>
export default {
  name: 'WikipediaPanel',

  props: {
    // El título del record que llega desde RecordDetail
    recordTitle: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      status: 'loading',   // 'loading' | 'found' | 'hidden'
      wikiTitle: '',
      extract: '',
      thumbnail: null,
      wikiUrl: ''
    }
  },

  watch: {
    recordTitle(newVal) {
      if (newVal) this.buscarEnWikipedia(newVal)
    }
  },

  mounted() {
    if (this.recordTitle) this.buscarEnWikipedia(this.recordTitle)
  },

  methods: {
    // Limpia el título para mejorar la búsqueda en Wikipedia.
    // Los títulos del catálogo a veces tienen fechas, números o info extra
    // entre paréntesis o corchetes que Wikipedia no reconoce.
    limpiarTitulo(titulo) {
      return titulo
        .replace(/\[.*?\]/g, '')       // quita [lo que sea]
        .replace(/\(.*?\)/g, '')       // quita (lo que sea)
        .replace(/\d{4}/g, '')         // quita años sueltos
        .replace(/[,;:]/g, '')         // quita puntuación molesta
        .trim()
    },

    async buscarEnWikipedia(titulo) {
      this.status = 'loading'

      const terminos = this.limpiarTitulo(titulo)
      if (!terminos || terminos.length < 3) {
        this.status = 'hidden'
        return
      }

      try {
        // 1. Buscamos primero en español
        const encontrado = await this.intentarBusqueda(terminos, 'es')
        if (encontrado) return

        // 2. Si no hay resultado en español, intentamos en inglés
        const encontradoEn = await this.intentarBusqueda(terminos, 'en')
        if (encontradoEn) return

        // 3. Nada encontrado — ocultamos el panel silenciosamente
        this.status = 'hidden'

      } catch {
        this.status = 'hidden'
      }
    },

    async intentarBusqueda(terminos, lang) {
      const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(terminos)}`
      const res = await fetch(url)

      if (!res.ok) return false

      const data = await res.json()

      // Wikipedia devuelve disambiguation pages o páginas sin extract — las ignoramos
      if (data.type === 'disambiguation' || !data.extract || data.extract.length < 50) {
        return false
      }

      this.wikiTitle   = data.title
      this.extract     = data.extract.length > 300
        ? data.extract.slice(0, 300) + '…'
        : data.extract
      this.thumbnail   = data.thumbnail?.source || null
      this.wikiUrl     = data.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(data.title)}`
      this.status      = 'found'
      return true
    }
  }
}
</script>

<style scoped>
.wiki-panel {
  margin-top: 2.5rem;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(185, 158, 124, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
}

.wiki-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}

.wiki-icon {
  color: var(--gold-dark);
  display: flex;
  align-items: center;
}

.wiki-header h3 {
  color: var(--gold-dark);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin: 0;
}

/* Loading */
.wiki-loading {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.wiki-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--gold-light);
  border-top-color: var(--gold-medium);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Contenido */
.wiki-body {
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
  margin-bottom: 1.2rem;
}

.wiki-thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  border: 1px solid rgba(185, 158, 124, 0.2);
}

.wiki-text {
  flex: 1;
  min-width: 0;
}

.wiki-title-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.wiki-extract {
  color: var(--text-muted);
  font-size: 0.88rem;
  line-height: 1.7;
  margin: 0;
}

.wiki-link {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gold-dark);
  text-decoration: none;
  border-bottom: 1px solid var(--gold-light);
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.wiki-link:hover {
  color: var(--gold-medium);
  border-bottom-color: var(--gold-medium);
}

@media (max-width: 768px) {
  .wiki-body {
    flex-direction: column;
  }
  .wiki-thumb {
    width: 100%;
    height: 140px;
  }
}
</style>
