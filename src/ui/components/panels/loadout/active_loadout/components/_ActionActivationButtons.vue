<template>
  <v-col cols="auto">
    <v-btn
      large
      tile
      block
      class="white--text"
      :disabled="disableCostActivate"
      :color="`${action.Color}`"
      @click="select()"
    >
      <v-icon left>{{ action.Icon }}</v-icon>
      {{ action.Name }}
    </v-btn>
    <v-btn
      v-if="!fulltech && action.Activation !== 'Свободное' && action.Activation !== 'Протокол'"
      small
      tile
      block
      class="white--text"
      color="action--free"
      @click="select(true)"
    >
      <v-icon left small>cci-free-action</v-icon>
      Свободное Действие
      <cc-tooltip
        inline
        :content="
          `Специальные правила или снаряжение могут позволить использовать ${action.Name} свободным действием. Нажатие на эту кнопку совершит действие, не используя ${action.Activation} действие`
        "
      >
        <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
      </cc-tooltip>
    </v-btn>
    <div v-if="action.HeatCost" class="overline error--text text-center">
      ПРЕДУПРЕЖДЕНИЕ: Это действие нанесет {{ action.HeatCost }} Нагрева
    </div>
  </v-col>
</template>

<script lang="ts">
import { ActivationType } from '@/class'
import Vue from 'vue'
export default Vue.extend({
  name: 'action-activation-buttons',
  props: {
    used: { type: Boolean },
    fulltech: { type: Boolean, default: false },
    action: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    disableCostActivate() {
      if (this.used && !this.fulltech) return true
      if (this.action.Activation === ActivationType.Protocol)
        return !this.mech.Pilot.State.IsProtocolAvailable
      let activationCost = 0
      if (
        this.action.Activation === ActivationType.Quick ||
        this.action.Activation === ActivationType.QuickTech
      )
        activationCost = 1
      else if (
        this.action.Activation === ActivationType.Full ||
        this.action.Activation === ActivationType.FullTech
      )
        activationCost = 2
      return this.mech.Pilot.State.Actions < activationCost
    },
  },
  methods: {
    select(free: boolean) {
      this.$emit('use', free)
    },
  },
})
</script>
