<template>
  <div>
    <router-link to="/gm">
      <v-btn text color="white" tile>ИНСТРУМЕНТАРИЙ</v-btn>
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
    <router-link to="/pilot_management">
      <v-btn text color="white" tile>Список Пилотов</v-btn>
    </router-link>
    <v-divider vertical dark class="ml-2 mr-2" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'compendium-nav-mode',
})
</script>
