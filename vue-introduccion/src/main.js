import { createApp } from 'vue'
import App from './App.vue'

// Importaciones de Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Configuración de Vuetify
const vuetify = createVuetify({
  components,
  directives,
})

// Creación de la app usando Vuetify
createApp(App).use(vuetify).mount('#app')