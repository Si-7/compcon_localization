<template>
  <v-col class="py-0">
    <span class="text-uppercase stat-text">{{ title }}</span>
    <span class="flavor-text subtle--text">({{ skillPoints || 0 }})</span>
    <cc-tooltip simple :content="tooltip()">
      <cc-rating :model="skillPoints" :max="6" dense color="secondary" />
    </cc-tooltip>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'hase-pips',
  props: {
    title: {
      type: String,
      required: true,
    },
    skillPoints: {
      type: Number,
      required: true,
    },
  },
  methods: {
    //TODO: move into rules util class
    tooltip(): string {
      switch (this.title) {
        case 'корпус':
          return `ПЗ меха <b>+${this.skillPoints * 2}</b><br>ЛИМИТ РЕМОНТА <b>+${Math.floor(
            this.skillPoints / 2
          )}</b>`
        case 'маневренность':
          return `УКЛОНЕНИЕ <b>+${this.skillPoints}</b><br>СКОРОСТЬ <b>+${Math.floor(
            this.skillPoints / 2
          )}</b>`
        case 'системы':
          return `Э-ЗАЩИТА <b>+${this.skillPoints}</b><br>ТЕХНИЧЕСКАЯ АТАКА <b>+${
            this.skillPoints
          }</b><br>СП <b>+${Math.floor(this.skillPoints / 2)}</b>`
        case 'инженерия':
          return `ТЕПЛОВОЙ МАКСИМУМ <b>+${
            this.skillPoints
          }</b><br>БОНУС ОГРАНИЧЕННЫХ СИСТЕМ <b>+${Math.floor(this.skillPoints / 2)}</b>`
        default:
          return ''
      }
    },
  },
})
</script>
