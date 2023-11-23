<template>
  <cc-stepper-content
    :complete="pilot.HasIdent"
    :mandatory="!quickstart"
    exit="pilot_management"
    @complete="$emit('next')"
  >
    <cc-title large>Регистрация Нового Пилота&emsp;</cc-title>
    <div v-show="$vuetify.breakpoint.mdAndUp">
      <h2 class="heading">
        Служба IDENT АДС
        <cc-slashes />
        &nbsp;Персонал РМ-4::Пилот (C)
      </h2>
      <v-container class="flavor-text" style="font-size: 14px">
        <div class="mt-n2">
          Добро пожаловать в службу регистрации IDENT Административного отдела Союза. IDENT — это система сертификации 
          на базе омнинета, которая помогает пользователю пройти процедуру пилотной регистрации АДС. IDENT помогает 
          гарантировать соответствие пилотных проектов нормативным и политическим требованиям посредством использования 
          протоколов проверки данных, разработанных НЧЛ. Регулярные сотрудники Союза, которым уже был выдан отпечаток пальца 
          РМ-4 IDENT, не должны заполнять эту форму без указания своего командира.
        </div>
        <v-alert type="warning" color="accent" outlined class="mt-2" dense prominent>
          <b>
            Все поля, отмеченные символом
            <v-icon color="error">mdi-alert</v-icon>
            , должны быть заполнены.
          </b>
          <div class="overline" style="line-height: 13px">
            Отправляя эту форму, вы подтверждаете, что ваши ответы являются правдивыми и точными, насколько вам известно. 
            Заведомое предоставление ложной или неполной информации наказывается в соответствии с DOJ/HR AR 303-J.
          </div>
        </v-alert>
      </v-container>
    </div>
    <v-row :class="$vuetify.breakpoint.mdAndUp ? 'mx-6' : ''">
      <v-col cols="12" md="5" class="mr-auto">
        <span v-if="$vuetify.breakpoint.mdAndUp" class="overline">
          РМ-4-01 // ПОЛНОЕ ИМЯ ИЛИ ОСНОВНОЙ Псевдоним
        </span>
        <v-text-field
          v-model="pilot.Name"
          outlined
          label="Имя"
          hide-details
          class="my-1"
          @change="$emit('set', { attr: 'Name', val: $event })"
        >
          <template v-slot:prepend>
            <cc-tooltip simple content="Сгенерировать случайное имя">
              <v-icon color="secondary" @click="randomName()">mdi-dice-multiple</v-icon>
            </cc-tooltip>
          </template>
          <template v-slot:append-outer>
            <v-icon v-if="!pilot.Name" color="error">mdi-alert</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>

        <span v-if="$vuetify.breakpoint.mdAndUp" class="overline">
          РМ-4-02 // УТВЕРЖДЕННЫЙ ПОЗЫВНОЙ (ИЛИ ОБОЗНАЧЕНИЕ КАДЕТА, ЕСЛИ ПРИМЕНИМО)
        </span>
        <v-text-field v-model="pilot.Callsign" outlined label="Позывной" hide-details class="my-1">
          <template v-slot:prepend>
            <cc-tooltip simple content="Сгенерировать случайный позывной">
              <v-icon color="secondary" @click="randomCallsign()">mdi-dice-multiple</v-icon>
            </cc-tooltip>
          </template>
          <template v-slot:append-outer>
            <v-icon v-if="!pilot.Callsign" color="error">mdi-alert</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>

        <span v-if="$vuetify.breakpoint.mdAndUp" class="overline">
          РМ-4-03 // ПРЕДЫДУЩАЯ ПРОФЕССИЯ ИЛИ ДОЛЖНОСТЬ (ОТВЕТ 17b НА РМ-2-C)
        </span>
        <v-text-field
          v-model="pilot.Background"
          outlined
          label="Предыстория"
          hide-details
          class="my-1"
        >
          <template v-slot:prepend>
            <cc-tooltip simple content="Выбрать готовую предысторию">
              <cc-background-selector @select="$emit('set', { attr: 'Background', val: $event })" />
            </cc-tooltip>
          </template>
          <template v-slot:append-outer>
            <v-icon v-if="!pilot.Background" color="grey">mdi-circle-outline</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>

        <span v-if="$vuetify.breakpoint.mdAndUp" class="overline">
          РМ-4-04 // ПРИЛОЖЕННОЕ БИОГРАФИЧЕСКОЕ ДОСЬЕ РМ-4b ДОПОЛНИТЕЛЬНОЕ
        </span>
        <text-entry-popup
          label="Биография Пилота"
          :prepopulate="pilot.History"
          @save="$emit('set', { attr: 'History', val: $event })"
        >
          <span v-if="!pilot.History">
            <v-icon left>mdi-plus</v-icon>
            Добавить Биографию Пилота
          </span>
          <span v-else>
            <v-icon left>mdi-circle-edit-outline</v-icon>
            Редактировать Биографию Пилота
          </span>
          <div style="position: absolute; right: -53px">
            <v-icon v-if="!pilot.History" color="grey">mdi-circle-outline</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </div>
        </text-entry-popup>

        <span v-if="$vuetify.breakpoint.mdAndUp" class="overline">
          РМ-4-05 // ПРИЛОЖЕННЫЕ РЕЗУЛЬТАТЫ ОБСЛЕДОВАНИЯ ЗДОРОВЬЯ OHM
        </span>
        <text-entry-popup
          label="Описание Пилота"
          :prepopulate="pilot.TextAppearance"
          @save="$emit('set', { attr: 'TextAppearance', val: $event })"
        >
          <span v-if="!pilot.TextAppearance">
            <v-icon left>mdi-plus</v-icon>
            Добавить Описание Пилота
          </span>
          <span v-else>
            <v-icon left>mdi-circle-edit-outline</v-icon>
            Edit Pilot Description
          </span>
          <div style="position: absolute; right: -53px">
            <v-icon v-if="!pilot.TextAppearance" color="grey">mdi-circle-outline</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </div>
        </text-entry-popup>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="1" class="ml-auto mr-auto text-center">
        <v-divider vertical />
      </v-col>
      <v-col cols="12" md="5" class="ml-auto">
        <span v-if="$vuetify.breakpoint.mdAndUp" class="overline">
          РМ-4-06 // ПРИЛОЖЕННОЕ СКАНИРОВАНИЕ OHM (ДОЛЖНО ВКЛЮЧАТЬ ДАННЫЕ СЕТЧАТКИ)
        </span>
        <div class="border mr-8 ml-auto mr-auto" style="width: 300px; height: 300px">
          <v-img
            v-if="pilot.Portrait"
            :key="pilot.PortraitController.Image"
            :src="pilot.Portrait"
            aspect-ratio="1"
          />
        </div>
        <div class="mr-8 mt-3">
          <v-btn outlined large block color="secondary" @click="$refs.imageSelector.open()">
            <span v-if="!pilot.Portrait">
              <v-icon left>mdi-plus</v-icon>
              Добавить Изображение Пилота
            </span>
            <span v-else>
              <v-icon left>mdi-circle-edit-outline</v-icon>
              Редактировать Изображение Пилота
            </span>
            <div style="position: absolute; right: -53px">
              <v-icon v-if="!pilot.Portrait" color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </div>
          </v-btn>
          <cc-image-selector-web ref="imageSelector" :item="pilot" type="pilot" />
        </div>
      </v-col>
    </v-row>
    <div slot="other" class="text-center">
      <v-btn color="accent" class="mx-2" large @click="$emit('templates')">
        Выбрать Шаблон Персонажа
      </v-btn>
      <div class="overline stark--text">Рекомендовано Для Новых Игроков</div>
    </div>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { name, callsign } from '@/io/Generators'
import TextEntryPopup from './components/TextEntryPopup.vue'

export default Vue.extend({
  name: 'identification-page',
  components: { TextEntryPopup },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    quickstart: { type: Boolean },
  },

  methods: {
    randomCallsign() {
      this.$emit('set', { attr: 'Callsign', val: callsign() })
      this.$forceUpdate()
    },
    async randomName() {
      const generatedName = await name()
      this.$emit('set', { attr: 'Name', val: generatedName })
      this.$forceUpdate()
    },
  },
})
</script>
