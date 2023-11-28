<template>
  <v-container fluid>
    <v-row v-if="!encounter" align="center" justify="center" style="width: 100%; height: 100%">
      <v-col cols="auto">
        <span class="heading h1 subtle--text text--lighten-2">нет выбранных сцен</span>
      </v-col>
    </v-row>
    <div v-else>
      <v-row dense class="mt-n6">
        <v-col cols="10">
          <span class="heading mech">
            <cc-short-string-editor large @set="encounter.Name = $event">
              <span
                style="
                  display: inline-block;
                  max-width: 90%;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                {{ encounter.Name }}
              </span>
            </cc-short-string-editor>
          </span>
        </v-col>
      </v-row>
      <v-row dense align="center">
        <v-col>
          <v-combobox
            v-model="encounter.Labels"
            outlined
            dense
            multiple
            label="Пользовательские ярлыки"
            :items="labels"
          />
        </v-col>
        <v-col>
          <v-combobox
            v-model="encounter.Campaign"
            outlined
            dense
            label="Кампания"
            :items="campaigns"
          />
        </v-col>
      </v-row>
      <cc-title small class="mb-3">
        Нарративное описание
        <cc-text-editor
          label="Редактировать нарративное описание"
          :original="encounter.NarrativeNotes"
          @save="encounter.NarrativeNotes = $event"
        />
      </cc-title>
      <p v-html-safe="encounter.NarrativeNotes" />
      <cc-title small class="mb-3">
        Расположение
        <cc-text-editor
          label="Редактировать описание расположения"
          :original="encounter.Location"
          @save="encounter.Location = $event"
        />
      </cc-title>
      <v-row dense align="start" class="mt-n2">
        <v-col cols="7">
          <p v-html-safe="encounter.Location" />
          <v-divider class="my-3" />
          <v-combobox
            v-model="encounter.Environment"
            outlined
            dense
            label="Окружение"
            :items="environments"
            @change="setEnvironment()"
          />
          <v-textarea
            v-if="encounter.Environment !== 'Нормальное'"
            v-model="encounter.EnvironmentDetails"
            filled
            label="Подробности окружения"
            auto-grow
            hide-details
            rows="2"
            class="mt-n4"
          />
        </v-col>
        <v-col cols="5">
          <v-card flat outlined>
            <v-card-text class="pa-1">
              <v-img
                v-if="encounter.Map"
                :key="encounter.Map"
                :src="encounter.Map"
                aspect-ratio="1"
              />
              <v-btn outlined small block color="secondary" @click="$refs.imageSelector.open()">
                <span v-if="!encounter.Map">
                  <v-icon left>mdi-plus</v-icon>
                  Добавить карту сцены
                </span>
                <span v-else>
                  <v-icon left>mdi-circle-edit-outline</v-icon>
                  Редактировать карту сцены
                </span>
              </v-btn>
              <cc-image-selector-web ref="imageSelector" :item="encounter" type="map" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <cc-title small class="mb-3">СИТРЕП</cc-title>
      <v-select
        v-model="selRep"
        item-text="name"
        outlined
        dense
        label="Тип столкновения"
        :items="sitreps"
        @change="encounter.Sitrep = sitreps.find(x => x.name === selRep)"
      />
      <v-textarea
        v-model="encounter.Sitrep.description"
        filled
        label="Описание"
        auto-grow
        hide-details
        rows="1"
        class="mt-n4"
      />
      <v-divider class="mt-2" />
      <v-row dense justify="center">
        <v-col class="text-center">
          <span class="heading h3 accent--text">Победа ПИ</span>
          <v-textarea
            v-model="encounter.Sitrep.pcVictory"
            filled
            dense
            label="Условия победы"
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2"
          />
        </v-col>
        <v-divider vertical class="mx-2" />
        <v-col class="text-center">
          <span class="heading h3 accent--text">Победа врага</span>
          <v-textarea
            v-model="encounter.Sitrep.enemyVictory"
            filled
            dense
            label="Условия победы"
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2"
          />
        </v-col>
        <v-divider vertical class="mx-2" />
        <v-col class="text-center">
          <span class="heading h3 accent--text">Нет победителя</span>
          <v-textarea
            v-model="encounter.Sitrep.noVictory"
            filled
            dense
            label="Условия ничьей"
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2"
          />
        </v-col>
      </v-row>
      <v-divider />
      <v-row dense justify="center">
        <v-col class="text-center">
          <span class="heading h3 accent--text">Размещение</span>
          <v-textarea
            v-model="encounter.Sitrep.deployment"
            filled
            dense
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2 hide-label"
          />
        </v-col>
        <v-divider vertical class="mx-2" />
        <v-col class="text-center">
          <span class="heading h3 accent--text">Эксфильтрация</span>
          <v-textarea
            v-model="encounter.Sitrep.extraction"
            filled
            dense
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2 hide-label"
          />
        </v-col>
      </v-row>
      <v-divider />
      <v-row dense justify="center">
        <v-col class="text-center">
          <span class="heading h3 accent--text">Зоны контроля</span>
          <v-textarea
            v-model="encounter.Sitrep.controlZone"
            filled
            dense
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 hide-label"
          />
        </v-col>
        <v-divider vertical class="mx-2" />
        <v-col class="text-center">
          <span class="heading h3 accent--text">Цель</span>
          <v-textarea
            v-model="encounter.Sitrep.objective"
            filled
            dense
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 hide-label"
          />
        </v-col>
      </v-row>
      <cc-title small class="mt-3">КОМБАТАНТЫ</cc-title>
      <v-row dense>
        <v-col cols="8">
          <fieldset>
            <legend class="heading h3 accent--text mx-2">СИЛЫ</legend>
            <div v-if="forces.enemy.length" class="caption ml-2">ПРОТИВНИКА</div>
            <v-divider v-if="forces.enemy.length" />
            <npc-chip
              v-for="(n, i) in forces.enemy"
              :key="`fe_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveNpc(n, 'Противник')"
              @clone="encounter.AddNpc(n, 'Противник')"
            />
            <div v-if="forces.allied.length" class="caption ml-2">СОЮЗНЫЕ</div>
            <v-divider v-if="forces.allied.length" />
            <npc-chip
              v-for="(n, i) in forces.allied"
              :key="`fa_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveNpc(n, 'Союзник')"
              @clone="encounter.AddNpc(n, 'Союзник')"
            />
            <div v-if="forces.neutral.length" class="caption ml-2">НЕЙТРАЛЬНЫЕ</div>
            <v-divider v-if="forces.neutral.length" />
            <npc-chip
              v-for="(n, i) in forces.neutral"
              :key="`fn_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveNpc(n, 'Нейтральный')"
              @clone="encounter.AddNpc(n, 'Нейтральный')"
            />
            <div class="mx-6">
              <v-btn
                color="accent"
                block
                small
                outlined
                class="my-2"
                @click="$refs.npcDialog.show()"
              >
                <v-icon left>mdi-plus</v-icon>
                Добавить НИП
              </v-btn>
            </div>
          </fieldset>
        </v-col>
        <v-col cols="4">
          <fieldset>
            <legend class="heading h3 accent--text mx-2">ПОДКРЕПЛЕНИЯ</legend>
            <div v-if="reinforcements.enemy.length" class="caption ml-2">ПРОТИВНИКА</div>
            <v-divider v-if="forces.enemy.length" />
            <npc-chip
              v-for="(n, i) in reinforcements.enemy"
              :key="`re_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveReinforcement(n, 'Противник')"
              @clone="encounter.AddReinforcement(n, 'Противник')"
            />
            <div v-if="reinforcements.allied.length" class="caption ml-2">СОЮЗНЫЕ</div>
            <v-divider v-if="forces.allied.length" />
            <npc-chip
              v-for="(n, i) in reinforcements.allied"
              :key="`ra_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveReinforcement(n, 'Союзник')"
              @clone="encounter.AddReinforcement(n, 'Союзник')"
            />
            <div v-if="reinforcements.neutral.length" class="caption ml-2">НЕЙТРАЛЬНЫЕ</div>
            <v-divider v-if="forces.neutral.length" />
            <npc-chip
              v-for="(n, i) in reinforcements.neutral"
              :key="`rn_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveReinforcement(n, 'Нейтральный')"
              @clone="encounter.AddReinforcement(n, 'Нейтральный')"
            />
            <div class="mx-6">
              <v-btn
                color="accent"
                block
                small
                outlined
                class="my-2"
                @click="$refs.reinforcementDialog.show()"
              >
                <v-icon left>mdi-plus</v-icon>
                Добавить НИП
              </v-btn>
            </div>
          </fieldset>
        </v-col>
      </v-row>
      <v-divider class="my-3" />
      <cc-title small class="mb-3">
        Заметки ГМа
        <cc-text-editor
          label="Редактировать Заметки ГМа"
          :original="encounter.Note"
          @save="encounter.Note = $event"
        />
      </cc-title>
      <p :key="encounter.Note.length" v-html-safe="encounter.Note" />
      <br />
      <cc-solo-dialog ref="npcDialog" no-confirm title="ДОБАВИТЬ НИП" fullscreen no-pad>
        <npc-selector @select="addNpc($event)" />
      </cc-solo-dialog>
      <cc-solo-dialog
        ref="reinforcementDialog"
        no-confirm
        title="ДОБАВИТЬ НИП ПОДКРЕПЛЕНИЯ"
        fullscreen
        no-pad
      >
        <npc-selector @select="addReinforcement($event)" />
      </cc-solo-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import NpcChip from './NpcChip.vue'
import NpcSelector from './NpcSelector.vue'
import { getModule } from 'vuex-module-decorators'
import { EncounterStore, CompendiumStore } from '@/store'
import { Npc, EncounterSide } from '@/class'

export default Vue.extend({
  name: 'encounter-card',
  components: { NpcSelector, NpcChip },
  props: {
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selRep: 'Стандартный бой',
    ctest: ['a', 'b', 'c'],
  }),
  mounted() {
    this.selRep = this.encounter.Sitrep.name;
  },
  computed: {
    labels() {
      const store = getModule(EncounterStore, this.$store)
      return store.Encounters.flatMap(x => x.Labels).filter(x => x)
    },
    campaigns() {
      const store = getModule(EncounterStore, this.$store)
      return store.Encounters.map(x => x.Campaign).filter(x => x)
    },
    environmentData() {
      return getModule(CompendiumStore, this.$store).Environments
    },
    environments() {
      return ['Нормальное'].concat(this.environmentData.map(x => x.name))
    },
    sitreps() {
      return getModule(CompendiumStore, this.$store).Sitreps
    },
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
  methods: {
    setEnvironment() {
      if (this.encounter.Environment === 'Нормальное') this.encounter.EnvironmentDetails = ''
      else if (this.environmentData.some(x => x.name === this.encounter.Environment))
        this.encounter.EnvironmentDetails = this.environmentData.find(
          x => x.name === this.encounter.Environment
        ).description
    },
    addNpc(event: { npc: Npc; side: EncounterSide }) {
      this.encounter.AddNpc(event.npc, event.side)
      this.$refs.npcDialog.hide()
    },
    addReinforcement(event: { npc: Npc; side: EncounterSide }) {
      this.encounter.AddReinforcement(event.npc, event.side)
      this.$refs.reinforcementDialog.hide()
    },
  },
})
</script>

<style>
.hide-label textarea {
  margin-top: 4px !important;
}
</style>
