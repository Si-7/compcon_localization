<template>
  <cc-solo-dialog ref="dialog" icon="mdi-dna" large no-confirm title="Clone Pilot">
    <v-card-text>
      <v-row>
        <v-col>
          <div class="text-center body-text light-panel pa-2" style="border-radius: 3px">
            Дублирование или клонирование пилота уберет любые ссылки, сохраняя копию Пилота как нового персонажа на вашем аккаунте
          </div>
        </v-col>
      </v-row>
      <v-row dense justify="space-around">
        <v-col cols="5" class="text-center">
          <cc-tooltip
            inline
            title="Дублирование"
            content="Это создаст копию данных пилота, зарегистрированную в вашем списке пилотов."
          >
            <v-btn large block color="primary" @click="copyPilot">Duplicate Pilot</v-btn>
          </cc-tooltip>
        </v-col>
        <v-col cols="5" class="text-center">
          <cc-tooltip
            inline
            title="Клонировать"
            content="Это склонирует выбранного пилота. Клонированные персонажи не могут присоединиться к миссии в процессе и получают случайную причуду. Дополнительное клонирование или перепись субъективности добавляет дополнительные причуды."
          >
            <v-btn large block color="primary" :disabled="!!quirk" @click="rollQuirk">
              Флэш-клонировать пилота
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
      <v-scale-transition>
        <div v-if="quirk">
          <v-row align="center">
            <v-col>
              <div class="overline">ПРИЧУДА КЛОНА</div>
              <v-alert dense color="primary" outlined left>
                <div class="body-text stark--text font-weight-bold">{{ quirk }}</div>
              </v-alert>
            </v-col>
            <v-col cols="auto">
              <cc-tooltip simple content="Перебросить причуду">
                <v-btn icon large @click="rollQuirk">
                  <v-icon color="secondary" large>mdi-dice-6</v-icon>
                </v-btn>
              </cc-tooltip>
            </v-col>
          </v-row>
          <v-row v-if="quirk" align="center" justify="center">
            <v-col cols="6">
              <v-btn large block tile color="secondary darken-2" @click="clonePilot">
                Декантация флэш-клона
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-scale-transition>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import _ from 'lodash'
import { Pilot } from '@/class'

export default Vue.extend({
  name: 'clone-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    quirk: null,
  }),
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.quirk = null
      this.$refs.dialog.hide()
    },
    rollQuirk() {
      const compendium = getModule(CompendiumStore, this.$store)
      this.quirk = _.sample(compendium.Tables.quirks)
    },
    clonePilot() {
      const newPilot = Pilot.Deserialize(Pilot.Serialize(this.pilot))
      newPilot.GroupController.reset()
      newPilot.CloudController.reset()
      newPilot.RenewID()
      if (!this.pilot.Callsign.includes('※')) this.pilot.Callsign += '※'
      if (!this.pilot.Callsign.includes('※')) this.pilot.Name += '※'
      this.pilot.Heal()
      this.pilot.AddQuirk(this.quirk)
      for (const mech of newPilot.Mechs) {
        mech.RenewID()
      }
      newPilot.GroupController.SortIndex = -1
      this.$store.dispatch('addPilot', newPilot)
      this.hide()
    },
    copyPilot() {
      const newPilot = Pilot.Deserialize(Pilot.Serialize(this.pilot))
      newPilot.GroupController.reset()
      newPilot.CloudController.reset()
      newPilot.RenewID()
      newPilot.Callsign += '″'
      newPilot.Name += ' (КОПИЯ)'
      newPilot.Status = 'АКТИВЕН'
      for (const mech of newPilot.Mechs) {
        mech.RenewID()
      }
      newPilot.GroupController.SortIndex = -1
      this.$store.dispatch('addPilot', newPilot)
      this.hide()
    },
  },
})
</script>
