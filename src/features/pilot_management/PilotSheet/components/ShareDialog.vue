<template>
  <div>
    <v-alert outlined dense prominent icon="mdi-information-outline" class="body-text mt-2">
      Создание кода для этого пилота позволит другим пользователям 
      с облачными учетными записями COMP/CON загрузить копию и подписаться на обновления, 
      которые вы вносите в этот пилотный проект. Повторное создание общего кода не позволит 
      подписчикам загружать будущие обновления под старым общим кодом.
    </v-alert>
    <div v-if="pilot.CloudController.ShareCode">
      <v-row justify="center">
        <v-col cols="auto" class="py-12">
          <div class="overline mb-4">КОД ПИЛОТА</div>
          <b
            class="accent--text"
            style="font-size: 80px; letter-spacing: 15px"
            v-text="pilot.CloudController.ShareCode"
          />
          <cc-tooltip simple inline content="Копировать код в буфер обмена">
            <v-btn icon small class="ml-n3" @click="copy()">
              <v-icon small>mdi-clipboard-text-outline</v-icon>
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
      <div class="text-center px-6">
        <b class="accent--text">
          Коды действительны в течение 90 дней, после чего срок действия кода истечет. Срок действия этого пилотного кода истечет 
          {{ pilot.CloudController.ShareCodeExpiration }}. Его можно продлить, нажав кнопку ниже.
        </b>
        <br />
        <v-btn
          right
          color="primary"
          class="mt-2"
          small
          :disabled="isSameDate"
          v-text="
            isSameDate
              ? 'Уже на максимуме'
              : `Продлить до
          ${extendedDate}`
          "
          @click="refresh(pilot)"
        />
        <div v-if="isSameDate" class="caption text-disabled"></div>
      </div>
      <v-row justify="end" class="mt-12">
        <v-col cols="auto">
          <cc-tooltip
            content="Повторное создание кода этого элемента не позволит другим пользователям обновлять свои копии этого пилота до тех пор, пока они не будут повторно импортированы с новым кодом."
          >
            <v-btn x-small color="error" @click="generate()">
              Удалить и сгенерировать заново код
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row justify="center">
        <v-col cols="auto" class="py-12 text-center">
          <v-btn x-large class="primary" :loading="loading" @click="generate()">
            Сгенерировать код пилота
          </v-btn>
          <div v-show="!pilot.CloudController.LastUpdateCloud" class="overline text-disabled">
            При создании кода этот пилот будет загружен в вашу облачную учетную запись. Этот процесс может занять несколько секунд.
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { generateCode, refreshItem } from '@/io/apis/share'

export default Vue.extend({
  name: 'share-dialog',
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    isSameDate() {
      return (
        Math.floor(
          (new Date().valueOf() - new Date(this.pilot.CloudController.ShareCodeExpiry).valueOf()) /
            (1000 * 60 * 60 * 24)
        ) < 1
      )
    },
    extendedDate() {
      const d = new Date()
      d.setDate(d.getDate() + 90)

      return d.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
  methods: {
    async generate() {
      this.loading = true
      await generateCode(this.pilot)
        .then(res => this.pilot.CloudController.SetShareCode(res))
        .then(() => this.$notify('Код пилота сгенерирован', 'success'))
        .catch(() => this.$notify('Возникла ошибка при попытке создания кода пилота', 'error'))
      this.loading = false
    },
    async refresh() {
      this.loading = true
      const c = this.pilot.CloudController.ShareCode
      await refreshItem(c)
        .then(() => this.pilot.CloudController.SetShareCode(c))
        .then(() => this.$notify('Код пилота обновлен', 'success'))
        .catch(() => this.$notify('Возникла ошибка при попытке обновления кода пилота', 'error'))
      this.loading = false
    },
    copy() {
      navigator.clipboard
        .writeText(this.pilot.CloudController.ShareCode)
        .then(() => Vue.prototype.$notify('Cloud ID copied to clipboard.', 'confirmation'))
        .catch(() => Vue.prototype.$notifyError('Unable to copy Cloud ID'))
    },
  },
})
</script>
