<template>
  <cc-stepper-content
    :complete="canContinue"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Улучшите Триггеры&emsp;</cc-title>
    <h2 class="heading">
      ЗАПРОС НА ПРИОБРЕТЕНИЕ ЛИЦЕНЗИИ МВ-2
      <cc-slashes />
      &nbsp;МВ-2//a Оценка Совершенствования Навыков
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Функционал В Разработке">
        <v-btn small outlined disabled>Предложить Триггеры</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        Аудит самостоятельной оценки пилота МВ2//a каталогизирует сильные стороны отдельного пилота, 
        о которых он сам сообщил, на основе выбора, полученного с помощью телеметрии поля 
        боя и записей подведения итогов, проанализированных НЧЛ-представителем ДВФС Союза.
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <b>Добавьте или Улучшите триггер.</b>
        <br />
        <span class="overline">
          Отправляя эту форму, вы подтверждаете, что ваши ответы являются правдивыми и точными, 
          насколько вам известно. Заведомое предоставление ложной или неполной информации наказывается 
          в соответствии с DOJ/HR AR 303-J.
        </span>
      </v-alert>
    </v-container>
    <cc-skill-selector level-up :pilot="pilot" />
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'skills-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.SkillsController.IsMissingSkills
    },
  },
})
</script>
