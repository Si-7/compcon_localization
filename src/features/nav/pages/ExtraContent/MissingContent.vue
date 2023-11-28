<template>
  <div>
    <v-row dense class="panel" justify="center" align="center">
      <v-col cols="auto" style="letter-spacing: 5px">АНАЛИЗ ДАННЫХ</v-col>
    </v-row>
    <v-slide-x-reverse-transition>
      <v-expansion-panels v-if="!loading" class="mt-2">
        <v-expansion-panel :disabled="!missingLength">
          <v-expansion-panel-header v-if="!missingLength" class="heading h4">
            <span>
              <v-icon color="success" class="mt-n1">mdi-check-bold</v-icon>
              Проблем не замечено
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-header v-else class="heading h3 stark--text">
            <span>
              <span class="error--text">{{ missingLength }}</span>
              {{ missingLength > 1 ? 'проблем' : 'проблема' }} замечена
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p class="body-text" v-if="missingLength > 1">
              COMP/CON определил, что следующие элементы не могут быть загружены и требуют пакетов LCP, которые не установлены или не активированы:
            </p>
            <div v-for="key in Object.keys(missing)" :key="key">
              <v-card outlined v-for="(item, n) in missing[key]" :key="`mp_${n}`">
                <v-card-title v-if="key === 'pilots'" class="heading h3 mb-n4">
                  Данные Пилота:
                  <span class="primary--text">
                    {{ item.callsign }}
                    <cc-slashes />
                    {{ item.name }}
                  </span>
                </v-card-title>
                <v-card-title v-if="key === 'npcs'" class="heading h3 mb-n4">
                  Данные НИП:
                  <span class="primary--text">
                    {{ item.class }}
                    <cc-slashes />
                    {{ item.name }}
                  </span>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <div v-if="notActive(item.brews).length">
                        <div class="caption">ДЕАКТИВИРОВАННЫЕ LCP</div>
                        <div v-for="pack in notActive(item.brews)" :key="pack" class="ml-2">
                          <span class="body-text">
                            LCP
                            <b v-text="pack" />
                            установлен, но деактивирован.
                          </span>
                        </div>
                      </div>
                      <div v-if="notInstalled(item.brews).length">
                        <div v-if="item.brews[0].LcpName">
                          <div class="caption mt-2">ОТСУТСТВУЮЩИЕ LCP</div>
                          <div
                            v-for="brew in notInstalled(item.brews)"
                            :key="brew.LcpId"
                            class="ml-2"
                          >
                            <span class="body-text">
                              LCP
                              <b v-text="`${brew.LcpName} @ ${brew.LcpVersion}`" />
                              отсутствует.
                            </span>
                            <div v-if="brew.Website">
                              Может быть возможно скачать этот пакет в:
                              <a target="_blank" :href="brew.Website" v-text="brew.Website" />
                            </div>
                            <auto-updater :brew="brew" @update="forceUpdate(item, key)" />
                          </div>
                        </div>
                        <div v-else>
                          <div
                            v-for="brew in notInstalled(item.brews)"
                            :key="brew.LcpId"
                            class="ml-2"
                          >
                            <span class="body-text">
                              LCP
                              <b v-text="brew" />
                              отсутствует.
                            </span>
                            <div>Эти данные были сохранены в более старой версии COMP/CON.</div>
                            <auto-updater :brew="brew" @update="forceUpdate(item, key)" />
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="auto" align-self="center">
                      <cc-tooltip
                        inline
                        title="Удалить объект"
                        content="Удалить объект из локальных данных"
                      >
                        <v-btn icon color="error" @click="deleteItem(item, key)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </cc-tooltip>
                      <cc-tooltip
                        inline
                        title="Загрузить принудительно"
                        content="Заставьте COMP/CON загрузить эти данные. Это полезно, если у вас есть устаревшие (но загружаемые) данные или COMP/CON допустил ошибку при анализе содержимого LCP."
                      >
                        <v-btn icon color="secondary" @click="forceItem(item, key)">
                          <v-icon>mdi-download-box</v-icon>
                        </v-btn>
                      </cc-tooltip>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore, NpcStore } from '@/store'
import { Pilot } from '@/classes/pilot/Pilot'
import AutoUpdater from './components/AutoUpdater.vue'

export default Vue.extend({
  name: 'missing-content-pane',
  components: { AutoUpdater },
  data: () => ({
    loading: false,
  }),
  computed: {
    missing() {
      return getModule(CompendiumStore, this.$store).MissingContent
    },

    missingLength() {
      if (!this.missing) return 0
      return (this.missing.pilots?.length || 0) + (this.missing.npcs?.length || 0)
    },
  },
  methods: {
    notActive(itemBrews) {
      return getModule(CompendiumStore, this.$store)
        .ContentPacks.filter(x => itemBrews.some(y => y.LcpId === x.ID))
        .map(p => `${p.Name} @ ${p.Version}`)
    },
    notInstalled(itemBrews) {
      return itemBrews.filter(
        x => !getModule(CompendiumStore, this.$store).ContentPacks.some(y => y.ID === x.LcpId)
      )
    },
    deleteItem(item, key) {
      if (key === 'pilots') {
        getModule(PilotManagementStore, this.$store).deleteMissingPilot(item)
      } else if (key === 'npcs') {
        getModule(NpcStore, this.$store).deleteMissingNpc(item)
      }
    },
    forceItem(item, key) {
      if (key === 'pilots') {
        Pilot.AddNew(item)
        getModule(PilotManagementStore, this.$store).deleteMissingPilot(item)
      } else if (key === 'npcs') {
        getModule(NpcStore, this.$store).deleteMissingNpc(item)
      }
    },
    forceUpdate(item, key) {
      item.brews.splice(0, item.brews.length)
      this.forceItem(item, key)
    },
  },
})
</script>
