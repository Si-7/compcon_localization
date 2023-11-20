<template>
  <cc-stepper-content
    :complete="!pilot.LicenseController.IsMissingLicenses"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Разблокируйте Лицензию&emsp;</cc-title>
    <h2 class="heading">
      ЗАПРОС НА ПРИОБРЕТЕНИЕ ЛИЦЕНЗИИ МВ-2
      <cc-slashes />
      &nbsp;МВ-2//г Запись Передачи Лицензиар/Лицензиат
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Функционал В Разработке">
        <v-btn small outlined disabled>Предложить Лицензию</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        Запись Передачи Лицензиар/Лицензиат МВ-2 регистрирует передачу и получение признанной ДВФС 
        лицензии рамы, состоящей из, помимо прочего, шаблонов печати оборудования размером 
        не более 1,5 EB, шаблонов печати рамы размером не более 3,75 EB и протоколов доступа к 
        совместимому с рамой системному программному обеспечению.
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <b>Разблокируйте Лицензию.</b>
        <br />
        <span class="overline">
          СОЮЗ И ЕГО ПРЕДСТАВИТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ЗА ПРОБЛЕМЫ, ВОЗНИКАЮЩИЕ В РЕЗУЛЬТАТЕ 
          ПЕЧАТИ, УСТАНОВКИ И/ИЛИ ИСПОЛЬЗОВАНИЯ НЕПРИЗНАННЫХ ИЛИ ЗАПРЕЩЕННЫХ ЛИЦЕНЗИОННЫХ МАТЕРИАЛОВ.
        </span>
      </v-alert>
    </v-container>
    <cc-license-selector level-up :pilot="pilot" />
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'license-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
