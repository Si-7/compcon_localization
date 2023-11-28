<template>
  <v-container fluid style="margin-top: 50px; min-height: calc(100vh - 50px)">
    <div class="overline">//МИССИЯ ЗАВЕРШЕНА</div>
    <div class="heading mech mt-n6">{{ mission.Mission.Name }}</div>
    <p class="text-center flavor-text panel text--text" v-html="mission.Mission.Note" />
    <v-row dense justify="center">
      <v-col cols="auto">
        <div class="heading h3 accent--text mt-1">
          Результат:
        </div>
      </v-col>
      <v-col cols="auto ml-1">
        <v-combobox v-model="mission.Result" outlined dense hide-details :items="resolutions" />
      </v-col>
    </v-row>
    <v-divider class="my-3" />
    <cc-title>
      Отчет о действиях
    </cc-title>
    <p class="panel heading h3 py-3 text-center subtle--text">
      <v-icon large color="grey">mdi-lock</v-icon>
      <br />
      // ФУНКЦИОНАЛ В РАЗРАБОТКЕ //
    </p>
    <cc-title>
      Прогресс кампании
    </cc-title>
    <p class="panel heading h3 py-3 text-center subtle--text">
      <v-icon large color="grey">mdi-lock</v-icon>
      <br />
      // ФУНКЦИОНАЛ В РАЗРАБОТКЕ //
    </p>
    <router-link to="/gm/mission/selector">
      <v-btn text color="primary">
        <v-icon left>mdi-chevron-triple-left</v-icon>
        Вернуться к меню миссий
      </v-btn>
    </router-link>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { MissionStore } from '@/store'

export default Vue.extend({
  name: 'mission-debriefing',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    resolutions: ['Решительная Победа', 'Победа', 'Поражение', 'Катастрафическое Поражение', 'Ничья'],
  }),
  computed: {
    mission() {
      const store = getModule(MissionStore, this.$store)
      return store.ActiveMissions.find(x => x.ID === this.id)
    },
  },
})
</script>
