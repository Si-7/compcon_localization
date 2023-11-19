<template>
  <cc-stepper-content
    :complete="canContinue"
    :mandatory="!quickstart"
    exit="pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>ТРИГГЕРЫ ПИЛОТА&emsp;</cc-title>
    <div v-show="$vuetify.breakpoint.mdAndUp">
      <h2 class="heading">
        Служба IDENT АДС
        <cc-slashes />
        &nbsp;РМ-4б Самостоятельная Оценка Пилота (1/3)
      </h2>
      <div style="position: absolute; right: 16px; top: 16px">
        <cc-tooltip simple content="Функционал В Разработке">
          <v-btn small outlined disabled>Предложить Триггеры</v-btn>
        </cc-tooltip>
      </div>
      <v-container class="flavor-text" style="font-size: 14px">
        <div class="mt-n2">
          Аудит Самостоятельной Оценки Пилота (Триггеры) РМ-4b каталогизирует сильные стороны отдельного пилота, 
          о которых он сам сообщил, на основе выборки, полученной в результате обследования 
          здоровья OHM//CR-2 Сканирования Мозговой Активности и ответов, предоставленных НЧЛ-представителю председательствующего 
          Администратора Союза.
          <br />
        </div>
        <v-alert type="warning" color="accent" outlined class="mt-2" dense prominent>
          <b>Выберите 4 (четыре) Триггера.</b>
          <br />
          <div class="overline" style="line-height: 13px">
            Отправляя эту форму, вы подтверждаете, что ваши ответы правдивы и точны, насколько 
            вам известно. Сознательное предоставление ложной или неполной информации карается 
            согласно DoJ/HR AR 303-J.
          </div>
        </v-alert>
      </v-container>
    </div>
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
    quickstart: { type: Boolean },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.SkillsController.IsMissingSkills
    },
  },
})
</script>
