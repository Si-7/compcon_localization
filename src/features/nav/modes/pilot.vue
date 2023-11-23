<template>
  <div>
    <router-link to="/pilot_management">
      <v-btn text color="white" tile>Список Пилотов</v-btn>
    </router-link>
    <v-divider v-if="pilot" vertical dark class="ml-2 mr-2" />
    <v-menu v-if="pilot" nudge-bottom="35px" open-on-hover>
      <template v-slot:activator="{ on }">
        <v-btn light tile color="white" elevation="0" v-on="on">
          {{ pilot.Callsign }}
          <v-icon light>arrow_drop_down</v-icon>
        </v-btn>
      </template>
      <v-list two-line subheader>
        <v-list-item :to="`/active/${pilot.ID}`">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon large>cci-activate</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Активный режим</v-list-item-title>
            <v-list-item-subtitle>
              Геймплей менеджер для управления пилотом во время сессий ЛАНСЕР
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="pilotSheet()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon large>cci-pilot</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Лист пилота</v-list-item-title>
            <v-list-item-subtitle>
              Просматривайте, редактируйте и обновляйте информацию пилота
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="mechHangar()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon large>cci-frame</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Ангар мехов</v-list-item-title>
            <v-list-item-subtitle>
              Стройте и управляйте мехами этого пилота
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import activePilot from '../../pilot_management/mixins/activePilot'

import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'pilot-nav-mode',
  methods: {
    pilotSheet() {
      this.$router.push({ name: 'pilot_sheet' })
    },
    mechHangar() {
      this.$router.push({ name: 'mech_hangar' })
    },
  },
})
</script>
