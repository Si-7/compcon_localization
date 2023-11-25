<template>
  <div>
    <h3 class="heading accent--text">Опции пользователя</h3>
    <v-row dense>
      <v-col md="12" lg="6" class="mr-3">
        <div class="flavor-text">
          <b>ID пользователя:</b>
          <span class="accent--text">
            {{ userID }}
          </span>
        </div>
        <v-divider />
        <div class="text-center">
          <div>
            <v-btn large block color="info" class="my-1" @click="reload">
              Установить обновления и перезагрузить
            </v-btn>
            <v-btn block color="accent" class="my-1" @click="showMessage()">
              Показать последние сообщения обновления
            </v-btn>
            <v-divider class="my-2" />
          </div>
          <div class="text-center my-2">
            <v-btn block large color="primary" @click="bulkExport">
              <v-icon left>mdi-database</v-icon>
              Создать бэкап данных
              <cc-tooltip
                inline
                content="COMP/CON использует ваш браузер для сохранения и загрузки своих данных. Настройки, утилиты и другие приложения могут стереть локальный кэш вашего браузера, что приведет к потере ваших данных COMP/CON. <b>Настоятельно</b> рекомендуется часто выполнять резервное копирование данных."
              >
                <v-icon right class="fadeSelect">mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </v-btn>
          </div>
          <div class="text-center my-2">
            <v-dialog v-model="importDialog" width="50%">
              <template v-slot:activator="{ on }">
                <v-btn block large color="primary" v-on="on">
                  <v-icon left>mdi-database-refresh</v-icon>
                  Загрузить бэкап данных
                  <cc-tooltip
                    inline
                    content="COMP/CON использует ваш браузер для сохранения и загрузки своих данных. Настройки, утилиты и другие приложения могут стереть локальный кэш вашего браузера, что приведет к потере ваших данных COMP/CON. <b>Настоятельно</b> рекомендуется часто выполнять резервное копирование данных."
                  >
                    <v-icon right class="fadeSelect">mdi-help-circle-outline</v-icon>
                  </cc-tooltip>
                </v-btn>
              </template>
              <v-card>
                <v-card-text class="pa-6">
                  <p class="text-center heading h3 text--text">
                    Это ПЕРЕПИШЕТ
                  <b class="accent--text">ВСЕ</b>
                  локальные данные COMP/CON.
                  <br />
                  Это
                  <b class="accent--text">нельзя</b>
                  отменить.
                  </p>
                  <v-file-input
                    v-model="fileValue"
                    accept=".compcon"
                    outlined
                    dense
                    hide-details
                    autofocus
                    placeholder="Выберите файл массового экспорта COMP/CON"
                    prepend-icon="mdi-paperclip"
                    @change="bulkImport"
                  />
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
          <v-divider class="my-3" />
          <v-dialog v-model="deleteDialog" width="80%">
            <template v-slot:activator="{ on }">
              <v-btn small block color="error" class="my-1" v-on="on">
                <v-icon left v-html="'mdi-alert'" />
                Удалить все пользовательские данные
                <v-icon right v-html="'mdi-alert'" />
              </v-btn>
            </template>
            <v-card flat tile>
              <v-card-text>
                <v-alert
                  prominent
                  dark
                  color="error"
                  icon="mdi-alert-circle"
                  border="bottom"
                  class="my-3"
                >
                  <span class="heading h2">ПРЕДУПРЕЖДЕНИЕ // ПРЕДУПРЕЖДЕНИЕ // ПРЕДУПРЕЖДЕНИЕ</span>
                </v-alert>
                <p class="text-center heading h2 text--text">
                  Это УДАЛИТ
                  <b class="accent--text">ВСЕ</b>
                  локальные данные COMP/CON.
                  <br />
                  Это
                  <b class="accent--text">нельзя</b>
                  отменить.
                  <br />
                  <br />
                  <b class="accent--text">Вы уверены, что хотите продолжить?</b>
                </p>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn color="secondary" text large @click="deleteDialog = false">Закрыть</v-btn>
                <v-spacer />
                <v-btn color="error" text @click="deleteAll">
                  <v-icon left v-html="'mdi-alert'" />
                  Удалить все пользовательские данные
                  <v-icon right v-html="'mdi-alert'" />
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
      <v-col>
        <h3 class="heading accent--text mb-n2">Расширенные настройки</h3>
        <v-switch v-model="userSaveStrategy" color="secondary" inset dense hide-details>
          <span slot="label">
            Включить производительное сохранение
            <cc-tooltip
              title="Стратегия сохранения"
              :content="`COMP/CON пытается записать изменения в ваши данные сохранения каждый раз, когда изменяется значение. В некоторых системах это может привести к снижению производительности приложения. Включение производительного сохранения ограничивает сохранение данных событиями навигации по страницам и выхода из браузера, повышая производительность за счет надежности сохранения. Этот вариант лучше всего работает в браузерах Chrome.`"
              inline
            >
              <v-icon>mdi-information-outline</v-icon>
            </cc-tooltip>
          </span>
        </v-switch>
        <v-switch v-model="userViewExotics" color="exotic" inset dense hide-details>
          <span slot="label">
            Показывать экзотические предметы в компендиуме
            <cc-tooltip
              title="ОСТОРОЖНО, СПОЙЛЕРЫ"
              content="Включение этой опции может раскрыть спойлеры кампании, поэтому рекомендуется оставить эту настройку ВЫКЛЮЧЕННОЙ, если вы не являетесь ГМом."
              inline
            >
              <v-icon color="warning">mdi-alert</v-icon>
            </cc-tooltip>
          </span>
        </v-switch>
        <v-switch v-model="userAllowQuickstart" color="exotic" inset dense hide-details>
          <span slot="label">Включить быстрое создание пилотов и повышение уровня</span>
        </v-switch>
        <h3 class="heading accent--text mt-2">Тема</h3>
        <v-select v-model="theme" dense outlined :items="themes" item-text="name" />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <h3 class="heading accent--text">Удаленные элементы (только локальные данные)</h3>
    <deleted-items />

    <v-divider class="my-4" />

    <h3 class="heading accent--text">Достижения</h3>
    <p class="panel py-3 text-center subtle--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // ФУНКЦИОНАЛ В РАЗРАБОТКЕ //
    </p>

    <div class="text-right">
      <router-link to="./ui-test">
        <v-btn small text>UI Test</v-btn>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import allThemes from '@/ui/style/themes'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { exportAll, importAll, clearAllData } from '@/io/BulkData'
import { saveFile } from '@/io/Dialog'
import DeletedItems from './DeletedItems.vue'
import { SetTheme } from '@/classes/utility/ThemeManager'

export default Vue.extend({
  name: 'options-settings',
  components: { DeletedItems },
  data: () => ({
    themes: [],
    importDialog: false,
    fileValue: null,
    deleteDialog: false,
  }),
  computed: {
    user() {
      const store = getModule(UserStore, this.$store)
      return store.UserProfile
    },
    userViewExotics: {
      get: function () {
        return this.user.GetView('showExotics')
      },
      set: function (newval) {
        this.user.SetView('showExotics', newval)
      },
    },
    userAllowQuickstart: {
      get: function () {
        return this.user.GetView('quickstart')
      },
      set: function (newval) {
        this.user.SetView('quickstart', newval)
      },
    },
    userSaveStrategy: {
      get: function () {
        return this.user.GetView('savePerformant')
      },
      set: function (newval) {
        this.user.SetView('savePerformant', newval)
      },
    },
    theme: {
      get: function () {
        return this.user.Theme
      },
      set: function (newval) {
        this.user.Theme = newval
        SetTheme(this.theme, this.$vuetify)
      },
    },
    userID() {
      return this.user.id
    },
    userTheme() {
      return this.user.Theme
    },
  },
  created() {
    for (const k in allThemes) {
      const e = allThemes[k]
      this.themes.push({ name: e.name, value: e.id })
    }
  },
  methods: {
    reload() {
      location.reload()
    },
    showMessage() {
      const store = getModule(UserStore, this.$store)
      store.UserProfile.WelcomeHash = ''
      localStorage.removeItem('cc-welcome-hash')
      this.reload()
    },
    async bulkExport() {
      const result = await exportAll()
      await saveFile(
        `CC_${new Date().toISOString().slice(0, 10)}.compcon`,
        JSON.stringify(result),
        'Save COMP/CON Archive'
      )
    },
    async bulkImport(file) {
      await importAll(file)
        .then(() => this.$notify('Data import successful', 'confirmation'))
        .catch(err => this.$notify(`ERROR: Unable to import: ${err}`, 'error'))
      this.importDialog = false
    },
    async deleteAll() {
      await clearAllData(false)
      this.deleteDialog = false
    },
  },
})
</script>
