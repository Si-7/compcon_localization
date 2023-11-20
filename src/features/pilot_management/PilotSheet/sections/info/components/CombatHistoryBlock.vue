<template>
  <div>
    <cc-title small color="pilot" class="pl-3" style="margin-left: -70px!important">
      <span class="ml-9">&emsp;</span>
      ЗАПИСИ БОЕВОЙ ТЕЛЕМЕТРИИ ПИЛОТА
    </cc-title>
    <v-row dense class="stat-text pt-2 pb-2 pl-2 mt-n2">
      <v-col>
        <div>
          ПЕРЕМЕЩЕНИЙ:
          <b class="stark--text">{{ pilot.CombatHistory.moves }}</b>
        </div>
        <div>
          УРОНА НАНЕСЕНО:
          <b class="stark--text">{{ pilot.CombatHistory.damage }}</b>
        </div>
        <div>
          ВРАГОВ УНИЧТОЖЕНО:
          <b class="stark--text">{{ pilot.CombatHistory.kills }}</b>
        </div>
        <div>
          УРОНА ПОЛУЧЕНО:
          <b class="stark--text">{{ pilot.CombatHistory.hp_damage }}</b>
        </div>
        <div>
          СТРУКТУРЫ ПОТЕРЯНО:
          <b class="stark--text">{{ pilot.CombatHistory.structure_damage }}</b>
        </div>
        <div>
          НАГРЕВА ПОЛУЧЕНО:
          <b class="stark--text">{{ pilot.CombatHistory.heat_damage }}</b>
        </div>
        <div>
          НАГРУЗОК:
          <b class="stark--text">{{ pilot.CombatHistory.reactor_damage }}</b>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'combat-history-block',

})
</script>
