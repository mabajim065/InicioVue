<template>
  <div v-if="collection.joined_metadata && Object.keys(collection.joined_metadata).length" class="metadata">
    <button class="metadata-toggle" @click="isOpen = !isOpen">
      Metadatos {{ isOpen ? '▲' : '▼' }}
    </button>
    <table v-if="isOpen">
      <tr v-for="(value, key) in collection.joined_metadata" :key="key">
        <td class="meta-key">{{ formatKey(key) }}</td>
        <td class="meta-value">{{ formatValue(value) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CollectionMetadata',
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    formatKey(key) {
      if (!key) return ''
      const parts = key.split('.')
      return parts[parts.length - 1].replace(/_/g, ' ').toUpperCase()
    },
    formatValue(val) {
      if (!val) return ''
      if (Array.isArray(val)) {
        return val.map(v => {
          if (typeof v === 'object' && v !== null) return v['@value'] || v['value'] || v['values']?.[0]?.['@value'] || ''
          return v
        }).filter(Boolean).join(', ')
      }
      if (typeof val === 'object' && val.values) return val.values.map(v => v['@value'] || v).join(', ')
      if (typeof val === 'object' && val['@value']) return val['@value']
      return String(val)
    }
  }
}
</script>

<style scoped>
.metadata { margin-bottom: 2.5rem; }
.metadata-toggle {
  background: var(--glass-pink);
  border: 1px solid rgba(255,133,177,0.2);
  color: var(--primary-pink);
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: all 0.3s;
  box-shadow: none;
}
.metadata-toggle:hover { background: rgba(255,77,141,0.15); transform: none; box-shadow: none; }
.metadata table { width: 100%; border-collapse: collapse; }
.metadata tr { border-bottom: 1px solid var(--meta-row-border); }
.metadata td { padding: 0.7rem 0; vertical-align: top; }
.meta-key { color: var(--meta-key-color); font-size: 0.85rem; width: 35%; font-weight: 500; }
.meta-value { color: var(--meta-value-color); font-size: 0.85rem; }
</style>
