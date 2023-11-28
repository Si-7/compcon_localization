<template>
  <div>
    <v-row>
      <v-col>
        <div class="overline">//МИССИЯ</div>
        <div class="heading h3 accent--text mt-n1">{{ mission.Name }}</div>
        <p v-if="mission.Note" class="flavor-text panel text-center" v-html="mission.Note" />
        <v-row justify="center">
          <v-col v-for="(s, i) in mission.Steps" :key="`step_${i}`" :cols="s.Name ? 3 : 1">
            <v-card outlined height="100%">
              <div
                :class="`caption white--text ${
                  i > step ? 'grey' : i === step ? 'success' : s.Name ? 'primary' : 'secondary'
                }`"
              >
                &nbsp;//{{ i + 1 }}
              </div>
              <v-card-text class="flavor-text">
                <div v-if="s.Name">
                  <div v-if="i >= step">
                    <span class="heading h3">{{ s.Name }}</span>
                    <v-divider />
                    <div>ОКРУЖ: {{ s.Environment }}</div>
                    <div>СИТРЕП: {{ s.Sitrep.name }}</div>
                  </div>
                  <div v-else>ЗАВЕРШЕНА</div>
                </div>
                <div v-else style="margin-top: 25%; margin-bottom: 25%" class="text-center">
                  <v-icon color="secondary" large>mdi-restore</v-icon>
                  <span class="overline">{{ s.IsLong ? 'Полный' : 'Короткий' }} отдых</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <div class="overline">//ТЕКУЩАЯ СЦЕНА</div>
    <div class="heading mech">
      {{ encounter.Name }}
    </div>
    <br />
    <p class="panel flavor-text" v-html="encounter.NarrativeNotes" />
    <v-row dense align="start" class="mt-n2">
      <v-col cols="7">
        <div class="heading h3" v-html="`Расположение: ${encounter.Location || '---'}`" />
        <v-divider class="my-2" />
        <p class="flavor-text" v-html="`Окружение: ${encounter.Environment}`" />
        <p
          v-if="encounter.EnvironmentDetails"
          class="flavor-text"
          v-html="encounter.EnvironmentDetails"
        />
        <v-divider v-if="encounter.GmNotes" />
        <p v-if="encounter.GmNotes" class="flavor-text" v-html="encounter.GmNotes" />
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <cc-title small class="mb-3">СИТРЕП</cc-title>
    <div class="heading h3" v-html="encounter.Sitrep.Name" />
    <p class="flavor-text" v-html="encounter.Sitrep.description" />
    <v-divider class="mt-2" />
    <v-row dense justify="center">
      <v-col class="text-center">
        <span class="heading h3 accent--text">Победа ПИ</span>
        <p class="flavor-text" v-html="encounter.Sitrep.pcVictory" />
      </v-col>
      <v-divider vertical class="mx-2" />
      <v-col class="text-center">
        <span class="heading h3 accent--text">Победа Врага</span>
        <p class="flavor-text" v-html="encounter.Sitrep.enemyVictory" />
      </v-col>
      <v-divider vertical class="mx-2" />
      <v-col class="text-center">
        <span class="heading h3 accent--text">Нет победителя</span>
        <p class="flavor-text" v-html="encounter.Sitrep.noVictory" />
      </v-col>
    </v-row>
    <v-divider />
    <v-row dense justify="center">
      <v-col class="text-center">
        <span class="heading h3 accent--text">Размещение</span>
        <p class="flavor-text" v-html="encounter.Sitrep.deployment" />
      </v-col>
      <v-divider vertical class="mx-2" />
      <v-col class="text-center">
        <span class="heading h3 accent--text">Эксфильтрация</span>
        <p class="flavor-text" v-html="encounter.Sitrep.extraction" />
      </v-col>
    </v-row>
    <v-divider />
    <v-row dense justify="center">
      <v-col class="text-center">
        <span class="heading h3 accent--text">Зоны Контроля</span>
        <p class="flavor-text" v-html="encounter.Sitrep.controlZone" />
      </v-col>
      <v-divider vertical class="mx-2" />
      <v-col class="text-center">
        <span class="heading h3 accent--text">Цель</span>
        <p class="flavor-text" v-html="encounter.Sitrep.objective" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'active-mission-info',
  props: {
    mission: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
  },
})
</script>
