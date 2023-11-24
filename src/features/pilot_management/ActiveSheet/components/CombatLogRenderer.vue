<template>
  <v-row dense align="start">
    <v-col>
      <v-row v-for="(l, i) in state.Log" :key="`${l.id}_${i}`" dense>
        <v-col>
          <div class="caption subtle--text mb-n1">
            МИССИЯ {{ l.mission }} // ВСТРЕЧА {{ l.encounter }} // РАУНД {{ l.round }} ::
            {{ l.timestamp }}
          </div>
          <p class="flavor-text ma-0 ml-3 mb-2">
            >//[
            <span class="accent--text">{{ l.event }}</span>
            ]
            <span class="stark--text">{{ l.detail }}</span>
          </p>
        </v-col>
        <v-col v-if="l.undoAction" cols="auto" class="ml-auto" align-self="center">
          <cc-tooltip content="Отменить это действие, возвращая любые затраченные действия">
            <v-btn x-small color="primary" class="fadeSelect" @click="undo(l.undoAction)">
              <v-icon small left>mdi-reload</v-icon>
              ОТМЕНИТЬ
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="auto" class="ml-6">
      <fieldset>
        <legend class="heading h3 accent--text ml-1 px-2">СТАТЫ МИССИИ</legend>
        <div class="pl-2 pr-4">
          <div class="flavor-text">
            ПЕРЕМЕЩЕНИЙ:
            <b class="stark--text">{{ state.Stats.moves }}</b>
          </div>
          <div class="flavor-text">
            УРОНА НАНЕСЕНО:
            <b class="stark--text">{{ state.Stats.damage }}</b>
          </div>
          <div class="flavor-text">
            ПРОТИВНИКОВ УНИЧТОЖЕНО:
            <b class="stark--text">{{ state.Stats.kills }}</b>
          </div>
          <div class="flavor-text">
            УРОНА ПОЛУЧЕНО:
            <b class="stark--text">{{ state.Stats.hp_damage }}</b>
          </div>
          <div class="flavor-text">
            СТРУКТУРЫ ПОТЕРЯНО:
            <b class="stark--text">{{ state.Stats.structure_damage }}</b>
          </div>
          <div class="flavor-text">
            НАГРЕВА ПОЛУЧЕНО:
            <b class="stark--text">{{ state.Stats.heat_damage }}</b>
          </div>
          <div class="flavor-text">
            НАГРУЗОК:
            <b class="stark--text">{{ state.Stats.reactor_damage }}</b>
          </div>
        </div>
      </fieldset>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'combat-log-renderer',
  props: {
    state: {
      type: Object,
      required: true,
    },
  },
  methods: {
    undo(action) {
      this.state.UndoAction(action)
    },
  },
})
</script>
