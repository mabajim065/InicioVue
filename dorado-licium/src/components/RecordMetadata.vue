<template>
  <div class="record-metadata">

    <!-- Colecciones -->
    <div v-if="collections.length" class="collections-list">
      <h3>Colecciones</h3>
      <div class="col-tags">
        <router-link
          v-for="col in collections"
          :key="col.id"
          :to="`/collections/${col.id}`"
          class="col-tag"
        >{{ col.title }}</router-link>
      </div>
    </div>

    <!-- Descripción -->
    <div v-if="description" class="description">
      <h3>Descripción</h3>
      <p>{{ description }}</p>
    </div>

    <!-- Metadatos canónicos: siempre visibles -->
    <div v-if="canonicalRows.length" class="canonical-metadata">
      <table>
        <tr v-for="row in canonicalRows" :key="row.key">
          <td class="meta-key">{{ row.label }}</td>
          <td class="meta-value">
            <MetaValueList :values="row.values" />
          </td>
        </tr>
      </table>
    </div>

    <!-- Metadatos técnicos: desplegable -->
    <div v-if="joinedRows.length" class="metadata">
      <button class="metadata-toggle" @click="open = !open">
        Metadatos {{ open ? '▲' : '▼' }}
      </button>
      <table v-if="open">
        <tr v-for="row in joinedRows" :key="row.key">
          <td class="meta-key">{{ row.label }}</td>
          <td class="meta-value">
            <MetaValueList :values="row.values" />
          </td>
        </tr>
      </table>
    </div>

  </div>
</template>

<script>
// Sub-componente inline para renderizar los valores tipados de una celda.
// Se define aquí porque no tiene uso fuera de RecordMetadata.
const MetaValueList = {
  props: { values: { type: Array, required: true } },
  template: `
    <span class="meta-values-list">
      <span v-for="(v, i) in values" :key="i" class="meta-value-item">
        <span v-if="i > 0" class="meta-sep"> · </span>
        <span v-if="v.type === 'literal'" class="mv-literal">{{ v.text }}</span>
        <a v-else-if="v.type === 'uri'" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-uri">{{ v.text }}</a>
        <template v-else-if="v.type === 'resource'">
          <router-link v-if="v.routerTo" :to="v.routerTo" class="mv-link mv-resource">{{ v.text }}</router-link>
          <a v-else-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-resource">{{ v.text }}</a>
          <span v-else class="mv-resource no-href">{{ v.text }}</span>
        </template>
        <span v-else-if="v.type === 'authority'" class="mv-authority">
          <a v-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link">{{ v.text }}</a>
          <span v-else>{{ v.text }}</span>
          <span v-for="b in v.badges" :key="b" class="mv-badge">{{ b }}</span>
        </span>
        <span v-else-if="v.type === 'vocabulary'" class="mv-vocabulary">
          <a v-if="v.href" :href="v.href" target="_blank" rel="noopener" class="mv-link mv-vocab-link">{{ v.text }}</a>
          <span v-else>{{ v.text }}</span>
        </span>
        <span v-else>{{ v.text }}</span>
      </span>
    </span>
  `
}

export default {
  components: { MetaValueList },

  props: {
    collections: {
      type: Array,
      default: () => []
    },
    description: {
      type: String,
      default: null
    },
    canonicalRows: {
      type: Array,
      default: () => []
    },
    joinedRows: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return { open: false }
  }
}
</script>

<style scoped>
/* Colecciones */
.collections-list { margin-bottom: 2rem; }
.collections-list h3 { 
  color: var(--gold-dark); 
  font-size: 0.75rem; 
  text-transform: uppercase; 
  letter-spacing: 2px; 
  margin-bottom: 1rem;
  font-weight: 700;
}
.col-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.col-tag {
  background: rgba(185, 158, 124, 0.1); 
  border: 1px solid rgba(185, 158, 124, 0.3);
  color: var(--text-main); 
  padding: 0.4rem 1.2rem; 
  border-radius: 50px;
  font-size: 0.8rem; 
  text-decoration: none; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
}
.col-tag:hover { 
  background: var(--gold-medium); 
  color: white; 
  border-color: var(--gold-dark);
  transform: translateY(-2px);
}

/* Descripción */
.description { margin-bottom: 2.5rem; }
.description h3 { 
  color: var(--gold-dark); 
  font-size: 0.75rem; 
  text-transform: uppercase; 
  letter-spacing: 2px; 
  margin-bottom: 1rem;
  font-weight: 700;
}
.description p { 
  color: var(--text-main); 
  line-height: 1.8; 
  font-size: 1.05rem;
}

/* Tablas de metadatos */
.canonical-metadata { 
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.4);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(185, 158, 124, 0.2);
}
.canonical-metadata table { width: 100%; border-collapse: collapse; }
.canonical-metadata tr { border-bottom: 1px solid rgba(185, 158, 124, 0.1); }
.canonical-metadata tr:last-child { border-bottom: none; }
.canonical-metadata td { padding: 1rem 0; vertical-align: top; }

.metadata { margin-top: 2rem; }
.metadata-toggle {
  background: var(--gold-soft); 
  border: 1px solid var(--gold-light);
  color: var(--gold-dark); 
  padding: 0.8rem 1.5rem; 
  border-radius: 50px;
  cursor: pointer; 
  font-size: 0.8rem; 
  font-weight: 700; 
  margin-bottom: 1.5rem;
  transition: all 0.3s; 
  text-transform: uppercase;
  letter-spacing: 1px;
}
.metadata-toggle:hover { background: var(--gold-medium); color: white; border-color: var(--gold-dark); }

.metadata table { 
  width: 100%; 
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 12px;
}
.metadata tr { border-bottom: 1px solid rgba(185, 158, 124, 0.1); }
.metadata td { padding: 1rem 0; vertical-align: top; }

.meta-key { color: var(--gold-dark); font-size: 0.8rem; width: 35%; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.meta-value { color: var(--text-main); font-size: 0.9rem; }

/* Valores tipados */
.meta-values-list { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: baseline; }
.meta-sep { color: var(--gold-light); font-weight: bold; }
.mv-literal { color: var(--text-main); }
.mv-link {
  color: var(--gold-medium); 
  text-decoration: none;
  border-bottom: 1px solid var(--gold-light);
  transition: all 0.2s; 
  font-weight: 500;
}
.mv-link:hover { color: var(--gold-dark); border-bottom-color: var(--gold-dark); }
.mv-authority { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; }
.mv-badge {
  display: inline-block; font-size: 0.65rem; padding: 0.15rem 0.6rem;
  border-radius: 4px; background: var(--gold-soft);
  border: 1px solid var(--gold-light); color: var(--gold-dark);
  font-weight: 700; text-transform: uppercase;
}

/* Responsive */
@media (max-width: 768px) {
  .canonical-metadata td, .metadata td {
    display: block; width: 100%;
  }
  .meta-key {
    width: 100%; margin-bottom: 0.5rem;
  }
  .meta-value { width: 100%; }
}
</style>
