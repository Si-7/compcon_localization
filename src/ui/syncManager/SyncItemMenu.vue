<template>
  <v-menu v-model="menu" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list tile>
      <v-list-item two-line :disabled="synced" @click="$emit('sync')">
        <v-list-item-avatar>
          <v-icon v-if="noCloud" color="accent">mdi-cloud-upload</v-icon>
          <v-icon v-else-if="noLocal" color="accent">mdi-cloud-download</v-icon>
          <v-icon v-else-if="!synced" color="accent">mdi-sync</v-icon>
          <v-icon v-else color="success">mdi-check-bold</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold"
            v-text="synced ? 'Объект синхронизирован' : 'Синхронизировать'"
          />
          <v-list-item-subtitle v-if="noCloud" v-text="`Загрузить объект в облако`" />
          <v-list-item-subtitle v-else-if="noLocal" v-text="`Скачать объект из облака`" />
          <v-list-item-subtitle
            v-else-if="!synced"
            v-text="`Обновить ${local ? 'облачные' : 'локальные'} данные до последней версии`"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="!synced && item.hasRecords" two-line @click="$emit('overwrite-local')">
        <v-list-item-avatar>
          <v-icon color="accent">mdi-cloud-download</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold" v-text="'Переписать локальные'" />
          <v-list-item-subtitle
            v-text="`Заменить локальные данные версией из облака`"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="!synced && item.hasRecords" two-line @click="$emit('overwrite-cloud')">
        <v-list-item-avatar>
          <v-icon color="accent">mdi-cloud-upload</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold" v-text="'Переписать облачные'" />
          <v-list-item-subtitle v-text="`Заменить облачные данные локальной версией`" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line v-if="item.deleted" @click="$emit('undelete')">
        <v-list-item-avatar>
          <v-icon color="accent">mdi-backup-restore</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold" v-text="'Восстановить объект'" />
          <v-list-item-subtitle v-text="`Восстановить и вновь активировать этот объект`" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line v-if="item.deleted" @click="$emit('delete-forever')">
        <v-list-item-avatar>
          <v-icon color="error">mdi-delete-forever</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold" v-text="'Удалить навсегда'" />
          <v-list-item-subtitle>
            Навсегда удалить этот объект
            <b class="error--text">Это действие не может быть отменено!</b>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line v-else-if="!item.missingContent" @click="$emit('delete')">
        <v-list-item-avatar>
          <v-icon color="accent">mdi-delete</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold" v-text="'Delete'" />
          <v-list-item-subtitle
            v-text="`Удалить этот объект. Удаленные объекты удаляются навсегда через 60 дней.`"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line v-else @click="$emit('delete-forever')">
        <v-list-item-avatar>
          <v-icon color="accent">mdi-cloud-off-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold" v-text="'Удалить облачные данные'" />
          <v-list-item-subtitle
            v-text="
              `Удалить облачные данные этого объекта. Локальные незагружаемые данные могут быть удалены в Материалах`
            "
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'sync-item-menu',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    menu: false,
  }),
  computed: {
    local() {
      return this.item.latest === 'local'
    },
    noCloud() {
      return !this.item.lastModifiedCloud
    },
    noLocal() {
      return !this.item.lastModifiedLocal
    },
    hasRecords() {
      return this.item.lastModifiedLocal && this.item.lastModifiedCloud
    },
    synced() {
      return (
        !!this.item.lastModifiedCloud &&
        !!this.item.lastModifiedLocal &&
        this.item.lastModifiedCloud === this.item.lastModifiedLocal
      )
    },
  },
})
</script>
