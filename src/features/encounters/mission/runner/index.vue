<template>
  <v-container fluid style="margin-top: 50px; min-height: calc(100vh - 50px)">
    <v-row justify="center">
      <v-col>
        <cc-title class="mt-3 ml-n12" color="primary">&emsp;АКТИВНЫЕ МИССИИ</cc-title>
        <v-data-table
          :items="activeMissions"
          :headers="headers"
          no-data-text="Нет активных миссий"
          disable-pagination
          hide-default-footer
          class="transparent heading h3"
          style="min-width: 100%"
        >
          <template v-slot:item.Mission.Name="{ item }">
            {{ item.Mission.Name }}
            <span class="overline">
              {{
                item.Mission.Campaign && item.Mission.Campaign !== 'Нет'
                  ? `//${item.Mission.Campaign}`
                  : ''
              }}
            </span>
          </template>
          <template v-slot:item.Encounter="{ item }">
            <span v-if="item.Mission.Steps[item.Step].Name">
              {{ item.Mission.Steps[item.Step].Name }}
            </span>
            <span v-else>{{ item.Mission.Steps[item.Step].IsLong ? 'Полный' : 'Короткий' }} отдых</span>
          </template>
          <template v-slot:item.Continue="{ item }">
            <v-menu offset-y offset-x top nudge-left="30px">
              <template v-slot:activator="{ on }">
                <v-btn small icon color="error" class="fadeSelect mr-2" v-on="on">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-text class="text-center">
                  Это удалит активную миссию 
                  <b>({{ item.Mission.Name }} - {{ item.StartDate }})</b>
                  и весь прогресс будет утерян.
                  <br />
                  Вы уверены?
                  <v-divider class="my-2" />
                  <v-row dense>
                    <v-btn small text>ОТМЕНА</v-btn>
                    <v-btn small color="error" class="ml-auto" @click="deleteActiveMission(item)">
                      ПОДТВЕРДИТЬ
                    </v-btn>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-menu>
            <router-link :to="`runner/${item.ID}`">
              <v-btn small tile color="primary" class="white--text">
                ПРОДОЛЖИТЬ МИССИЮ
                <v-icon right>mdi-chevron-double-right</v-icon>
              </v-btn>
            </router-link>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
        <cc-title class="mt-3 ml-n12" color="secondary">&emsp;ДОСТУПНЫЕ МИССИИ</cc-title>
        <v-data-table
          :items="availableMissions"
          :headers="availableHeaders"
          group-by="Campaign"
          no-data-text="Нет сохраненных миссий"
          class="transparent heading"
          style="min-width: 100%"
        >
          <template v-slot:group.header="h" class="transparent">
            <div class="secondary darken-2 sliced">
              <span v-if="h.group && h.group !== 'null'" class="heading white--text text-uppercase">
                <span v-if="Array.isArray(h.group)" v-html="h.group.join(', ')" />
                <span v-else v-html="h.group" />
              </span>
              <span v-else>НЕТ</span>
            </div>
          </template>
          <template v-slot:item.Name="{ item }">
            <span class="heading h3">
              {{ item.Name }}
            </span>
          </template>
          <template v-slot:item.Encounters="{ item }">
            <span class="heading h3">
              {{ item.Encounters.length }}
              <span class="overline">// {{ item.Rests.length }} отдыхов</span>
            </span>
          </template>
          <template v-slot:item.Labels="{ item }">
            <v-chip v-for="l in item.Labels" :key="item.ID + l" small>{{ l }}</v-chip>
          </template>
          <template v-slot:item.Start="{ item }">
            <v-btn small tile color="primary" class="white--text" :to="`briefing/${item.ID}`">
              НАЧАТЬ МИССИЮ
              <v-icon right>mdi-chevron-double-right</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
        <cc-title class="mt-3 ml-n12" color="pilot">&emsp;ЗАВЕРШЕННЫЕ МИССИИ</cc-title>
        <v-data-table
          :items="completedMissions"
          :headers="completedHeaders"
          group-by="Campaign"
          no-data-text="Нет завершенных миссий"
          class="transparent heading h3"
          style="min-width: 100%"
        >
          <template v-slot:group.header="h" class="transparent">
            <div class="pilot sliced">
              <span v-if="h.group && h.group !== 'null'" class="heading white--text text-uppercase">
                <span v-if="Array.isArray(h.group)" v-html="h.group.join(', ')" />
                <span v-else v-html="h.group" />
              </span>
              <span v-else>НЕТ</span>
            </div>
          </template>
          <template v-slot:item.Remove="{ item }">
            <v-menu offset-y offset-x top nudge-left="30px">
              <template v-slot:activator="{ on }">
                <v-btn small icon color="error" class="fadeSelect mr-2" v-on="on">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-text class="text-center">
                  Это удалит сохраненные данные миссии
                  <b>{{ item.Mission.Name }}</b>
                  .
                  <br />
                  Вы уверены?
                  <v-divider class="my-2" />
                  <v-row dense>
                    <v-btn small text>ОТМЕНА</v-btn>
                    <v-btn small color="error" class="ml-auto" @click="deleteActiveMission(item)">
                      ПОДТВЕРДИТЬ
                    </v-btn>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { MissionStore } from '@/store'
import { ActiveMission } from '@/class'

export default Vue.extend({
  name: 'active-mission-landing',
  data: () => ({
    headers: [
      { text: 'Название', value: 'Mission.Name', align: 'left' },
      { text: 'Сцена', value: 'Encounter' },
      { text: 'Раунд', value: 'Round' },
      { text: 'Дата начала', value: 'StartDate' },
      { text: '', value: 'Continue', align: 'right', sortable: false },
    ],
    availableHeaders: [
      { text: 'Название', value: 'Name', align: 'left' },
      { text: 'Сцены', value: 'Encounters' },
      { text: 'Ярлыки', value: 'Labels' },
      { text: '', value: 'Start', align: 'right', sortable: false },
    ],
    completedHeaders: [
      { text: 'Название', value: 'Mission.Name', align: 'left' },
      { text: 'Дата начала', value: 'StartDate' },
      { text: 'Дата конца', value: 'EndDate' },
      { text: 'Результат', value: 'Result' },
      { text: '', value: 'Remove', align: 'right', sortable: false },
    ],
  }),
  computed: {
    availableMissions() {
      const store = getModule(MissionStore, this.$store)
      return store.Missions
    },
    activeMissions() {
      const store = getModule(MissionStore, this.$store)
      return store.ActiveMissions.filter(x => !x.IsComplete)
    },
    completedMissions() {
      const store = getModule(MissionStore, this.$store)
      return store.ActiveMissions.filter(x => x.IsComplete)
    },
  },
  created() {
    const store = getModule(MissionStore, this.$store)
    store.Missions.forEach(m => m.ValidateSteps())
  },
  methods: {
    deleteActiveMission(m: ActiveMission) {
      m.SaveController.delete()
    },
  },
})
</script>
