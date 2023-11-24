<template>
  <cc-solo-dialog
    ref="dialog"
    icon="mdi-account-arrow-right"
    large
    no-confirm
    title="Экспортировать данные пилота"
  >
    <v-card-text>
      <v-row>
        <v-col>
          <v-btn large block tile outlined color="accent" @click="exportPilot()">
            Экспортировать данные пилота из файла
          </v-btn>
        </v-col>
        <v-col cols="auto" class="ml-n1">
          <cc-tooltip
            simple
            inline
            :content="`Это создаст файл данных пилота в вашей системе, который затем можно будет импортировать в список пилотов другого пользователя COMP/CON с помощью опции «Добавить нового пилота» > «Импортировать из файла». Если у этого пилота есть запись сохранения в облаке, это соединение сохранится. `"
          >
            <v-icon class="mt-2 ml-n3">mdi-information-outline</v-icon>
          </cc-tooltip>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn large block tile outlined color="accent" @click="copyPilot()">
            Копировать данные пилота в буфер обмена
          </v-btn>
        </v-col>
        <v-col cols="auto" class="ml-n1">
          <cc-tooltip
            simple
            inline
            content="Данные вашего пилота будут скопированы в буфер обмена вашего компьютера."
          >
            <v-icon class="mt-2 ml-n3">mdi-information-outline</v-icon>
          </cc-tooltip>
        </v-col>
      </v-row>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveFile } from '@/io/Dialog'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'export-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    syncing: false,
    copyConfirm: false,
  }),
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    exportPilot() {
      this.pilot.BrewController.SetBrewData()
      saveFile(
        this.pilot.Callsign.toUpperCase().replace(/\W/g, '') + '.json',
        JSON.stringify(Pilot.Serialize(this.pilot)),
        'Сохранить Пилота'
      )
      this.hide()
    },
    copyPilot() {
      this.pilot.BrewController.SetBrewData()
      navigator.clipboard.writeText(JSON.stringify(Pilot.Serialize(this.pilot)))
      Vue.prototype.$notify('Данные пилота скопированы в буфер обмена')
      this.hide()
    },
    async copyCode() {
      this.copyConfirm = true
      navigator.clipboard.writeText(this.pilot.ShareCode).then(
        function () {
          Vue.prototype.$notify('Облачный ID скопировано в буфер обмена', 'confirmation')
        },
        function () {
          Vue.prototype.$notifyError('Невозможно скопировать облачный ID')
        }
      )
      setTimeout(() => {
        this.copyConfirm = false
      }, 1200)
    },
  },
})
</script>
