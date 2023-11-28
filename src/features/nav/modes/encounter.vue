<template>
  <div>
    <router-link to="/gm/npc-roster">
      <v-btn text color="white" tile>Список НИП</v-btn>
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
    <router-link to="/gm/encounter-builder">
      <v-btn text color="white" tile>Сцены</v-btn>
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
    <router-link to="/gm/mission/builder">
      <v-btn v-if="$vuetify.breakpoint.lgAndUp" text color="white" tile>
        Создание миссий
      </v-btn>
    </router-link>
    <router-link to="/gm/mission/selector">
      <v-btn v-if="$vuetify.breakpoint.lgAndUp" text color="white" tile>
        Запуск миссий
      </v-btn>
    </router-link>
    <router-link to="/gm/mission">
      <v-btn v-if="!$vuetify.breakpoint.lgAndUp" text color="white" tile>
        Миссии
      </v-btn>
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'encounter-nav-mode',
})
</script>
