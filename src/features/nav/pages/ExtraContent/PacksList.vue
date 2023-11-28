<template>
  <div class="packsList">
    <v-data-table
      hide-default-footer
      disable-pagination
      no-data-text="Нет установленных пакетов контента."
      :headers="headers"
      :items="contentPacks"
      show-expand
      item-key="Key"
    >
      <!-- Active toggle -->
      <template v-slot:[`item.toggleActive`]="{ item }">
        <v-switch
          :input-value="item.Active"
          color="primary"
          @change="toggleActive(item.ID, $event)"
        />
      </template>
      <!-- Name -->
      <template v-slot:[`item.Name`]="{ item }">
        <span class="heading h3" :class="item.Active ? 'accent--text' : 'subtle--text font-italic'">
          {{ item.Name }}
        </span>
      </template>
      <!-- Version -->
      <template v-slot:[`item.Version`]="{ item }">
        <span class="packVersion">
          {{ item.Version }}
        </span>
      </template>
      <!-- Delete action -->
      <template v-slot:[`item.deleteAction`]="{ item }">
        <v-menu offset-y offset-x top nudge-left="30px">
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="fadeSelect" v-on="on">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="text-center body-text">
              <p>
                Это приведет к удалению этого пакета и всего его содержимого из COMP/CON. 
                Пользовательские данные, основанные на этом контенте, будут недоступны и 
                могут вызвать ошибки. Вы уверены что хотите продолжить?
              </p>
              <v-divider class="my-2" />
              <v-row dense>
                <v-btn small text>ОТМЕНА</v-btn>
                <v-btn small color="error" class="ml-auto" @click="deletePack(item.ID)">
                  ПОДТВЕРДИТЬ
                </v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
      <!-- Expanded view -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="py-4 px-6 w-100 light-panel">
          <v-row>
            <v-col>
              <p class="body-text text--text pa-2 mb-1">
                <span v-if="item.Description">
                  {{ item.Description }}
                </span>
                <span v-else>Нет описания.</span>
              </p>

              <div v-if="item.Website" class="mt-2">
                <v-divider class="ma-1" />
                <v-btn target="_blank" :href="item.Website" text color="secondary">
                  <v-icon prepend class="mr-1">open_in_new</v-icon>
                  &nbsp;Сайт
                </v-btn>
              </div>
            </v-col>
            <v-col cols="2">
              <v-img :src="item.ImageURL" alt="Pack image" max-width="200px" max-height="300px" />
            </v-col>
          </v-row>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore, NpcStore } from '@/store'

import { ContentPack } from '@/class'

@Component
export default class PacksList extends Vue {
  private expanded
  private compendiumStore = getModule(CompendiumStore, this.$store)

  public async toggleActive(packID: string, active: boolean): Promise<void> {
    await this.compendiumStore.setPackActive({
      packID,
      active,
    })
    await this.reload()
  }

  public async deletePack(id: string): Promise<void> {
    await this.compendiumStore.deleteContentPack(id)
    await this.reload()
  }

  public get contentPacks(): ContentPack[] {
    return this.compendiumStore.ContentPacks
  }

  public async reload() {
    this.$emit('start-load')
    const pilotStore = getModule(PilotManagementStore, this.$store)
    const npcStore = getModule(NpcStore, this.$store)
    const missing = { pilots: [], npcs: [] }
    await pilotStore.loadPilots()
    missing.pilots = pilotStore.MissingPilots
    await npcStore.loadNpcs()
    missing.npcs = npcStore.MissingNpcs
    await this.compendiumStore.setMissingContent(missing)
    this.$emit('end-load')
  }

  public headers = [
    { text: 'Активирован', value: 'toggleActive', sortable: false },
    { text: 'Название', value: 'Name' },
    { text: 'Автор', value: 'Author' },
    { text: 'Версия', value: 'Version' },
    { text: '', value: 'deleteAction', sortable: false },
  ]
}
</script>

<style scoped>
.packsList >>> .v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none;
}
</style>
