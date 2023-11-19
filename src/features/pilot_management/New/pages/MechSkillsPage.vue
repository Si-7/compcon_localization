<template>
  <cc-stepper-content
    :complete="canContinue"
    :mandatory="!quickstart"
    exit="pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Навыки Мехов&emsp;</cc-title>
    <div v-show="$vuetify.breakpoint.mdAndUp">
      <h2 class="heading">
        Служба IDENT АДС
        <cc-slashes />
        &nbsp;РМ-4Г САМОСТОЯТЕЛЬНАЯ ОЦЕНКА ПИЛОТА (3/3)
      </h2>
      <div style="position: absolute; right: 16px; top: 16px">
        <cc-tooltip simple content="Функционал В Разработке">
          <v-btn small outlined disabled>Предложить навыки мехов</v-btn>
        </cc-tooltip>
      </div>
      <v-container class="flavor-text" style="font-size: 14px">
        <div class="mt-n2">
          САМОСТОЯТЕЛЬНАЯ ОЦЕНКА ПИЛОТА РМ-4Г (навыки мехов) будет передана сотрудникам  
          для завершения настройки выданного вам ДМС-СМ1 ЭВЕРЕСТ. Эти данные конфигурации будут 
          отправлены в ваше личное омнинет хранилище после проверки и принятия формы РМ-4 вместе 
          с выдачей вашего идентификационного отпечатка пальца, который затем может быть применен 
          к любой будущей раме(ам) по вашему усмотрению.
        </div>
        <v-alert type="warning" color="accent" outlined class="mt-2" dense prominent>
          <b>Распределите два (2) очка Навыков Мехов.</b>
          <br />
          <div class="overline" style="line-height: 13px">
            Отправляя эту форму, вы подтверждаете, что ваши ответы являются правдивыми и точными, 
            насколько вам известно. Заведомое предоставление ложной или неполной информации наказывается 
            в соответствии с DOJ/HR AR 303-J.
          </div>
        </v-alert>
      </v-container>
    </div>
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
    quickstart: { type: Boolean },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.MechSkillsController.IsMissingHASE
    },
  },
})
</script>
