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
.collections-list { margin-bottom: 1.5rem; }
.collections-list h3 { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.6rem; }
.col-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.col-tag {
  background: var(--glass-pink); border: 1px solid rgba(255,133,177,0.3);
  color: var(--primary-pink); padding: 0.3rem 0.8rem; border-radius: 50px;
  font-size: 0.8rem; text-decoration: none; transition: all 0.3s;
}
.col-tag:hover { background: rgba(255,77,141,0.15); color: var(--primary-pink); }

/* Descripción */
.description { margin-bottom: 2rem; }
.description h3 { color: var(--soft-pink); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; }
.description p { color: var(--text-body); line-height: 1.7; }

/* Tablas de metadatos */
.canonical-metadata { margin-bottom: 1.5rem; }
.canonical-metadata table { width: 100%; border-collapse: collapse; }
.canonical-metadata tr { border-bottom: 1px solid var(--meta-row-border); }
.canonical-metadata td { padding: 0.7rem 0; vertical-align: top; }

.metadata { margin-top: 1.5rem; }
.metadata-toggle {
  background: var(--glass-pink); border: 1px solid rgba(255,133,177,0.2);
  color: var(--primary-pink); padding: 0.5rem 1.2rem; border-radius: 8px;
  cursor: pointer; font-size: 0.85rem; font-weight: 500; margin-bottom: 1rem;
  transition: all 0.3s; box-shadow: none;
}
.metadata-toggle:hover { background: rgba(255,77,141,0.15); transform: none; box-shadow: none; }
.metadata table { width: 100%; border-collapse: collapse; }
.metadata tr { border-bottom: 1px solid var(--meta-row-border); }
.metadata td { padding: 0.7rem 0; vertical-align: top; }

.meta-key { color: var(--meta-key-color); font-size: 0.85rem; width: 35%; font-weight: 500; }
.meta-value { color: var(--meta-value-color); font-size: 0.85rem; }

/* Valores tipados */
.meta-values-list { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: baseline; }
.meta-sep { color: var(--text-faint); }
.mv-literal { color: var(--meta-value-color); }
.mv-link {
  color: var(--primary-pink); text-decoration: underline;
  text-underline-offset: 2px; transition: color 0.2s; word-break: break-all;
}
.mv-link:hover { color: var(--soft-pink); }
.mv-link.no-href { cursor: default; text-decoration: none; color: var(--meta-value-color); }
.mv-authority { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.3rem; }
.mv-badge {
  display: inline-block; font-size: 0.7rem; padding: 0.1rem 0.45rem;
  border-radius: 50px; background: var(--glass-pink);
  border: 1px solid rgba(255,133,177,0.3); color: var(--soft-pink);
  font-weight: 500; text-transform: capitalize;
}
.mv-vocabulary { color: var(--meta-value-color); }
.mv-vocab-link { color: var(--soft-pink); }

/* Responsive */
@media (max-width: 768px) {
  .canonical-metadata table, .canonical-metadata tbody, .canonical-metadata tr, .canonical-metadata td,
  .metadata table, .metadata tbody, .metadata tr, .metadata td {
    display: block; width: 100%;
  }
  .canonical-metadata tr, .metadata tr { padding: 0.75rem 0; }
  .canonical-metadata td, .metadata td { padding: 0; }
  .meta-key {
    width: 100%; margin-bottom: 0.3rem;
    color: var(--soft-pink); font-size: 0.8rem;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .meta-value { width: 100%; font-size: 0.95rem; }
  .meta-values-list { gap: 0.4rem; }
}
</style>
