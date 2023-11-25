<template>
  <div>
    <v-row class="my-2" justify="center">
      <v-col cols="4">
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/wiki/Frequently-Asked-Questions"
          x-large
          block
          color="secondary"
          class="white--text"
          tabindex="0"
        >
          Часто Задаваемые Вопросы
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/wiki/Troubleshooting-Issues"
          x-large
          block
          color="secondary"
          class="white--text"
          tabindex="0"
        >
        Поиск неисправностей
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/Si-7/compcon_rus/issues/new/choose"
          x-large
          block
          color="error"
          class="white--text"
          tabindex="0"
        >
        Сообщить об ошибке/предложить функцию
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/discussions"
          x-large
          block
          color="error"
          class="white--text"
        >
          Форум обсуждения
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki"
          x-large
          block
          color="error"
          class="white--text"
        >
          Вики проекта
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="text-center">
        Настоятельно рекомендуется добавлять проблему непосредственно в репозиторий GitHub, 
        чтобы мы могли задавать вопросы, а вы могли отслеживать прогресс проблемы.
      </v-col>
    </v-row>
    <!-- <h3 class="heading accent--text">Tutorial Mode</h3>
    <p class="panel py-3 text-center subtle--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
    <h3 class="heading accent--text mt-4">Быстрое FAQ</h3>
    <div class="body-text text--text">
      <b>Где НПС?</b>
      <p>
        Теперь, когда LANCER официально выпущен, COMP/CON отражает структуру Core Book с точки 
        зрения платного/бесплатного контента. Если вы купили LANCER Core Book, вы найдете загружаемый 
        пакет данных, содержащий все основные данные NPC, на странице itch.io LANCER Core Book, доступ 
        к которой вы можете получить, перейдя в Менеджер контента на главной странице или в навигационной панели и 
        выберите элемент «Основная книга» на вкладке «Каталог LCP». Вы можете использовать вкладку «Установка LCP» 
        в Content Manager, чтобы импортировать пакет и начать создавать и запускать встречи.
      </p>
      <b>Могу ли я импортировать пилота COMP/CON в Roll20?</b>
      <p>В настоящее время Roll20 не поддерживает импорт из COMP/CON.</p>
    </div>

    <!-- <h3 class="heading accent--text">Video Guide</h3>
    <p class="panel py-3 text-center subtle--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'help-page',
})
</script>
