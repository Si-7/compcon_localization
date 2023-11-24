<template>
  <div>
    <div
      v-if="
        !!authedUser &&
        !!authedUser.attributes &&
        userProfile.Username &&
        userProfile.Username !== 'No Cloud Account'
      "
    >
      <v-row dense justify="space-between" align="center">
        <v-col v-if="userProfile" class="text-center heading h3 mt-3 mb-2">
          ПОДКЛЮЧЕНО
          <cc-slashes />
          <b class="accent--text">
            {{ userProfile.Username }}
          </b>
        </v-col>

        <v-col cols="auto">
          <v-btn small tile color="warning darken-1" :loading="loading" @click="signOut">
            Выйти
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense class="panel" justify="center" align="center">
        <v-col cols="auto" style="letter-spacing: 5px">ПОМЕНЯТЬ ПАРОЛЬ</v-col>
      </v-row>
      <v-row dense class="my-2">
        <v-col lg="6" cols="12">
          <v-text-field
            v-model="oldpass"
            outlined
            dense
            label="Старый пароль"
            :type="showOld ? 'text' : 'password'"
            :append-icon="showOld ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showOld = !showOld"
          />
        </v-col>
        <v-col lg="6" cols="12">
          <v-text-field
            v-model="newpass"
            outlined
            dense
            label="Новый пароль"
            :rules="[rules.passLength, passMatch]"
            :type="showNew ? 'text' : 'password'"
            :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showNew = !showNew"
          />
        </v-col>
      </v-row>
      <v-row no-gutters justify="end" class="mt-n3">
        <v-col cols="auto">
          <v-btn
            text
            color="accent"
            :disabled="!oldpass || !newpass || oldpass === newpass"
            :loading="loading"
            @click="changePass"
          >
            Отправить
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense class="panel" justify="center" align="center">
        <v-col cols="auto" style="letter-spacing: 5px">ДАННЫЕ АККАУНТА</v-col>
      </v-row>
      <div v-if="iid" class="caption text-center mt-1 mb-n3">
        IID ПОЛЬЗОВАТЕЛЯ COMP/CON: {{ iid }}
        <cc-tooltip simple inline content="Копировать IID в буфер обмена">
          <v-btn icon small right @click="copyIid()">
            <v-icon small>mdi-clipboard-text-outline</v-icon>
          </v-btn>
        </cc-tooltip>
      </div>

      <v-alert class="my-3" prominent icon="mdi-alert" color="warning darken-2" outlined>
        <b>Функциональность синхронизации с облаком изменилась.</b>
        <div class="text--text">
          Автоматическая синхронизация с облаком изменилась. Сохранение или загрузка 
          в облако или из него вручную можно выполнить здесь или с помощью параметров 
          на панели навигации. Если включена автоматическая синхронизация, COMP/CON 
          попытается синхронизировать все локальные и облачные данные при входе в вашу 
          учетную запись.
        </div>

        <div v-show="!isOnV2" class="pa-2">
          <v-card outlined style="border-color: var(--v-error-base); border-width: 3px">
            <div class="font-weight-bold text--text pa-2">
              COMP/CON определил, что ваша облачная учетная запись не настроена для последних 
              изменений серверной части. Нажатие кнопки «Обновить» сохранит резервную копию ваших 
              текущих локальных данных и попытается обновить данные вашей учетной записи. Этот процесс 
              должен занять меньше секунды, и после завершения приложение перезагрузится.
            </div>
            <div class="px-12 py-2">
              <v-btn block class="secondary" :loading="upgradeLoading" @click="v2Upgrade()">
                АПГРЕЙД
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-alert>

      <v-card v-if="isOnV2" class="mt-3 mb-6">
        <v-card-title class="heading h3">Настройки автоматической синхронизации</v-card-title>
        <v-card-text class="px-10">
          <v-row dense align="center">
            <v-col>
              <span class="heading h3">
                При входе
                <cc-tooltip
                  inline
                  content="Это будет автоматически синхронизировать все элементы и данные LCP каждый раз, когда процесс входа в учетную запись будет успешным. Если вы не выйдете из системы, это произойдет вскоре после запуска приложения. "
                >
                  <v-icon left>mdi-information-outline</v-icon>
                </cc-tooltip>
              </span>
            </v-col>
            <v-col cols="auto" class="mr-n3">
              <v-switch
                v-model="userProfile.SyncFrequency.cloudSync_v2"
                dense
                hide-details
                inset
                color="accent"
                @change="userUpdate()"
              />
            </v-col>
            <v-col v-if="userProfile.SyncFrequency.cloudSync_v2" cols="auto"><b>ВКЛ</b></v-col>
            <v-col v-else cols="auto"><i>ВЫКЛ</i></v-col>
          </v-row>
          <v-row dense align="center">
            <v-col>
              <span class="heading h3">
                Синхронизировать удаленные ресурсы
                <cc-tooltip
                  inline
                  content="При этом будут автоматически предпринята попытка синхронизировать все удаленные ресурсы с последними версиями в облачных учетных записях их авторов. Удаленные данные не могут быть сохранены в вашей собственной облачной учетной записи."
                >
                  <v-icon left>mdi-information-outline</v-icon>
                </cc-tooltip>
              </span>
            </v-col>
            <v-col cols="auto" class="mr-n3">
              <v-switch
                v-model="userProfile.SyncFrequency.remotes"
                dense
                hide-details
                inset
                color="accent"
                @change="userUpdate()"
              />
            </v-col>
            <v-col v-if="userProfile.SyncFrequency.remotes" cols="auto"><b>ВКЛ</b></v-col>
            <v-col v-else cols="auto"><i>ВЫКЛ</i></v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <sync-manager ref="sync" />
      <v-divider class="my-6" />
      <cloud-content-manager ref="lcps" />
      <v-divider class="my-6" />
      <backup-manager
        ref="backup"
        :username="userProfile.Username"
        @change="$refs.sync.fetch()"
        @del-local="$refs.lcps ? $refs.lcps.deleteAllLocal : ''"
        @del-cloud="$refs.lcps ? $refs.lcps.deleteAllCloud : ''"
      />

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
    <div v-else>
      <v-row no-gutters justify="center" align="center" style="height: 100%">
        <v-col cols="auto">
          <v-progress-circular intermediate size="60" color="primary" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SyncManager from '@/ui/syncManager/SyncManager.vue'
import CloudContentManager from '@/ui/syncManager/CloudContentManager.vue'
import BackupManager from '@/ui/syncManager/BackupManager.vue'
import { Auth } from '@aws-amplify/auth'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { UpdateUserData } from '@/cloud/user_sync'
import _ from 'lodash'

export default Vue.extend({
  name: 'auth-signed-in',
  components: { SyncManager, BackupManager, CloudContentManager },
  data: () => ({
    upgradeLoading: false,
    loading: false,
    showError: false,
    error: '',
    iid: '',
    oldpass: null,
    showOld: false,
    newpass: null,
    showNew: false,
    rules: {
      passLength: v => (v && v.length >= 6) || 'Minimum 6 characters',
    },
    authedUser: null,
  }),
  computed: {
    passMatch() {
      return () =>
        (this.oldpass && this.newpass && this.oldpass !== this.newpass) ||
        'Password must be different'
    },
    userProfile() {
      return getModule(UserStore, this.$store).UserProfile
    },
    isOnV2() {
      return this.userProfile && _.has(this.userProfile.SyncFrequency, 'cloudSync_v2')
    },
  },
  mounted() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        this.authedUser = user
      })
      .then(() => Auth.currentUserCredentials().then(res => (this.iid = res.identityId)))
      .catch(() => {
        this.$emit('set-state', 'sign-in')
      })
  },
  methods: {
    async load() {
      this.loading = true
      const userstore = getModule(UserStore, this.$store)
      Auth.currentAuthenticatedUser()
        .then(cognitoUser => {
          userstore.setAws({ cognitoUser })
        })
        .then(() => {
          this.loading = false
          this.$notify('Cloud Load Complete', 'success')
        })
        .catch(err => {
          console.error(err)
          this.loading = false
        })
    },
    changePass() {
      this.loading = true
      Auth.currentAuthenticatedUser()
        .then(user => {
          return Auth.changePassword(user, this.oldpass, this.newpass)
        })
        .then(() => {
          this.loading = false
          this.showError = false
          this.$notify('Password Changed')
          this.oldpass = null
          this.newpass = null
        })
        .catch(err => {
          this.loading = false
          this.showError = true
          this.error = `${err.message}<br><div class='text-right'>${err.name}</div>`
        })
    },
    signOut() {
      Auth.signOut()
        .then(() => {
          this.$notify('Sign Out Complete')
          const store = getModule(UserStore, this.$store)
          store.setLoggedIn(false)
          this.$emit('set-state', 'sign-in')
        })
        .catch(err => {
          console.error(err)
        })
    },
    userUpdate() {
      UpdateUserData(this.userProfile).then(res => console.log(res))
    },
    copyIid() {
      navigator.clipboard
        .writeText(this.iid)
        .then(() => Vue.prototype.$notify('Cloud Identity ID copied to clipboard.', 'confirmation'))
        .catch(() => Vue.prototype.$notifyError('Unable to copy Cloud Identity ID '))
    },
    async v2Upgrade() {
      this.upgradeLoading = true
      try {
        await this.$refs.backup.dataExport()
        await this.$refs.lcps.syncAll(true)
        await this.$refs.sync.syncAll(true)
        await UpdateUserData(this.userProfile, true)
        this.$notify('Data successfully updated. Reloading.', 'success')
        setTimeout(() => {
          location.reload()
        }, 2000)
      } catch (error) {
        console.error(error)
        this.$notify('An error occured while syncing.', 'error')
      } finally {
        this.upgradeLoading = false
      }
    },
  },
})
</script>

<style scoped>
.v-input--selection-controls {
  margin: 0;
}

label {
  font-size: 10px;
}
</style>
