<template>
  <div>
    <v-row dense class="panel" justify="center" align="center">
      <v-col cols="auto" style="letter-spacing: 5px">ВХОД</v-col>
    </v-row>
    <v-form @submit="signIn()" @submit.prevent>
      <v-row class="mt-2">
        <v-col lg="6" cols="12">
          <v-text-field v-model="email" label="Адрес электронной почты" dense outlined hide-details />
          <div>
            <v-fade-transition>
              <div>
                <a v-if="email && emailValid()" @click="$emit('reverify', email)">
                  <i>Нажмите здесь, чтобы использовать код подтверждения.</i>
                </a>
                <i v-else-if="!email">Есть код подтверждения? Введите свой адрес электронной почты, чтобы использовать его.</i>
                <i v-else>Пожалуйста, введите действительный адрес электронной почты</i>
              </div>
            </v-fade-transition>
          </div>
        </v-col>
        <v-col lg="6" cols="12">
          <v-text-field
            v-model="password"
            label="Пароль"
            dense
            outlined
            hide-details
            :type="show ? 'text' : 'password'"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
          />
          <div class="text-right" @click="$emit('set-state', 'reset')">
            <a><i>Забыли пароль?</i></a>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center" align="start" class="mt-n2 text-center">
        <v-col cols="auto">
          <v-btn
            large
            color="secondary"
            type="submit"
            :loading="loading"
            :disabled="loading || !email || !password"
          >
            Войти
          </v-btn>
          <br />
          <v-btn small color="accent" class="mt-1" outlined @click="$emit('set-state', 'sign-up')">
            Создать Аккаунт
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { Auth } from '@aws-amplify/auth'
import { SetTheme } from '@/classes/utility/ThemeManager'

export default Vue.extend({
  name: 'auth-sign-in',
  data: () => ({
    email: null,
    password: null,
    show: false,
    error: null,
    showError: false,
    loading: false,
  }),
  methods: {
    async signIn() {
      if (this.loading) return // debounce if already loading
      this.loading = true
      const userEmail = this.email.trim() // use safe const for auth
      this.email = userEmail
      const userstore = getModule(UserStore, this.$store)
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      Auth.signIn(userEmail, this.password)
        .catch(error => {
          if (error.name === 'UserNotFoundException') {
            return Auth.signIn(userEmail.toLowerCase(), this.password)
          }
          throw error
        })
        .then(user => {
          console.log(user)
          localStorage.removeItem('user.config')
          userstore.setCognitoUser(user)
        })
        .then(() => {
          userstore.setAws({ cognitoUser: userstore.CognitoUser })
        })
        .then(() => {
          console.log(userstore.UserProfile.Theme)
          SetTheme(userstore.UserProfile.Theme, this.$vuetify)
          this.$notify('Облачные данные синхронизированы', 'success')
          this.loading = false
          this.showError = false
        })
        .then(() => self.$nextTick())
        .then(() => {
          this.$emit('set-state', 'signed-in')
        })
        .catch(error => {
          this.loading = false
          this.showError = true
          this.error = `${error.message}<br><div class='text-right'>${error.name}</div>`
        })
    },
    emailValid(){
      return this.email.indexOf('.') > -1 
        && this.email.indexOf('@') > -1;
    }
  },
})
</script>
