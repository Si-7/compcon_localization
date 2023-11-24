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
            Обновить
          </v-btn>
        </v-col>
      </v-row>

      <v-expansion-panels v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span>
              <v-chip dark color="primary" outlined x-small class="mt-n1 mr-2">
                <b>{{ items.length.toString().padStart(3, '0') }}</b>
              </v-chip>
              <span class="heading h3">LCP</span>
            </span>
            <v-spacer />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>
              <v-simple-table class="text-center">
                <thead>
                  <th>LCP</th>
                  <th>Локальная версия</th>
                  <th>Облачная версия</th>
                  <th>Статус</th>
                  <th>Опции</th>
                </thead>
                <tbody>
                  <tr v-for="item in items" :key="`item_${item.data.ID}`">
                    <td class="text-left">
                      <div class="heading h4">{{ item.data.Name }}</div>
                      <div class="caption">от {{ item.data.Author }}</div>
                    </td>
                    <td v-if="isAtLatest(item)" colspan="2">
                      <v-row no-gutters align="center">
                        <v-col><v-divider /></v-col>
                        <v-col cols="auto" class="px-2">
                          <b class="success--text text--darken-1">Синхронизировано</b>
                        </v-col>
                        <v-col><v-divider /></v-col>
                      </v-row>
                    </td>
                    <td v-if="!isAtLatest(item)">
                      <span
                        v-if="item.localVersion"
                        :class="item.latest === 'local' ? 'font-weight-bold' : 'text--disabled'"
                      >
                        {{ item.localVersion }}
                      </span>
                      <span v-else class="text--disabled"><i>Нет данных</i></span>
                    </td>
                    <td v-if="!isAtLatest(item)">
                      <span
                        v-if="item.cloudVersion"
                        :class="item.latest === 'cloud' ? 'font-weight-bold' : 'text--disabled'"
                      >
                        {{ item.cloudVersion }}
                      </span>
                      <span v-else class="text--disabled"><i>Нет данных</i></span>
                    </td>
                    <td>
                      <cc-tooltip
                        inline
                        v-if="isAtLatest(item)"
                        title="Объект синхронизирован"
                        :content="`Одна и та же версия этого пакета содержимого хранится как локально, так и в вашей облачной учетной записи.`"
                      >
                        <v-icon color="success darken-1">mdi-check-bold</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-else-if="item.latest === 'local'"
                        title="Обнаружены локальные изменения"
                        :content="`Облачные данные не найдены, или локальная версия этого пакета содержимого является последней. Синхронизация перезапишет облачные данные этого пакета содержимого локальной версией.`"
                      >
                        <v-icon color="panel">mdi-check</v-icon>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        v-else
                        title="Обнаружены изменения в облаке"
                        :content="`Локальные данные не найдены, или облачная версия этого пакета содержимого является последней. При синхронизации локальные данные этого пакета содержимого перезапишутся версией, хранящейся в облаке.`"
                      >
                        <v-icon color="panel">mdi-check</v-icon>
                      </cc-tooltip>
                      <div v-if="item.localVersion" class="d-inline">
                        <cc-tooltip
                          v-if="item.data.Active"
                          inline
                          title="LCP Активен"
                          :content="`Этот пакет установлен и активен`"
                        >
                          <v-icon color="success">mdi-power</v-icon>
                        </cc-tooltip>
                        <cc-tooltip
                          v-else
                          inline
                          title="LCP Не активен"
                          :content="`Этот пакет не активен. Любые пользовательские данные, для которых требуется этот пакет содержимого, не будут загружены.`"
                        >
                          <v-icon color="panel">mdi-power</v-icon>
                        </cc-tooltip>
                      </div>
                    </td>
                    <td>
                      <cc-tooltip inline content="Удалить навсегда">
                        <v-btn icon color="error" @click="deleteItem(item)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </cc-tooltip>
                    </td>
                  </tr>
                </tbody>
                <tfoot v-show="items.length" class="light-panel">
                  <tr>
                    <td colspan="4" />
                    <td>
                      <cc-tooltip
                        title="Синхронизировать все"
                        content="Синхронизирует все локальные и облачные данные LCP с последней найденной версией. Из-за особенностей хранения данных LCP элементы не могут быть синхронизированы по отдельности."
                      >
                        <v-btn small color="accent" @click="syncAll">Синхронизировать все</v-btn>
                      </cc-tooltip>
                    </td>
                  </tr>
                </tfoot>
              </v-simple-table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <v-alert prominent icon="mdi-alert" outlined color="error">
        The following items have missing content pack requirements. These items may not load, or may
        cause the app to malfunction
        <v-row dense>
          <v-col>item name</v-col>
          <v-col>required pack at version</v-col>
          <v-col><v-btn>attempt recovery</v-btn></v-col>
          <v-col @click="delall()"><v-btn>delete item</v-btn></v-col>
        </v-row>
      </v-alert> -->
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import SyncItemMenu from './SyncItemMenu.vue'
import { GetItemsList, SyncLCPs, DeleteLCP, DeleteAllLocal, DeleteAllCloud } from '@/cloud/lcp_sync'

export default Vue.extend({
  name: 'sync-manager',
  components: { SyncItemMenu },
  data: () => ({
    panel: 0,
    loading: false,
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
    selectAll() {
      this.items.forEach(i => {
        this.$set(i, 'selected', true)
      })
    },
    deselectAll() {
      this.items.forEach(i => {
        this.$set(i, 'selected', false)
      })
    },
    itemsByType(type) {
      return this.items.filter(x => x.itemType === type)
    },
    isAtLatest(item) {
      return item.localVersion === item.cloudVersion
    },
    async fetch() {
      this.loading = true
      this.items = await GetItemsList()
      this.loading = false
    },
    syncAll(hideAlert) {
      this.loading = true
      SyncLCPs()
        .then(() => this.fetch())
        .then(() => {
          if (!hideAlert) this.$notify(`Синхронизировано ${this.items.length} объектов успешно`, 'success')
        })
        .catch(() => {
          if (!hideAlert) this.$notify('При синхронизации произошла ошибка.', 'error')
        })
    },
    deleteItem(item) {
      this.loading = true
      DeleteLCP(item)
        .then(() => this.fetch())
        .then(() => this.$notify(`Удаление успешно`, 'success'))
        .catch(() => this.$notify('При удалении произошла ошибка.', 'error'))
    },
    deleteAllLocal() {
      DeleteAllLocal()
        .then(() => this.fetch())
        .then(() => this.$notify(`Удаление успешно`, 'success'))
        .catch(() => this.$notify('При удалении произошла ошибка.', 'error'))
    },
    deleteAllCloud() {
      DeleteAllCloud()
        .then(() => this.fetch())
        .then(() => this.$notify(`Удаление успешно`, 'success'))
        .catch(() => this.$notify('При удалении произошла ошибка.', 'error'))
    },
  },
})
</script>
