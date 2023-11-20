<template>
  <cc-stepper-content
    :complete="canContinue"
    :exit="`/pilot/${pilot.ID}`"
    back
    @back="$emit('back')"
    @complete="$emit('next')"
  >
    <cc-title large>Улучшите Таланты&emsp;</cc-title>
    <h2 class="heading">
      ЗАПРОС НА ПРИОБРЕТЕНИЕ ЛИЦЕНЗИИ МВ-2
      <cc-slashes />
      &nbsp;МВ-2//б Заявка Ресурсов СБД
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Функционал В Разработке">
        <v-btn small outlined disabled>Предложить Таланты</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        Заявка ресурсов способности к боевым действиям после утверждения автоматизированной системы утверждения 
        запросов под руководством НЧЛ предоставляет права на тренажеры, учебные материалы по голополю 
        и кортикальным сенсориумам, данные телеметрии поля боя по классификации ниже GREY SIERRA SHARP и 
        (в определенных случаях) лицензии ДМС-ПМ.
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <b>Добавьте или Улучшите талант.</b>
        <br />
        <span class="overline">
          Отправляя эту форму, вы признаете свою ответственность за предотвращение несанкционированного 
          раскрытия информации, гарантируя, что все учебные материалы, данные полевых отчетов и шаблоны 
          для печати всегда сохраняются и передаются под NDL-DISCORDANT//BREATH ИЛИ БОЛЕЕ БЕЗОПАСНЫМ ПРОТОКОЛОМ ШИФРОВАНИЯ КЛАССА NDL-DISCORDANT. 
          ВОСПРОИЗВЕДЕНИЕ, ИЗВЛЕЧЕНИЕ И ПЕРЕДАЧА ЭТИХ МАТЕРИАЛОВ 
          ПОЛНОСТЬЮ ИЛИ ЧАСТИЧНО ЗАПРЕЩЕНЫ БЕЗ ПРЯМОГО РАЗРЕШЕНИЯ ДВФС.
        </span>
      </v-alert>
    </v-container>
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
  },
  computed: {
    canContinue(): boolean {
      return !this.pilot.TalentsController.IsMissingTalents
    },
  },
})
</script>
