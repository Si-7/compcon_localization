<template>
  <cc-titled-panel :title="encounter.Name">
    <v-row dense class="mt-n1">
      <v-col v-if="encounter.Campaign" cols="auto">
        <div class="overline">КАМПАНИЯ</div>
        {{ encounter.Campaign }}
      </v-col>
      <v-col v-if="encounter.Labels.length">
        <div class="overline">ЯРЛЫКИ</div>
        <v-chip v-for="l in encounter.Labels" :key="l" small class="mx-1">{{ l }}</v-chip>
      </v-col>
    </v-row>
    <p v-if="encounter.Note" class="flavor-text mb-0" v-html="encounter.Note" />
    <v-row dense no-gutters class="my-2">
      <v-col cols="2"><v-divider class="mt-3" /></v-col>
      <span class="heading h3 accent--text px-2">КОМБАТАНТЫ</span>
      <v-col><v-divider class="mt-3" /></v-col>
    </v-row>
    <v-row dense class="mr-2 mt-n1 ml-2">
      <v-col v-if="forces.enemy.length" class="caption ml-2">
        <div class="stat-text red--text">ПРОТИВНИКА</div>
        <npc-chip v-for="(n, i) in forces.enemy" :key="`fe_${n.ID}_${i}`" :npc="n" readonly />
      </v-col>
      <v-divider v-if="forces.allied.length" vertical />
      <v-col v-if="forces.allied.length" class="caption ml-2">
        <div class="stat-text blue--text">СОЮЗНЫЕ</div>
        <npc-chip v-for="(n, i) in forces.allied" :key="`fa_${n.ID}_${i}`" :npc="n" readonly />
      </v-col>
      <v-divider v-if="forces.allied.length || forces.enemy.length" vertical />
      <v-col v-if="forces.neutral.length" class="caption ml-2">
        <div class="stat-text subtle--text text--darken-1">НЕЙТРАЛЬНЫЕ</div>
        <npc-chip v-for="(n, i) in forces.neutral" :key="`fn_${n.ID}_${i}`" :npc="n" readonly />
      </v-col>
    </v-row>
    <v-row dense no-gutters class="my-2">
      <v-col cols="2"><v-divider class="mt-3" /></v-col>
      <span class="heading h3 accent--text px-2">ПОДКРЕПЛЕНИЯ</span>
      <v-col><v-divider class="mt-3" /></v-col>
    </v-row>
    <v-row dense class="mr-2 mt-n1 ml-2">
      <v-col v-if="reinforcements.enemy.length" class="caption ml-2">
        <div class="stat-text red--text">ПРОТИВНИКА</div>
        <npc-chip
          v-for="(n, i) in reinforcements.enemy"
          :key="`re_${n.ID}_${i}`"
          :npc="n"
          readonly
        />
      </v-col>
      <v-divider v-if="reinforcements.allied.length" vertical />
      <v-col v-if="reinforcements.allied.length" class="caption ml-2">
        <div class="stat-text blue--text">СОЮЗНЫЕ</div>
        <npc-chip
          v-for="(n, i) in reinforcements.allied"
          :key="`ra_${n.ID}_${i}`"
          :npc="n"
          readonly
        />
      </v-col>
      <v-divider v-if="reinforcements.allied.length || reinforcements.enemy.length" vertical />
      <v-col v-if="reinforcements.neutral.length" class="caption ml-2">
        <div class="stat-text subtle--text text--darken-1">НЕЙТРАЛЬНЫЕ</div>
        <npc-chip
          v-for="(n, i) in reinforcements.neutral"
          :key="`rn_${n.ID}_${i}`"
          :npc="n"
          readonly
        />
      </v-col>
    </v-row>
    <div v-if="!readonly">
      <v-divider class="my-3" />
      <v-btn large block color="secondary" @click="$emit('select', encounter)">
        <v-icon left>mdi-plus</v-icon>
        Добавить сцену
      </v-btn>
    </div>
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import NpcChip from '../../encounter/components/NpcChip.vue'
import { EncounterSide } from '@/class'

export default Vue.extend({
  name: 'encounter-panel',
  components: { NpcChip },
  props: {
    encounter: {
      type: Object,
      required: true,
    },
    sideSelect: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
  },
  computed: {
    forces() {
      return {
        enemy: this.encounter.Npcs('Противник'),
        allied: this.encounter.Npcs('Союзник'),
        neutral: this.encounter.Npcs('Нейтральный'),
      }
    },
    reinforcements() {
      return {
        enemy: this.encounter.Reinforcements('Противник'),
        allied: this.encounter.Reinforcements('Союзник'),
        neutral: this.encounter.Reinforcements('Нейтральный'),
      }
    },
  },
})
</script>
