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
.metadata { 
  margin-bottom: 3rem; 
}
.metadata-toggle {
  background: var(--gold-soft);
  border: 1px solid var(--gold-light);
  color: var(--gold-dark);
  padding: 0.8rem 1.8rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.metadata-toggle:hover { 
  background: var(--gold-medium); 
  color: white;
  border-color: var(--gold-dark);
}
.metadata table { 
  width: 100%; 
  border-collapse: collapse;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(185, 158, 124, 0.2);
}
.metadata tr { border-bottom: 1px solid rgba(185, 158, 124, 0.1); }
.metadata tr:last-child { border-bottom: none; }
.metadata td { padding: 1rem; vertical-align: top; }
.meta-key { 
  color: var(--gold-dark); 
  font-size: 0.75rem; 
  width: 30%; 
  font-weight: 700; 
  text-transform: uppercase;
  letter-spacing: 1px;
}
.meta-value { 
  color: var(--text-main); 
  font-size: 0.9rem; 
  line-height: 1.5;
}

@media (max-width: 600px) {
  .meta-key { width: 40%; font-size: 0.7rem; }
  .meta-value { font-size: 0.85rem; }
}
</style>
