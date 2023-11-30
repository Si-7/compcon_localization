<template>
  <div :class="`mt-2 ${$vuetify.breakpoint.mdAndDown ? 'text-center' : ''}`">
    <p class="heading mech mt-2">COMP/CON_RU</p>
    <div class="mx-2">
      C/C версия:
      <b class="accent--text">{{ $appVersion }}</b>
      // Версия LANCER CORE:
      <b class="accent--text">{{ $lancerVersion }}</b>
    </div>
    <v-divider class="mr-10 my-2" />
    <p class="body-text text-center">
      COMP/CON — это бесплатный цифровой набор инструментов с открытым исходным кодом 
      и помощник по игровому процессу для создания и запуска игр LANCER TTRPG. Книгу 
      LANCER CORE, COMP/CON, а также сопутствующие загрузки и расширения можно найти на сайте 
      <a target="_blank" href="https://rustablerpg.ru">rustablerpg.ru</a>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'about',
})
</script>