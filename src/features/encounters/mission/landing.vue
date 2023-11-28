<template>
  <v-container fluid style="overflow: hidden; margin-top: 48px; height: calc(100vh - 50px)">
    <v-row style="height: 100%" align="center">
      <v-col>
        <home-card
          title="Создание миссий"
          icon="mdi-wrench-outline"
          text="Составляйте и редактируйте миссии"
          to="/gm/mission/builder"
        />
      </v-col>
      <v-col>
        <home-card
          title="Запуск миссий"
          icon="mdi-play-speed"
          text="Начать новую миссию или продолжить активную"
          to="/gm/mission/selector"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeCard from '../components/HomeCard.vue'

export default Vue.extend({
  name: 'mission-landing',
  components: { HomeCard },
})
</script>
