<template>
  <div :class="$vuetify.breakpoint.smAndDown ? 'mt-5' : ''">
    <action-detail-expander :action="action" />
    <v-row justify="center" align="center">
      <v-col cols="12" lg="">
        <v-row dense justify="space-around">
          <v-col cols="12" lg="auto">
            <div class="heading h3 text-center">Выберите один из следующих вариантов:</div>
            <v-radio-group v-model="state.StabilizeMajor" dense hide-details column>
              <v-radio
                label="Охладите своего меха, очистив его от нагрева и Уязвимости."
                value="cool"
                color="accent"
              />
              <v-radio
                :label="`Отметьте 1 Ремонт, чтобы восстановить все ПЗ. ${
                  !mech.CurrentRepairs ? ' // ЛИМИТ РЕМОНТА ИСЧЕРПАН //' : ''
                }`"
                value="repair"
                color="accent"
                :disabled="!mech.CurrentRepairs"
              />
            </v-radio-group>
          </v-col>
          <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="auto">
            <v-divider vertical />
          </v-col>
          <v-col cols="12" lg="auto">
            <div class="heading h3 text-center">Кроме того, выберите один из следующих вариантов:</div>
            <v-radio-group v-model="state.StabilizeMinor" color="accent" dense hide-details column>
              <v-radio
                label="Зарядить все Заряжаемое оружие"
                value="reload"
                color="accent"
              />
              <v-radio
                label="Удалить все Горение, которое в настоящее время воздействует на вашего меха."
                value="end_burn"
                color="accent"
                :disabled="mech.Burn === 0"
              />
              <v-radio
                label="Устранить состояние"
                value="end_self_condition"
                color="accent"
                :disabled="!mech.Conditions.length"
              />
              <v-radio
                label="Снять состояние соседнего союзного персонажа"
                value="end_ally_condition"
                color="accent"
              />
            </v-radio-group>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto">
        <v-btn
          large
          tile
          block
          dark
          :disabled="!canUse"
          :color="action.Color"
          @click="$emit('use')"
        >
          <v-icon left>{{ action.Icon }}</v-icon>
          {{ action.Name }}
        </v-btn>
        <v-btn
          v-if="action.Activation !== 'Свободное'"
          small
          dark
          tile
          block
          :disabled="!canUse"
          color="action--free"
          @click="$emit('use', true)"
        >
          <v-icon left small>cci-free-action</v-icon>
          Свободное Действие
          <cc-tooltip
            inline
            :content="`Специальные правила или снаряжение могут позволить использовать ${action.Name} свободным действием. Нажатие на эту кнопку совершит действие, не используя ${action.Activation} действие`"
          >
            <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
          </cc-tooltip>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'

export default Vue.extend({
  name: 'stabilize-dialog',
  components: { ActionDetailExpander },
  props: {
    used: { type: Boolean },
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  computed: {
    state() {
      return this.mech.Pilot.State
    },
    canUse() {
      return this.state.StabilizeMajor && this.state.StabilizeMinor
    },
  },
})
</script>
