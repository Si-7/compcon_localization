<template>
  <cc-stepper-content
    :complete="canContinue"
    :mandatory="!quickstart"
    exit="pilot_management"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>ТАЛАНТЫ ПИЛОТА&emsp;</cc-title>
    <div v-show="$vuetify.breakpoint.mdAndUp">
      <h2 class="heading">
        Служба IDENT АДС
        <cc-slashes />
        &nbsp;РМ-4В САМОСТОЯТЕЛЬНАЯ ОЦЕНКА ПИЛОТА (2/3)
      </h2>
      <div style="position: absolute; right: 16px; top: 16px">
        <cc-tooltip simple content="Feature In Development">
          <v-btn small outlined disabled>Suggest Talents</v-btn>
        </cc-tooltip>
      </div>
      <v-container class="flavor-text" style="font-size: 14px">
        <div class="mt-n2">
          Аудит САМОСТОЯТЕЛЬНОЙ ОЦЕНКИ ПИЛОТА (Таланты) РМ-4В каталогизирует способности к боевым действиям, 
          о которых сообщает сам пилот, и дает право на использование тренажеров, 
          обучающих материалов холополя и кортикального сенсориума, данных телеметрии поля боя 
          с классификацией ниже GREY SIERRA SHARP и (в частных случаях) лицензии на технику 
          GMS ММ-образца. Дополнительные ресурсы могут быть предоставлены по вашему запросу в 
          ходе полевых операций.
        </div>
        <v-alert type="warning" color="accent" outlined class="mt-2" dense prominent>
          <b>Выберите три (3) таланта пилота.</b>
          <br />
          <div class="overline" style="line-height: 13px">
            Отправляя эту форму, вы подтверждаете, что ваши ответы являются правдивыми и точными, 
            насколько вам известно. Заведомое предоставление ложной или неполной информации наказывается 
            в соответствии с DOJ/HR AR 303-J.
          </div>
        </v-alert>
      </v-container>
    </div>
    <cc-talent-selector level-up :pilot="pilot" />
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'talents-page',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    quickstart: { type: Boolean },
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.TalentsController.IsMissingTalents
    },
  },
})
</script>
