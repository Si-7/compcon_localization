<template>
  <div>
    <v-row dense class="panel" justify="center" align="center">
      <v-col cols="auto" style="letter-spacing: 5px">ПОДТВЕРЖДЕНИЕ АДРЕСА ЭЛЕКТРОННОЙ ПОЧТЫ</v-col>
    </v-row>
    <p class="body-text text-center mt-2">
      Код подтверждения отправлен на
      <b>{{ email }}</b>
      . Введите код снизу, чтобы закончить регистрацию
    </p>
    <div class="text-center">
      <v-btn small text color="accent" style="fadeSelect" @click="resend()">
        Отправить код заново
      </v-btn>
    </div>
    <v-row class="mt-2" justify="center">
      <v-col lg="6" cols="12">
        <v-text-field v-model="verify" label="Verification Code" dense outlined hide-details />
      </v-col>
    </v-row>
    <v-row dense justify="center" align="start" class="mt-n2 text-center">
      <v-col cols="auto">
        <v-btn large color="success" :loading="loading" :disabled="!verify" @click="confirm">
          Подтвердить код подтверждения
        </v-btn>
        <br />
        <v-btn text color="accent" class="mt-1" @click="$emit('set-state', 'sign-in')">
          Отмена
        </v-btn>
      </v-col>
    </v-row>
    <v-scroll-y-transition leave-absolute hide-on-leave>
      <v-alert
        v-if="error"
        v-model="showError"
        color="error darken-1"
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
import { Auth } from '@aws-amplify/auth'

export default Vue.extend({
  name: 'auth-account-verify',
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    error: null,
    showError: false,
    loading: false,
    show: false,
    verify: null,
  }),
  methods: {
    confirm() {
      this.loading = true
      // After retrieveing the confirmation code from the user
      Auth.confirmSignUp(this.email.toLowerCase(), this.verify, {
        // Optional. Force user confirmation irrespective of existing alias. By default set to True.
        forceAliasCreation: true,
      })
        .then(data => {
          this.loading = false
          this.$notify('Аккаунт пользователя успешно создан. Перенаправляю на вход.')
          console.log(data)
          this.$emit('set-state', 'sign-in')
        })
        .catch(error => {
          this.loading = false
          this.showError = true
          this.error = `${error.message}<br><div class='text-right'>${error.name}</div>`
        })
    },
    resend() {
      Auth.resendSignUp(this.email).then(res => {
        console.log(res)
        this.$notify(`Новый код подтверждения отправлен на ${this.email.toLowerCase()}`).catch(err => {
          console.error(err)
          this.$notify(`Ошибка при отправке кода подтверждения: ${err}`)
        })
      })
    },
  },
})
</script>
