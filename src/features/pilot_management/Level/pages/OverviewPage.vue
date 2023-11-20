<template>
  <cc-stepper-content complete :exit="`/pilot/${pilot.ID}`" @complete="$emit('next')">
    <cc-title large>Поднятие уровня (Обзор)&emsp;</cc-title>
    <h2 class="heading">
      ЗАПРОС НА ПРИОБРЕТЕНИЕ ЛИЦЕНЗИИ МВ-2
      <cc-slashes />
      &nbsp;Обзор
    </h2>
    <div style="position: absolute; right: 16px; top: 16px">
      <cc-tooltip simple content="Функционал В Разработке">
        <v-btn small outlined disabled>Предложить улучшения</v-btn>
      </cc-tooltip>
    </div>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        Запрос на приобретение лицензии АДС IDENT МВ-2 был разработан, чтобы позволить активному 
        персоналу Союза регистрировать обновления лицензий во время развертывания и 
        немедленно получать ресурсы Союза и ДМС для поддержки на местах. Сотрудники Союза должны 
        подтвердить правильность отправленной формы у своего местного представителя Союза или, 
        в случае, если сотрудник недоступен, запросить проверку под руководством НЧЛ по защищенному 
        адресу омнинета
        <code>un_omni-18364.andes.cerrobonete.node:9</code>
      </span>
      <v-alert color="accent" outlined dense border="left" class="mt-2">
        <span class="overline">
          ЗАПРОС НЕСАНКЦИОНИРОВАННЫХ ОБНОВЛЕНИЙ ЛИЦЕНЗИИ И/ИЛИ ПОДАЧА ЗАЯВЛЕНИЙ НА НЕСАНКЦИОНИРОВАННЫЕ 
          ИЛИ РАНЕЕ ИМЕЕМЫЕ ЛИЦЕНЗИОННЫЕ ПРАВА БЕЗ ПРЕДВАРИТЕЛЬНОГО РАЗРЕШЕНИЯ МВ-8А/J АДМИНИСТРАТОРА СОЮЗА 
          ПРИВЕДЕТ К АВТОМАТИЧЕСКОМУ ОТКЛОНЕНИЮ ЗАЯВЛЕНИЯ НА ЛИЦЕНЗИРОВАНИЕ И МОЖЕТ ПРИВЕСТИ К ЛИЦЕНЗИОННОМУ 
          АУДИТУ ПОД DoJ/HR AR 716-J.
        </span>
      </v-alert>
    </v-container>
    <v-container class="flavor-text">
      <v-row justify="center">
        <v-col class="text-center">
          Служба IDENT АДС определила, что&nbsp;
          <div
            class="accent--text stat-text d-inline-block"
            style="position: relative; top: 10px; line-height: 10px;"
          >
            {{ pilot.Name }}
            <cc-slashes />
            "{{ pilot.Callsign }}"
            <br />
            <span class="overline subtle--text">{{ pilot.ID }}</span>
          </div>
          &nbsp;имеет право на следующее обновление лицензии:
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-card color="primary" outlined>
          <v-card-text>
            <v-row class="px-3">
              <v-col class="text-center" cols="auto">
                <span class="overline white--text">УРОВЕНЬ ЛИЦЕНЗИИ</span>
                <br />
                <span class="white--text display-4 font-weight-black">{{ pilot.Level }}</span>
              </v-col>
              <v-col cols="auto" class="flavor-text white--text px-4">
                <ul>
                  <li>УЛУЧШЕНИЕ ТРИГГЕРА ПИЛОТА</li>
                  <li>УЛУЧШЕНИЕ ТАЛАНТА ПИЛОТА</li>
                  <li>УЛУЧШЕНИЕ НАВЫКА МЕХОВ</li>
                  <li>УЛУЧШЕНИЕ СТОЙКОСТИ</li>
                  <li>РАЗБЛОКИРОВКА НОВОЙ ЛИЦЕНЗИИ</li>
                  <li v-if="cbEligible" class="font-weight-bolder">
                    УСТАНОВКА БОНУСА ЯДРА
                  </li>
                  <li v-else class="subtle--text">НЕ ПОДХОДИТ ДЛЯ БОНУСА ЯДРА</li>
                </ul>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'overview-page',
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
