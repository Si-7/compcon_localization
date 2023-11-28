<template>
  <v-container>
    <v-alert outlined prominent icon="mdi-information-outline" class="my-2">
      <div><b>Облачный аккаунт</b></div>
      <div>
        Введенный ниже адрес электронной почты будет использоваться для отправки вам кода подтверждения 
        для завершения создания вашей учетной записи. После этого ваш адрес электронной почты будет использоваться 
        только для входа в вашу учетную запись COMP/CON. Мы обязуемся сохранять конфиденциальность вашего адреса 
        электронной почты. Мы не продаем и не сдаем в аренду наши контактные данные или списки 
        третьим лицам, и мы не будем предоставлять вашу личную информацию каким-либо третьим лицам, государственным 
        учреждениям или компаниям в любое время.
      </div>
    </v-alert>
    <v-row dense class="panel" justify="center" align="center">
      <v-col cols="auto" style="letter-spacing: 5px">СОЗДАТЬ АККАУНТ</v-col>
    </v-row>
    <!-- <div v-if="isPatron" class="mt-2 heading h3 accent--text text-center">
      <v-icon large color="success">mdi-patreon</v-icon>
      Patreon Account Connected: {{ patreonAuthCode }}
      <v-icon large color="success">mdi-check</v-icon>
    </div>
    <div v-else>
      <v-row no-gutters justify="center" align="center" class="mt-2">
        <v-btn x-large color="patreon" dark @click="verifyPatreon">
          <v-icon left>mdi-patreon</v-icon>
          Link Patreon Account
        </v-btn>
      </v-row>
      <div class="text-center mt-2">
        <i>
          While this feature is in development, you must first authenticate your Patreon account to
          register a new COMP/CON cloud account.
        </i>
      </div>
    </div> -->
    <div class="mt-2">
      <v-form @submit="createAccount" @submit.prevent>
        <v-row justify="center" align="center">
          <v-col lg="4" cols="12">
            <v-text-field
              v-model="email"
              label="Адрес электронной почты"
              :rules="[rules.required, rules.emailMatch]"
              solo
            />
          </v-col>
          <v-col lg="4" cols="12">
            <v-text-field
              v-model="password"
              label="Пароль"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              solo
              :rules="[rules.required, rules.min]"
              @click:append="show = !show"
            />
          </v-col>
        </v-row>
        <v-row no-gutters justify="center">
          <v-col cols="auto">
            <v-btn
              large
              color="secondary"
              type="submit"
              :loading="loading"
              :disabled="!submitOk"
            >
              Отправить
            </v-btn>
            <br />
            <v-btn text color="accent" class="mt-1" @click="$emit('set-state', 'sign-in')">
              Отмена
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <v-scroll-y-transition leave-absolute hide-on-leave>
      <v-alert
        v-if="error"
        v-model="showError"
        color="error darken-1"
        dark
        dense
        class="mt-2"
        icon="mdi-alert"
        dismissible
      >
        <div class="font-weight-bold">ОШИБКА</div>
        <div v-html="error" />
      </v-alert>
    </v-scroll-y-transition>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Auth } from '@aws-amplify/auth'
// import { loginUrl } from '@/cloud/patreon'
import { UserStore } from '@/store'
import { getModule } from 'vuex-module-decorators'
// import popupOauth from '@/cloud/oauth2-popup'

export default Vue.extend({
  name: 'sign-up',
  // components: { Auth },
  data: () => ({
    showError: false,
    error: '',
    loading: false,
    show: false,
    email: '',
    password: '',
    // patreonAuthCode: '',
    rules: {
      required: value => !!value || 'Необходио.',
      min: v => v.length >= 6 || 'Минимум 6 символов',
      emailMatch: v =>
        !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(v) || 'Адрес должен быть действительным',
    },
  }),
  computed: {
    // isPatron() {
    //   return !!this.patreonAuthCode
    // },
    submitOk() {
      return (
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(this.email) && this.password.length >= 6
      )
    },
    test() {
      return process.env.VUE_APP_SOMEKEY
    },
  },
  methods: {
    async createAccount() {
      if (this.loading) return // debounce if already loading
      this.loading = true
      try {
        const userEmail = this.email.toLowerCase() // use safe const for auth
        this.email = userEmail
        const { user } = await Auth.signUp({
          username: userEmail,
          password: this.password,
          attributes: {
            email: userEmail,
          },
        })
        this.loading = false
        this.showError = false
        this.$emit('success', userEmail)
        // const userstore = getModule(UserStore, this.$store)
        // userstore.clearOauth()
      } catch (error) {
        console.log('error signing up:', error)
        this.loading = false
        this.showError = true
        this.error = `${error.message}<br><div class='text-right'>${error.name}</div>`
      }
    },
    // async verifyPatreon() {
    //   const authorizationCode = await popupOauth(
    //     'https://www.patreon.com/oauth2/authorize',
    //     '_1O6Z4dBszp3Q9ERr93RVNCwM1VUveu9xI5vq1DqJUXEK47FC7MkTtF1lwT5_ko3',
    //     'https://compcon.app/patreon-callback',
    //     '',
    //     'code'
    //   )
    //   this.patreonAuthCode = authorizationCode
    // },
  },
})
</script>
