<template>
  <cc-stepper-content
    :complete="!pilot.CoreBonusController.IsMissingCBs"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Добавить Бонус Ядра&emsp;</cc-title>
    <h2 class="heading">
      ЗАПРОС НА ПРИОБРЕТЕНИЕ ЛИЦЕНЗИИ МВ-2
      <cc-slashes />
      &nbsp;МВ-2(а) ЯДРО Дополнительный
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Функционал В Разработке">
        <v-btn small outlined disabled>Предложить Бонус ядра</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        Дополнительный запрос МВ-2(а) регистрирует значительную модификацию, модернизацию, 
        модификацию или усовершенствование Ядра. Совет разведки ДВФС, совет 
        по лицензированию ДВФС, совет по защите пилотов АДС 
        и подкомитет по этической инженерии ДЮ/ПЧС признают усиление Ядра только от одобренного и зарегистрированного Союзом лицензиара.
      </span>
      <v-alert v-if="cbEligible" color="accent" outlined dense border="left" class="mt-2">
        <b>Выберите Бонус Ядра</b>
        <br />
        <span class="overline">
          Внедрение протоколов расширения Ядра от непризнанного, запрещенного 
          или незарегистрированного Лицензиара или Лицензиаров возлагает на 
          эксплуатационного пилота ответственность за любой и весь ущерб, возникший 
          в результате неисправности Ядра, вплоть до расплавления реактора.
        </span>
      </v-alert>
    </v-container>
    <cc-core-bonus-selector v-if="cbEligible" level-up :pilot="pilot" />
    <v-card v-else flat tile color="panel">
      <v-card-text class="flavor-text text-center py-5 px-3">
        <span class="heading h2 subtle--text text--darken-1">Пилот не имеет права на бонус ядра</span>
        <br />
        <span class="subtle--text text--darken-2">
          СЛЕДУЮЩИЙ БОНУС ЯДРА ЧЕРЕЗ {{ 3 - (pilot.Level % 3) }} УЛ
        </span>
      </v-card-text>
    </v-card>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'core-bonus-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    cbEligible: {
      type: Boolean,
    },
  },
})
</script>
