<template>
  <v-container fluid class="pt-0">
    <v-row dense class="stat-text pt-0 pb-0 mt-n2">
      <v-col cols="6" md="4" xl="3">
        <div class="overline mb-n3 subtle--text">ПОЗЫВНОЙ</div>
        <cc-short-string-editor @set="pilot.Callsign = $event">
          {{ pilot.Callsign }}
        </cc-short-string-editor>
      </v-col>
      <v-col cols="6" md="4" xl="3">
        <div class="overline mb-n3 subtle--text">ИМЯ</div>
        <cc-short-string-editor @set="pilot.Name = $event">{{ pilot.Name }}</cc-short-string-editor>
      </v-col>
      <v-col cols="6" md="4" xl="3">
        <div class="overline mb-n3 subtle--text">ПРЕДЫСТОРИЯ</div>
        <cc-short-string-editor class="d-inline" @set="pilot.Background = $event">
          {{ pilot.Background }}
        </cc-short-string-editor>
        <span>
          <cc-background-selector
            :pilot="pilot"
            small
            class="d-inline fadeSelect ml-n1"
            @select="pilot.Background = $event"
          />
        </span>
      </v-col>
      <v-col cols="6" md="4" xl="3">
        <div class="overline mb-n3 subtle--text">ИГРОК</div>
        <cc-short-string-editor @set="pilot.PlayerName = $event">
          {{ pilot.PlayerName || '---' }}
        </cc-short-string-editor>
      </v-col>
      <v-col cols="6" md="4" xl="3">
        <div class="overline mb-n3 subtle--text">СТАТУС</div>
        <span :class="`stat-text ${statusColor()}--text`">{{ pilot.Status }}</span>
        <cc-combo-select :items="pilotStatuses" @set="pilot.Status = $event" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import { Auth } from 'aws-amplify'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'ident-block',
  data: () => ({
    pilotStatuses: [
      { text: 'АКТИВЕН', value: 'АКТИВЕН' },
      { text: 'НЕАКТИВЕН', value: 'НЕАКТИВЕН' },
      { text: 'В ОТСТАВКЕ', value: 'В ОТСТАВКЕ' },
      { text: 'ПРОПАЛ БЕЗ ВЕСТИ', value: 'ПРОПАЛ БЕЗ ВЕСТИ' },
      { text: 'УБИТ В БОЮ', value: 'УБИТ В БОЮ' },
      { text: 'НЕИЗВЕСТНО', value: 'НЕИЗВЕСТНО' },
    ],
    noteColor: '',
    notification: '',
    syncing: false,
    currentAuthedUser: null,
  }),
  async mounted() {
    await Auth.currentAuthenticatedUser().then(res => {
      this.currentAuthedUser = !!res.username
    })
  },
  methods: {
    statusColor(): string {
      switch (this.pilot.Status.toLowerCase()) {
        case 'активен':
          return 'success'
          break
        case 'пропал без вести':
        case 'убит в бою':
          return 'error'
        default:
          return 'text'
          break
      }
    },
  },
})
</script>
