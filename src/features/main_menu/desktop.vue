<template>
  <div id="wrapper">
    <main-title @logupdate="ccLog('update')" />
    <c-c-log v-show="$vuetify.breakpoint.mdAndUp" ref="log" />
    <v-container style="height: calc(100vh - 135px)">
      <v-row justify="space-between" style="height: 100%">
        <main-btn
          icon="cci-compendium"
          :to="'/compendium'"
          :help="$t('main_menu.compendium.help')"
          @hover="ccLog('compendium')"
        >
          {{ $t('main_menu.compendium.name') }}
        </main-btn>
        <main-btn
          icon="cci-pilot"
          :to="'/pilot_management'"
          :help="$t('main_menu.pilot_roster.help')"
          @hover="ccLog('pilot')"
        >
        {{ $t('main_menu.pilot_roster.name') }}
        </main-btn>
        <main-btn
          icon="cci-encounter"
          :to="'/gm'"
          :help="$t('main_menu.encounter_toolkit.help')"
          @hover="ccLog('gm')"
        >
        {{ $t('main_menu.encounter_toolkit.name') }}
        </main-btn>
        <main-btn
          icon="cci-content-manager"
          :help="$t('main_menu.content_manager.help')"
          @hover="ccLog('content')"
          @clicked="$refs.contentModal.show()"
        >
        {{ $t('main_menu.content_manager.name') }}
          <cc-tooltip
            v-if="missingContent"
            inline
            :title="$t('main_menu.missing_content_tip.name')"
            :content="$t('main_menu.missing_content_tip.help')"
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
            <span>{{ userstore.IsLoggedIn ? $t('main_menu.log_in_button.logged_in') : $t('main_menu.log_in_button.not_logged_in') }}</span>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="ml-1 mr-3"><v-divider vertical class="d-inline" /></v-col>
        <v-col cols="auto" class="text-center mr-3">
          <v-btn small dark outlined @click="bulkExport">
            <v-icon left>mdi-database</v-icon>
            {{ $t('main_menu.create_backup_button.name') }}
            <cc-tooltip
              inline
              :content="$t('main_menu.create_backup_button.help')"
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
                {{ $t('main_menu.load_backup_button.name') }}
                <cc-tooltip
                  inline
                  :content="$t('main_menu.load_backup_button.help')"
                >
                  <v-icon right class="fadeSelect">mdi-help-circle-outline</v-icon>
                </cc-tooltip>
              </v-btn>
            </template>
            <v-card>
              <v-card-text class="pa-6">
                <p class="text-center heading h3 text--text" v-html="$t('main_menu.load_backup_button.dialog.text')">
                </p>
                <v-file-input
                  v-model="fileValue"
                  accept=".compcon"
                  outlined
                  dense
                  hide-details
                  autofocus
                  :placeholder="$t('main_menu.load_backup_button.dialog.placeholder')"
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
                {{ $t('main_menu.options.name') }}
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn small dark text @mouseenter="ccLog('about')" @click="$refs.aboutModal.show()">
                {{ $t('main_menu.about.name') }}
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
                {{ $t('main_menu.credits.name') }}
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn small dark text @mouseenter="ccLog('help')" @click="$refs.helpModal.show()">
                {{ $t('main_menu.help.name') }}
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-btn
                target="_blank"
                color="warning"
                small
                dark
                text
                href="https://www.patreon.com/compcon"
                tabindex="0"
              >
              {{ $t('main_menu.support.name') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
    <cc-solo-dialog ref="loginModal" large no-confirm :title="$t('sign_in_dialog.title')">
      <sign-in />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="optionsModal"
      large
      no-confirm
      no-pad
      no-title-clip
      :title="$t('options_dialog.title')"
    >
      <options-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="aboutModal" large no-confirm :title="$t('about_dialog.title')"><about-page /></cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm :title="$t('help_dialog.title')"><help-page /></cc-solo-dialog>
    <cc-solo-dialog ref="creditsModal" fullscreen no-confirm :title="$t('credits_dialog.title')">
      <credits-page />
    </cc-solo-dialog>
    <cc-solo-dialog
      ref="contentModal"
      no-title-clip
      no-pad
      large
      no-confirm
      :title="$t('lcp_management_dialog.title')"
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
        'Save COMP/CON Archive'
      )
    },
    async bulkImport(file) {
      await importAll(file)
        .then(() => this.$notify('Data import successful', 'confirmation'))
        .catch(err => this.$notify(`ERROR: Unable to import: ${err}`, 'error'))
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
