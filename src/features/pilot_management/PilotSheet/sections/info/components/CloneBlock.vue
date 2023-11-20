<template>
  <div>
    <v-alert v-if="pilot.Status === 'УБИТ В БОЮ' || pilot.IsDead" prominent dense outlined color="error">
      <v-icon slot="prepend" size="80" class="mr-2">mdi-skull</v-icon>
      <div :class="`heading ${$vuetify.breakpoint.mdAndUp ? 'h1' : 'h3'} pb-2 text-center`">
        УБИТ В БОЮ
      </div>
      <div style="position: relative">
        <div
          :style="
            $vuetify.breakpoint.mdAndUp
              ? 'position: absolute; bottom: -3px; right: -3px'
              : 'text-align: center'
          "
        >
          <v-menu offset-y offset-x>
            <template v-slot:activator="{ on }">
              <v-btn color="secondary" x-small outlined v-on="on">Флэш-клонировать пилота</v-btn>
            </template>
            <cc-confirmation
              content="Это склонирует выбранного пилота. Клонированные персонажи не могут присоединиться к миссии в процессе и получают случайную причуду. Дополнительное клонирование или перепись субъективности добавляет дополнительные причуды."
              @confirm="setQuirk"
            />
          </v-menu>
          <v-menu offset-y offset-x>
            <template v-slot:activator="{ on }">
              <v-btn color="pimary" x-small class="fadeSelect ml-3" v-on="on">
                <v-icon small left>mdi-reload</v-icon>
                Вернуть
              </v-btn>
            </template>
            <cc-confirmation
              content="Это восстановит выбранного пилота и очистит статусы Убит в бою и Нокаут."
              @confirm="pilot.Restore()"
            />
          </v-menu>
        </div>
      </div>
    </v-alert>
    <div v-if="pilot.Quirks.length && !hideQuirks">
      <div class="flavor-text font-weight-bold stark--text">ПРИЧУДЫ КЛОНА</div>
      <v-row v-for="(q, i) in pilot.Quirks" :key="`clone_quirk_${i}`" dense align="start">
        <v-col>
          <v-alert icon="mdi-dna" prominent dense color="primary" outlined>
            <v-textarea
              :value="q"
              dense
              hide-details
              rows="1"
              auto-grow
              class="body-text"
              :readonly="readonly"
              @change="updateQuirk(i, $event)"
              @blur="pilot.SaveController.save()"
            />
          </v-alert>
        </v-col>
        <v-col v-if="!readonly" cols="auto">
          <v-menu offset-y offset-x>
            <template v-slot:activator="{ on }">
              <cc-tooltip content="Убрать причуду клона">
                <v-btn icon class="fadeSelect" v-on="on" @click="pilot.RemoveQuirk(i)">
                  <v-icon large>close</v-icon>
                </v-btn>
              </cc-tooltip>
            </template>
          </v-menu>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

import _ from 'lodash'

export default vueMixins(activePilot).extend({
  name: 'clone-block',
  props: {
    hideQuirks: { type: Boolean },
    readonly: { type: Boolean },
  },
  methods: {
    setQuirk() {
      if (!this.pilot.Callsign.includes('※')) this.pilot.Callsign += '※'
      if (!this.pilot.Callsign.includes('※')) this.pilot.Name += '※'
      this.pilot.Heal()
      const compendium = getModule(CompendiumStore, this.$store)
      this.pilot.AddQuirk(_.sample(compendium.Tables.quirks))
    },
    updateQuirk(index, str) {
      this.$set(this.pilot.Quirks, index, str)
    },
  },
})
</script>
