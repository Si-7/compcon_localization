<template>
  <div :class="`mt-2 ${$vuetify.breakpoint.mdAndDown ? 'text-center' : ''}`">
    <p class="heading mech mt-2">COMP/CON</p>
    <div class="mx-2">
      C/C версия:
      <b class="accent--text">{{ $appVersion }}</b>
      // Версия LANCER CORE:
      <b class="accent--text">{{ $lancerVersion }}</b>
    </div>
    <p align="center" class="my-2">
      <a href="https://app.netlify.com/sites/compcon/deploys">
        <img
          alt="Статус Netlify"
          src="https://api.netlify.com/api/v1/badges/8c8ba126-8074-4a99-98f9-9b0529107214/deploy-status"
        />
      </a>
      <a href="https://discord.gg/rwcpzsU">
        <img
          src="https://img.shields.io/badge/discord-%23compcon-7289DA?logo=discord&logoColor=white"
          alt="Происоединиться к дискорду LANCER"
        />
      </a>
      <br />
      <a href="https://patreon.com/compcon">
        <img
          src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dcompcon%26type%3Dpatrons&style=for-the-badge"
          alt="Поддержать COMP/CON на Patreon"
        />
      </a>
    </p>
    <v-divider class="mr-10 my-2" />
    <p class="body-text text-center">
      COMP/CON — это бесплатный цифровой набор инструментов с открытым исходным кодом 
      и помощник по игровому процессу для создания и запуска игр LANCER TTRPG. Книгу 
      LANCER CORE, COMP/CON, а также сопутствующие загрузки и расширения можно найти на сайте 
      <a target="_blank" href="http://www.massifpress.com">massifpress.com</a>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'about',
})
</script>