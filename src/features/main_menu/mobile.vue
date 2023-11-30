<template>
  <div id="wrapper">
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
    <cc-solo-dialog ref="aboutModal" large no-confirm title="О сайте">
      <about-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="creditsModal" large no-confirm title="Авторы">
      <credits-page />
    </cc-solo-dialog>
    <cc-solo-dialog ref="helpModal" large no-confirm title="Помощь"
      ><help-page
    /></cc-solo-dialog>
    <cc-solo-dialog
      ref="contentModal"
      no-title-clip
      no-pad
      large
      no-confirm
      title="Управление пакетами материалов"
    >
      <content-page />
    </cc-solo-dialog>
    <v-container fluid>
      <div class="mt-n5">
        <div
          v-resize-text="{ ratio: 0.75 }"
          class="heading mech mt-n5 text-center"
          style="letter-spacing: 8px"
        >
          COMP/CON_ru
        </div>
      </div>
      <v-row dense align="center" class="my-1 px-2 primary py-2">
        <v-col cols="auto">
          <div class="flavor-text white--text">
            <span>v.{{ $appVersion }}</span>
          </div>
        </v-col>
        <v-col cols="auto ml-auto">
          <update-checker small />
        </v-col>
      </v-row>
      <v-row dense justify="space-around">
        <mobile-btn
          icon="mdi-book"
          title="Компендиум"
          text="База данных снаряжения"
          :to="'/compendium'"
        />
        <mobile-btn
          icon="cci-pilot"
          title="Пилоты"
          text="Управление пилотами"
          :to="'/pilot_management'"
        />
        <mobile-btn
          icon="mdi-flask-empty-plus-outline"
          title="Материалы"
          text="Импорт пакетов материалов"
          @clicked="$refs.contentModal.show()"
        />
        <mobile-btn
          :icon="
            userstore.IsLoggedIn
              ? 'mdi-account-check'
              : 'mdi-account-off-outline'
          "
          :title="userstore.IsLoggedIn ? 'Подключено' : 'Войти'"
          text="Аккаунт COMP/CON"
          @clicked="$refs.loginModal.show()"
        />
      </v-row>
      <div style="height: 40px" />

      <v-footer color="primary" fixed style="padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px))">
        <v-btn x-small dark outlined @click="$refs.optionsModal.show()"
          >Опции</v-btn
        >
        <v-spacer />
        <v-btn x-small dark outlined @click="$refs.aboutModal.show()"
          >О сайте</v-btn
        >
        <v-spacer />
        <v-btn x-small dark outlined @click="$refs.creditsModal.show()"
          >Авторы</v-btn
        >
        <v-spacer />
        <v-btn x-small dark outlined @click="$refs.helpModal.show()"
          >Помощь</v-btn
        >
        <v-spacer />
        <v-btn
          target="_blank"
          href="https://www.patreon.com/compcon"
          color="warning"
          x-small
          dark
          outlined
        >
          Поддержать
        </v-btn>
      </v-footer>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UpdateChecker from './_components/UpdateChecker.vue'
import MobileBtn from "./_components/MobileBtn.vue";
import ContentPage from "../nav/pages/ExtraContent/index.vue";
import CreditsPage from "../nav/pages/Credits.vue";
import AboutPage from "../nav/pages/About.vue";
import HelpPage from "../nav/pages/Help.vue";
import OptionsPage from "../nav/pages/Options/index.vue";
import { UserStore } from "@/store";
import { getModule } from "vuex-module-decorators";
import SignIn from "./_components/login/index.vue";

export default Vue.extend({
  name: "landing-page-mobile",
  components: {
    UpdateChecker,
    MobileBtn,
    ContentPage,
    AboutPage,
    CreditsPage,
    HelpPage,
    OptionsPage,
    SignIn,
  },
  computed: {
    userstore() {
      return getModule(UserStore, this.$store);
    },
  },
});
</script>
