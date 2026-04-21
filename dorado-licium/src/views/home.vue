<template>
  <div class="home">
    <HomeHero>
      <template #after-content>
        <HomeQuickAccess />
      </template>
    </HomeHero>

    <HomeInfoCards />
  </div>
</template>

<script>
import HomeHero from '../components/HomeHero.vue'
import HomeQuickAccess from '../components/HomeQuickAccess.vue'
import HomeInfoCards from '../components/HomeInfoCards.vue'

export default { 
  name: 'Home',
  components: {
    HomeHero,
    HomeQuickAccess,
    HomeInfoCards
  }
}
</script>

<style scoped>
.home { min-height: 80vh; overflow-x: hidden; }
</style>