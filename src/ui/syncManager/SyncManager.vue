<template>
  <v-card>
    <!-- <v-toolbar dense color="primary" class="white--text"
      >Sync Manager</v-toolbar
    > -->
    <v-card-text>
      <v-row dense justify="end">
        <v-col cols="auto">
          <v-btn @click="fetch()" color="primary" small class="mb-3">
            <v-icon left>mdi-reload</v-icon>
            Обновить таблицу
          </v-btn>
        </v-col>
      </v-row>

      <v-expansion-panels>
        <v-expansion-panel v-for="k in cloudItemTypes" :key="k">
          <v-expansion-panel-header>
            <span>
              <v-chip dark color="primary" outlined x-small class="mt-n1 mr-2">
                <b>{{ itemsByType(k).length.toString().padStart(3, '0') }}</b>
              </v-chip>
              <span class="heading h3">{{ displayTypes(k) }}</span>
            </span>
            <v-spacer />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <v-simple-table class="text-center">
                <thead>
                  <th width="10%">
                    <v-btn v-if="!selectedItems.length" x-small outlined @click="selectAll(k)">
                      Выбрать все
                    </v-btn>
                    <v-btn v-else x-small outlined @click="deselectAll(k)">Deselect All</v-btn>
                  </th>
                  <th>Название</th>
                  <th>Последнее локальное обновление</th>
                  <th>Последнее облачное обновление</th>
                  <th>Статус</th>
                  <th>Опции</th>
                </thead>
                <tbody>
                  <tr v-for="item in itemsByType(k)" :key="`item_${item.id}`">
                    <td><v-simple-checkbox v-model="item.selected" /></td>
                    <td class="text-left">
                      {{ callsign(item) }}
                      {{ item.name }}
                    </td>
                    <td v-if="item.remote || isAtLatest(item)" colspan="2">
                      <v-row no-gutters align="center">
                        <v-col><v-divider /></v-col>
                        <v-col cols="auto" class="px-2">
                          <b v-if="item.remote" class="primary--text text--darken-1">Удаленный ресурс</b>
                          <b v-else class="success--text text--darken-1">Синхронизировано</b>
                        </v-col>
                        <v-col><v-divider /></v-col>
                      </v-row>
                    </td>
                    <td v-else-if="!isAtLatest(item)">
                      <span
                        v-if="item.lastModifiedLocal"
                        :class="item.latest === 'local' ? 'font-weight-bold' : 'text--disabled'"
                      >
                        {{ item.lastModifiedLocal.split('GMT')[0] }}
                      </span>
                      <span v-else-if="item.missingContent"><i class="text--disabled">ОШИБКА</i></span>
                      <span v-else class="text--disabled"><i>Нет данных</i></span>
                    </td>
                    <td v-if="!isAtLatest(item)">
                      <span
                        v-if="item.lastModifiedCloud"
                        :class="item.latest === 'cloud' ? 'font-weight-bold' : 'text--disabled'"
                      >
                        {{ item.lastModifiedCloud.split('GMT')[0] }}
                      </span>
                      <span v-else class="text--disabled"><i>Нет данных</i></span>
                    </td>
                    <td>
                      <cc-tooltip
                        inline
                        v-if="item.remote"
                        title="Удаленный ресурс"
                        :content="`Экземпляр этого элемента связан с данными в учетной записи другого пользователя. Локальные изменения не сохранятся, и этот элемент будет обновлен до последней версии данных, опубликованных в облачной учетной записи автора.`"
                      >
                        <v-icon color="primary">mdi-cloud-braces</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-if="item.deleted"
                        title="Отмечено для удаления"
                        :content="`Этот элемент помечен для удаления. Его можно восстановить в любое время с помощью опции «Восстановить» или удалить навсегда с помощью опции «Удалить навсегда». Если не предпринято никаких действий, этот элемент будет автоматически удален после ${item.delete_time}`"
                      >
                        <v-icon color="error">mdi-delete-alert</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-if="item.missingContent"
                        title="Отсутствуют необходимые LCP"
                        content="Для этого элемента требуется один или несколько пакетов LCP, которые в данный момент не установлены и/или не активированы."
                      >
                        <v-icon color="error">mdi-folder-off</v-icon>
                      </cc-tooltip>
                      <span v-if="!item.remote && !item.missingContent">
                        <cc-tooltip
                          inline
                          v-if="isAtLatest(item)"
                          title="Объект синхронизирован"
                          :content="`Последняя версия этого элемента хранится как локально, так и в вашей облачной учетной записи. Последний раз этот элемент изменялся: ${item.lastModifiedLocal}`"
                        >
                          <v-icon color="success darken-1">mdi-check-bold</v-icon>
                        </cc-tooltip>
                        <cc-tooltip
                          inline
                          v-else-if="item.latest === 'local'"
                          title="Обнаружены локальные изменения"
                          :content="`Облачные данные не найдены, или локальная версия этого элемента является последней. Последний раз этот элемент изменялся: ${
                            item.lastModifiedLocal || '???'
                          }. При синхронизации сейчас облачные данные этого элемента будут перезаписаны локальной версией.`"
                        >
                          <v-icon color="panel">mdi-check</v-icon>
                        </cc-tooltip>
                        <cc-tooltip
                          inline
                          v-else
                          title="Обнаружены изменения в облаке"
                          :content="`Локальные данные не найдены, или облачная версия этого элемента является последней. Последний раз этот элемент изменялся: ${
                            item.lastModifiedCloud || '???'
                          }. При синхронизации сейчас локальные данные этого элемента перезапишутся версией, хранящейся в облаке.`"
                        >
                          <v-icon color="panel">mdi-check</v-icon>
                        </cc-tooltip>
                      </span>
                    </td>
                    <td>
                      <sync-item-menu
                        v-if="!item.remote"
                        :item="item"
                        @sync="syncSingle(item)"
                        @delete="flagDelete(item)"
                        @delete-forever="deleteForever(item)"
                        @undelete="undelete(item)"
                        @overwite-local="overwriteSingle(item, 'cloud', 'local')"
                        @overwite-cloud="overwriteSingle(item, 'local', 'cloud')"
                      />
                      <cc-tooltip v-else inline content="Синхронизировать локальные данные с последними удаленными данными">
                        <v-btn icon @click="remoteUpdate(item)">
                          <v-icon color="primary">mdi-cloud-sync</v-icon>
                        </v-btn>
                      </cc-tooltip>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="light-panel">
                  <th class="py-2">{{ selectedItems.length }} Selected</th>
                  <th class="py-2"></th>
                  <th class="py-2">
                    <cc-tooltip
                      inline
                      content="Перезаписывает локальные данные выбранных элементов версиями, хранящимися в облаке."
                    >
                      <v-btn
                        small
                        color="primary"
                        :disabled="!selectedItems.length"
                        @click="overwriteSelected('cloud', 'local')"
                      >
                      Перезаписать локальный
                      </v-btn>
                    </cc-tooltip>
                  </th>
                  <th class="py-2">
                    <cc-tooltip
                      inline
                      content="Удаляет облачные данные для выбранных элементов и заменяет их копиями текущих локальных данных."
                    >
                      <v-btn
                        small
                        color="primary"
                        :disabled="!selectedItems.length"
                        @click="overwriteSelected('local', 'cloud')"
                      >
                      Перезаписать облако
                      </v-btn>
                    </cc-tooltip>
                  </th>
                  <th class="py-2"></th>
                  <th class="py-2">
                    <cc-tooltip
                      inline
                      content="Синхронизирует все выбранные элементы с последними обновленными данными."
                    >
                      <v-btn
                        small
                        color="primary"
                        :disabled="!selectedItems.length"
                        @click="syncSelected()"
                      >
                      Синхронизировать с последней версией
                      </v-btn>
                    </cc-tooltip>
                  </th>
                </tfoot>
              </v-simple-table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-row justify="center" align="center">
        <v-col cols="8">
          <cc-tooltip
            title="Синхронизировать данные"
            content="COMP/CON сравнит локальные и облачные данные, обновив все элементы (включая удаленные ресурсы) до последней найденной версии. Все элементы, помеченные для удаления более 30 дней, будут удалены без возможности восстановления."
          >
            <v-btn @click="syncAll()" color="primary" block x-large>
              <v-icon large class="mr-2">mdi-cloud-sync</v-icon>
              Умная синхронизация всех
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import SyncItemMenu from './SyncItemMenu.vue'
import {
  ListCloudItems,
  ProcessItemsList,
  SyncItem,
  DeleteForever,
  GetLocalItem,
  Overwrite,
  FlagCloudDelete,
  FlagCloudRestore,
  AutoSyncAll,
  AutoSyncRemotes,
  RemoteSyncItem,
} from '@/cloud/item_sync'
import { ICloudSyncable } from '@/classes/components'
import { Pilot } from '@/classes/pilot/Pilot'
import sleep from '@/util/sleep'
import { SaveAllLocalUpdates } from '@/io/BulkData'

export default Vue.extend({
  name: 'sync-manager',
  components: { SyncItemMenu },
  data: () => ({
    loading: false,
    overwriteCloud: false,
    overwriteLocal: false,
    confirmOverwriteCloud: false,
    confirmOverwriteLocal: false,
    items: [],
    cloudItemTypes: ['Active Mission', 'Mission', 'Encounter', 'NPC', 'Pilot'],
  }),
  async mounted() {
    this.fetch()
  },
  computed: {
    selectedItems() {
      return this.items.filter(x => x.selected)
    },
  },
  methods: {
    displayTypes(type) {
      switch (type) {
        case 'Active Mission':
          return 'Активная Миссия'
        case 'Mission':
          return 'Миссия'
        case 'Encounter':
          return 'Бой'
        case 'NPC':
          return 'НИП'
        case 'Pilot':
        default:
          return 'Пилот'
      }
    },
    selectAll(type) {
      this.itemsByType(type).forEach(i => {
        this.$set(i, 'selected', true)
      })
    },
    deselectAll(type) {
      this.itemsByType(type).forEach(i => {
        this.$set(i, 'selected', false)
      })
    },
    itemsByType(type) {
      return this.items.filter(x => x.itemType === type)
    },
    callsign(item) {
      if (item.itemType !== 'Pilot') return ''
      const p = GetLocalItem(item) as Pilot
      if (p && p.Callsign) return `${p.Callsign} //`
    },
    isAtLatest(item) {
      if (!item.lastModifiedCloud || !item.lastModifiedLocal) return false
      const sDiff =
        Math.abs(
          new Date(item.lastModifiedCloud).valueOf() - new Date(item.lastModifiedLocal).valueOf()
        ) / 1000
      return sDiff < 15
    },
    async fetch() {
      this.loading = true
      ListCloudItems()
        .then(res => {
          this.items = ProcessItemsList(res)
        })
        .finally(() => (this.loading = false))
    },
    async syncSingle(item) {
      this.loading = true
      SyncItem(item)
        .then(() => this.fetch())
        .then(() => this.$notify('Синхронизация прошла успешно', 'success'))
        .catch(() =>
          this.$notify(
            'При синхронизации произошла ошибка. Возможно, вам не хватает одного или нескольких необходимых LCP.',
            'error'
          )
        )
    },
    async syncSelected() {
      this.loading = true
      Promise.all(this.selectedItems.map(item => SyncItem(item, true)))
        .then(() => SaveAllLocalUpdates())
        .then(() => this.fetch())
        .then(() =>
          this.$notify(`Синхронизировано ${this.selectedItems.length} объектов успешно`, 'success')
        )
        .catch(() =>
          this.$notify(
            'При синхронизации произошла ошибка. Возможно, вам не хватает одного или нескольких необходимых LCP.',
            'error'
          )
        )
    },
    async overwriteSingle(item, source, dest) {
      this.loading = true
      Overwrite(item, source, dest)
        .then(() => this.fetch())
        .then(() => this.$notify('Перезапись прошла успешно', 'success'))
        .catch(() => this.$notify('Произошла ошибка при перезаписи.', 'error'))
    },
    async overwriteSelected(source, dest) {
      this.loading = true
      Promise.all(this.selectedItems.map(item => Overwrite(item, source, dest, true)))
        .then(() => SaveAllLocalUpdates())
        .then(() => this.fetch())
        .then(() =>
          this.$notify(`Заменено ${this.selectedItems.length} объектов успешно`, 'success')
        )
        .catch(() => this.$notify('Произошла ошибка при перезаписи.', 'error'))
    },
    async undelete(item) {
      const local = GetLocalItem(item) as ICloudSyncable
      if (local) {
        local.SaveController.restore()
        this.fetch()
      } else FlagCloudRestore(item).then(() => this.fetch())
    },
    async flagDelete(item) {
      const local = GetLocalItem(item) as ICloudSyncable
      if (local) {
        local.SaveController.delete()
        this.fetch()
      } else FlagCloudDelete(item).then(() => this.fetch())
    },
    deleteForever(item) {
      DeleteForever(item)
        .then(() => this.fetch())
        .then(() => this.$notify('Удаление успешно', 'success'))
        .catch(() =>
          this.$notify('Произошла ошибка при попытке удалить эту запись.', 'error')
        )
    },
    syncAll(hideAlert?: boolean) {
      this.loading = true
      AutoSyncAll()
        .then(() => AutoSyncRemotes())
        .then(() => sleep(500))
        .then(() => this.fetch())
        .then(() => {
          if (!hideAlert) this.$notify(`Синхронизировано ${this.items.length} объектов успешно`, 'success')
        })
        .catch(() => {
          if (!hideAlert) this.$notify('При синхронизации произошла ошибка.', 'error')
        })
    },
    async remoteUpdate(item) {
      const local = GetLocalItem(item) as ICloudSyncable
      try {
        RemoteSyncItem(local)
        this.$notify('Пилот синхронизирован с удаленным', 'success')
        this.fetch()
      } catch (error) {
        console.error(error)
        this.$notify('Произошла ошибка при попытке загрузить удаленные данные.', 'error')
      }
    },
  },
})
</script>
