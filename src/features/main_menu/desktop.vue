<template>
  <div id="wrapper">
    <main-title @logupdate="ccLog('update')" />
    <c-c-log v-show="$vuetify.breakpoint.mdAndUp" ref="log" />
    <v-container style="height: calc(100vh - 135px)">
      <v-row justify="space-between" style="height: 100%">
        <main-btn
          icon="cci-compendium"
          :to="'/compendium'"
          help="База данных снаряжения"
          @hover="ccLog('compendium')"
        >
          Компендиум
        </main-btn>
        <main-btn
          icon="cci-pilot"
          :to="'/pilot_management'"
          help="Управление пилотами"
          @hover="ccLog('pilot')"
        >
          Список пилотов
        </main-btn>
        <main-btn
          icon="cci-encounter"
          :to="'/gm'"
          help="Управление НИПами/Встречами/Миссиями"
          @hover="ccLog('gm')"
        >
          Инструментарий
        </main-btn>
        <main-btn
          icon="cci-content-manager"
          help="Импорт пакетов материалов"
          @hover="ccLog('content')"
          @clicked="$refs.contentModal.show()"
        >
          Материалы
          <cc-tooltip
            v-if="missingContent"
            inline
            title="Незагружаемый контент замечен"
            content="COMP/CON один или больше предметов, которым не хватает данных LCP паков. Эти проблемы можно решить в Материалах."
          >
            <v-avatar color="white"><v-icon color="error" large>mdi-folder-off</v-icon></v-avatar>
          </cc-tooltip>
        </main-btn>
      </v-row>
    </v-container>

    <v-footer color="primary" fixed>
      <v-row no-gutters justify="space-around" align="center">
        <v-col cols="auto" class="text-center mr-3">
          <v-btn small light elevation="0" class="pulse" @click="$refs.loginModal.show()">
            <v-icon left>
              {{ userstore.IsLoggedIn ? 'cci-pilot' : 'mdi-account-off-outline' }}
            </v-icon>
            <span>{{ userstore.IsLoggedIn ? 'Подключено' : 'Войти' }}</span>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="ml-1 mr-3"><v-divider vertical class="d-inline" /></v-col>
        <v-col cols="auto" class="text-center mr-3">
          <v-btn small dark outlined @click="bulkExport">
            <v-icon left>mdi-database</v-icon>
            Создать бэкап данных
            <cc-tooltip
              inline
              content="COMP/CON использует ваш браузер для сохранения и загрузки своих данных. Настройки, утилиты и другие приложения могут стереть локальный кэш вашего браузера, что приведет к потере ваших данных COMP/CON. Настоятельно рекомендуется часто выполнять резервное копирование данных."
            >
              <v-icon right class="fadeSelect">mdi-help-circle-outline</v-icon>
            </cc-tooltip>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="text-center">
          <v-dialog v-model="importDialog" width="50%">
            <template v-slot:activator="{ on }">
              <v-btn small dark outlined v-on="on">
                <v-icon left>mdi-database-refresh</v-icon>
                Загрузить бэкап данных
                <cc-tooltip
                  inline
                  content="COMP/CON использует ваш браузер для сохранения и загрузки своих данных. Настройки, утилиты и другие приложения могут стереть локальный кэш вашего браузера, что приведет к потере ваших данных COMP/CON. Настоятельно рекомендуется часто выполнять резервное копирование данных."
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
        </v-col>

        <v-col cols="auto" class="ml-auto text-right">
          <v-row no-gutters justify="space-between">
            <v-col cols="auto">
              <v-btn
                small
                dark
                text
                @mouseenter="ccLog('options')"
                @click="$refs.optionsModal.show()"
              >
                Опции
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn small dark text @mouseenter="ccLog('about')" @click="$refs.aboutModal.show()">
                О сайте
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn
                small
                dark
                text
                @mouseenter="ccLog('about')"
                @click="$refs.creditsModal.show()"
              >
                Авторы
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn small dark text @mouseenter="ccLog('help')" @click="$refs.helpModal.show()">
                Помощь
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
    <cc-solo-dialog ref="loginModal" large no-confirm title="ОБЛАЧНЫЙ АККАУНТ">
      <sign-in />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="optionsModal"
      large
      no-confirm
      no-pad
      no-title-clip
      title="Опции & Профиль пользователя"
    >
      <options-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="aboutModal" large no-confirm title="О сайте"><about-page /></cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Помощь"><help-page /></cc-solo-dialog>
    <cc-solo-dialog ref="creditsModal" fullscreen no-confirm title="Авторы">
      <credits-page />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="contentModal"
      no-title-clip
      no-pad
      large
      no-confirm
      title="Управлять паками контента"
    >
      <content-page />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { exportAll, importAll } from '@/io/BulkData'
import { saveFile } from '@/io/Dialog'
import MainTitle from './_components/MainTitle.vue'
import MainBtn from './_components/MainBtn.vue'
import CCLog from './_components/CCLog.vue'
import SignIn from './_components/login/index.vue'
import ContentPage from '../nav/pages/ExtraContent/index.vue'
import AboutPage from '../nav/pages/About.vue'
import CreditsPage from '../nav/pages/Credits.vue'
import HelpPage from '../nav/pages/Help.vue'
import OptionsPage from '../nav/pages/Options/index.vue'
import { UserStore, CompendiumStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

export default Vue.extend({
  name: 'landing-page',
  components: {
    MainTitle,
    MainBtn,
    CCLog,
    ContentPage,
    CreditsPage,
    AboutPage,
    HelpPage,
    OptionsPage,
    SignIn,
  },
  data: () => ({
    importDialog: false,
    fileValue: null,
  }),
  computed: {
    userstore() {
      return getModule(UserStore, this.$store)
    },
    missingContent() {
      const mc = getModule(CompendiumStore, this.$store).MissingContent
      let b = false
      if (!mc || !mc.pilots || !mc.npcs) return b
      for (const key in mc) {
        if (mc[key].length) b = true
      }
      return b
    },
  },
  methods: {
    async bulkExport() {
      const result = await exportAll()
      await saveFile(
        `CC_${new Date().toISOString().slice(0, 10)}.compcon`,
        JSON.stringify(result),
        'Сохранить архив COMP/CON'
      )
    },
    async bulkImport(file) {
      await importAll(file)
        .then(() => this.$notify('Импорт данных успешен', 'confirmation'))
        .catch(err => this.$notify(`ОШИБКА: Не получилось импортировать: ${err}`, 'error'))
      this.importDialog = false
    },
    ccLog(btn: string) {
      switch (btn) {
        case 'compendium':
          this.$refs['log'].print(
            'man compendium',
            'Browse the database of LANCER frames, equipment, and rules'
          )
          break
        case 'pilot':
          this.$refs['log'].print(
            'man pilot-sheet',
            'Create and manage pilots and their mechs, print character sheets, and enable active play mode'
          )
          break
        case 'gm':
          this.$refs['log'].print(
            'man gm-tools',
            'Build and manage NPCs and encounters, and run missions with NPCs and pilots'
          )
          break
        case 'campaign':
          this.$refs['log'].print('man campaigns', 'work in progress')
          break
        case 'content':
          this.$refs['log'].print('man homebrew', 'Manage and create COMP/CON expansion data')
          break
        case 'options':
          this.$refs['log'].print('compcon -settings --verbose', 'Open the options manager')
          break
        case 'about':
          this.$refs['log'].print('compcon --v', 'About COMP/CON')
          break
        case 'help':
          this.$refs['log'].print('compcon --h', 'Open the COMP/CON help page')
          break
        case 'update':
          this.$refs['log'].print(
            'gms-upm compcon changelog -l',
            'View COMP/CON changelog and latest updates'
          )
        default:
          break
      }
    },
  },
})
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: 100vh;
  background: url(../../assets/ui/grid.png);
  animation: 600s scroll infinite linear;
  top: 0;
  left: 0;
}

@keyframes scroll {
  100% {
    background-position: -3000px -3000px;
  }
}
</style>
