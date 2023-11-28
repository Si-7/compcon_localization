<template>
  <v-container fluid style="overflow: hidden; margin-top: 48px; height: calc(100vh - 50px)">
    <v-row style="height: 100%" align="center">
      <v-col>
        <home-card
          title="Список НИП"
          icon="mdi-account-edit"
          text="Создавайте, редактируйте и управляйте НИП для использования в сценах."
          to="/gm/npc-roster"
        />
      </v-col>

      <v-col>
        <home-card
          title="Encounter Builder"
          icon="mdi-account-multiple-plus"
          text="Составляйте столкновения с НИП, целями и условиями боя."
          to="/gm/encounter-builder"
        />
      </v-col>

      <v-col>
        <home-card
          title="Mission Runner"
          icon="mdi-account-group"
          text="Запускайте наборы встреч в цифровом формате с отслеживанием статуса NPC и пилотов."
          to="/gm/mission"
          :icon-offset="13"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeCard from './components/HomeCard.vue'

export default Vue.extend({
  name: 'home',
  components: { HomeCard },
})
</script>
