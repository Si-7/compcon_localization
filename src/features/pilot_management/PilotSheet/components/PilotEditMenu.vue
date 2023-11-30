<template>
  <div>
    <v-menu offset-y offset-x>
      <template v-slot:activator="{ on: menu }">
        <v-btn class="ml-2" icon :dark="!light" v-on="menu">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-list two-line subheader color="panel">
        <v-subheader v-if="!dense" class="heading h2 white--text primary py-0 px-2">
          Опции пилота
        </v-subheader>
        <v-list-item @click="$refs.printDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-printer</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Распечатать</v-list-item-title>
            <v-list-item-subtitle>
              Распечатать готовые для игры листы пилота и меха
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.cloneDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-dna</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Клонировать</v-list-item-title>
            <v-list-item-subtitle>Дублировать или флэш-клонировать этого персонажа</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.statblockDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-file-document-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Сгенерировать статблок</v-list-item-title>
            <v-list-item-subtitle>
              Получить этого персонажа в плейн-тексте
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="pilot.CloudController.IsRemoteResource" :disabled="!isAuthed" :loading="loading" @click="remoteUpdate()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-cloud-sync</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Загрузить последние данные</v-list-item-title>
            <v-list-item-subtitle>
              Загрузить все удаленные изменения этого пилота, переписывая локальные данные
              <br/>
              <b v-show="!isAuthed">Требует облачного аккаунта COMP/CON</b>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else :disabled="!isAuthed" @click="$refs.shareDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-code-json</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Получить код персонажа</v-list-item-title>
            <v-list-item-subtitle>
              Сгенерировать код персонажа, который можно использовать для импорта или синхронизации этого персонажа
              <br/>
              <b v-show="!isAuthed">Требует облачного аккаунта COMP/CON</b>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item @click="$refs.roll20Dialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-dice-d20</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Convert to Roll20</v-list-item-title>
            <v-list-item-subtitle>
              Copy JSON data that can be interpreted by the Roll20 LANCER sheet
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item @click="$refs.exportDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-export-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Экспортировать пилота</v-list-item-title>
            <v-list-item-subtitle>Открыть меню экспорта пилота</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item @click="$refs.deleteDialog.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon color="error">mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="error--text">Удалить пилота</v-list-item-title>
            <v-list-item-subtitle class="error--text">
              Удалить пилота из списка пилотов
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <print-dialog ref="printDialog" :pilot="pilot" />
    <export-dialog ref="exportDialog" :pilot="pilot" />
    <statblock-dialog ref="statblockDialog" :pilot="pilot" />
    <roll20-dialog ref="roll20Dialog" :pilot="pilot" />
    <delete-dialog ref="deleteDialog" :pilot="pilot" @delete="delete_pilot()" />
    <clone-dialog ref="cloneDialog" :pilot="pilot" />
    <cc-solo-dialog title="Управление кодом пилота" ref="shareDialog" no-confirm>
      <share-dialog :pilot="pilot" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import CloneDialog from './CloneDialog.vue'
import StatblockDialog from './StatblockDialog.vue'
import Roll20Dialog from './Roll20Dialog.vue'
import ExportDialog from './ExportDialog.vue'
import ShareDialog from './ShareDialog.vue'
import PrintDialog from './PrintDialog.vue'
import DeleteDialog from './DeletePilotDialog.vue'

import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { RemoteSyncItem } from '@/cloud/item_sync'

export default Vue.extend({
  name: 'edit-menu',
  components: {
    StatblockDialog,
    Roll20Dialog,
    ExportDialog,
    PrintDialog,
    DeleteDialog,
    CloneDialog,
    ShareDialog,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    light: {
      type: Boolean,
    },
    dense: {
      type: Boolean,
    },
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    isAuthed() {
      return getModule(UserStore, this.$store).IsLoggedIn
    },
  },
  methods: {
    delete_pilot() {
      this.pilot.SaveController.delete()
      if (this.$route.path !== '/pilot_management') this.$router.push('/pilot_management')
    },
    async remoteUpdate() {
      this.loading = true
      try {
        await RemoteSyncItem(this.pilot)
        this.$notify('Pilot synced to remote', 'success')
      } catch (error) {
        console.error(error)
        this.$notify('An error occurred while attempting to download remote data', 'error')
      }
      this.loading = false
    },
  },
})
</script>
