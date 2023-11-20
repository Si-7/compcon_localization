<template>
  <cc-stepper-content
    :complete="canContinue"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Улучшите Навык Мехов&emsp;</cc-title>
    <h2 class="heading">
      ЗАПРОС НА ПРИОБРЕТЕНИЕ ЛИЦЕНЗИИ МВ-2
      <cc-slashes />
      &nbsp;МВ-2//в Обновление Конфигурации Рамы
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Функционал В Разработке">
        <v-btn small outlined disabled>Предложить Навыки Мехов</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        После принятия Обновления Конфигурации Рамы МВ-2//в подсистема Союза IDENT//eng автоматически 
        обновит протоколы конфигурации кадра, хранящиеся в омнинет хранилище, зарегистрированном в 
        вашем профиле IDENT (V.node::/{{ pilot.ID }}). Чтобы обеспечить отправку 
        данных конфигурации по правильному адресу, любые изменения в данных узла хранилища необходимо отправлять 
        в службу IDENT, используя форму РМ-09-Д IDENT Дополнительная (д).
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <b>Улучшите Навык Мехов.</b>
        <br />
        <span class="overline">
          СОЮЗ И ЕГО ПРЕДСТАВИТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ЗА ПРОБЛЕМЫ, ВОЗНИКАЮЩИЕ ИЗ ВАРИАНТОВ 
          КОНФИГУРАЦИИ РАМЫ, ПРЕВЫШАЮЩИХ СПЕЦИФИКАЦИИ ПРОИЗВОДИТЕЛЯ. ПЕРЕД ВНЕДРЕНИЕМ ЛЮБОЙ НЕСТАНДАРТНОЙ 
          КОНФИГУРАЦИИ ЯДРА ПРОКОНСУЛЬТИРУЙТЕСЬ С ОФИЦИАЛЬНОЙ БАЗОЙ ДАННЫХ РАМ, ПРЕДОСТАВЛЕННОЙ ПРОИЗВОДИТЕЛЕМ.
        </span>
      </v-alert>
    </v-container>
    <cc-mech-skills-selector level-up :pilot="pilot" />
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'mech-skills-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.MechSkillsController.IsMissingHASE
    },
  },
})
</script>
