<template>
  <v-app>
    
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>Mi Primer Proyecto Vuetify</v-app-bar-title>
    </v-app-bar>

    <v-main>
      
      <v-container>
        
        <v-card class="mx-auto mt-5" max-width="400" elevation="4">
          
          <v-card-item>
            <v-card-title>¡Hola, Mundo!</v-card-title>
            <v-card-subtitle>Probando componentes</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            Este es mi primer componente de prueba usando la documentación de Vuetify. Poco a poco iré mirando y añadiendo más cosas q vaya haciendo nuevas.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer> <v-btn color="success" variant="flat">
              Púlsame
            </v-btn>
          </v-card-actions>
          
        </v-card>

      </v-container>
    </v-main>
    
  </v-app>
</template>

<script setup>
</script>

<style>
/*no hace falta poner css pq ya se encarga el Vuetify*/
</style>