<template>
  <v-container>
    <v-row dense class="mt-n6 mb-3">
      <v-col cols="12" md="5" class="ml-auto mr-auto">
        <v-alert
          :value="true"
          :type="pilot.MechSkillsController.IsMissingHASE ? 'info' : 'success'"
          outlined
          class="stat-text mt-6"
        >
          {{ pilot.MechSkillsController.CurrentHASEPoints }}/{{
            pilot.MechSkillsController.MaxHASEPoints
          }}
          Навыков Мехов выбрано
        </v-alert>
        <div class="text-center mt-n2">
          <v-btn
            small
            class="fadeSelect"
            color="info"
            outlined
            @click="pilot.MechSkillsController.Reset()"
          >
            Сбросить Навыки Мехов
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" lg="6">
        <cc-title :small="$vuetify.breakpoint.smAndDown">Корпус</cc-title>
        <span class="flavor-text">
          КОРПУС описывает вашу способность создавать и
          пилотировать прочные, надежные мехи, способные
          выдерживать удары и продолжать движение
        </span>
        <v-row dense>
          <v-col cols="auto" class="ml-auto mr-auto text-center">
            <v-btn
              color="secondary"
              :disabled="!pilot.MechSkillsController.MechSkills.Hull"
              fab
              x-small
              left
              bottom
              class="d-inline elevation-0"
              @click="remove('Hull')"
            >
              <v-icon>remove</v-icon>
            </v-btn>
            <cc-rating
              :dense="$vuetify.breakpoint.mdAndDown"
              :model="pilot.MechSkillsController.MechSkills.Hull"
            />
            <v-btn
              :disabled="!pilot.MechSkillsController.IsMissingHASE"
              color="secondary"
              fab
              x-small
              right
              bottom
              class="d-inline elevation-0"
              @click="add('Hull')"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row dense class="mt-n3 mb-6">
          <v-col cols="auto" class="ml-auto mr-auto text-center">
            <span class="heading h3">
              ПЗ МЕХА
              <span class="accent--text">
                +{{ pilot.MechSkillsController.MechSkills.Hull * 2 }}
              </span>
            </span>
            <cc-slashes class="ml-1 mr-1" />
            <span class="heading h3">
              ЛИМИТ РЕМОНТА
              <span class="accent--text">
                +{{ Math.floor(pilot.MechSkillsController.MechSkills.Hull / 2) }}
              </span>
            </span>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="6">
        <cc-title :small="$vuetify.breakpoint.smAndDown">МАНЕВРЕННОСТЬ</cc-title>
        <span class="flavor-text">
          МАНЕВРЕННОСТЬ описывает вашу способность
          создавать и пилотировать быстрые мехи с высоким
          параметром уклонения
        </span>
        <v-row dense>
          <v-col cols="auto" class="ml-auto mr-auto text-center">
            <v-btn
              color="secondary"
              :disabled="!pilot.MechSkillsController.MechSkills.Agi"
              fab
              x-small
              left
              bottom
              class="d-inline elevation-0"
              @click="remove('Agi')"
            >
              <v-icon>remove</v-icon>
            </v-btn>
            <cc-rating
              :dense="$vuetify.breakpoint.mdAndDown"
              :model="pilot.MechSkillsController.MechSkills.Agi"
            />
            <v-btn
              :disabled="!pilot.MechSkillsController.IsMissingHASE"
              color="secondary"
              class="d-inline elevation-0"
              fab
              x-small
              right
              bottom
              @click="add('Agi')"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row dense class="mt-n3 mb-6">
          <v-col cols="auto" class="ml-auto mr-auto text-center">
            <span class="heading h3">УКЛОНЕНИЕ</span>
            <span class="heading h3 accent--text">
              +{{ pilot.MechSkillsController.MechSkills.Agi }}
            </span>
            <cc-slashes class="ml-1 mr-1" />
            <span class="heading h3">СКОРОСТЬ</span>
            <span class="heading h3 accent--text">
              +{{ Math.floor(pilot.MechSkillsController.MechSkills.Agi / 2) }}
            </span>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="6">
        <cc-title :small="$vuetify.breakpoint.smAndDown">СИСТЕМЫ</cc-title>
        <span class="flavor-text">
          СИСТЕМЫ описывают вашу способность создавать и
          пилотировать передовые мехи с мощными возможностями электронной борьбы
        </span>
        <v-row dense>
          <v-col cols="auto" class="ml-auto mr-auto text-center">
            <v-btn
              color="secondary"
              :disabled="!pilot.MechSkillsController.MechSkills.Sys"
              fab
              x-small
              left
              bottom
              class="d-inline elevation-0"
              @click="remove('Sys')"
            >
              <v-icon>remove</v-icon>
            </v-btn>
            <cc-rating
              :dense="$vuetify.breakpoint.mdAndDown"
              :model="pilot.MechSkillsController.MechSkills.Sys"
            />
            <v-btn
              class="d-inline elevation-0"
              color="secondary"
              :disabled="!pilot.MechSkillsController.IsMissingHASE"
              fab
              x-small
              right
              bottom
              @click="add('Sys')"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row dense class="mt-n3 mb-6">
          <v-col cols="auto" class="ml-auto mr-auto text-center">
            <span class="heading h3">Э-ЗАЩИТА</span>
            <span class="heading h3 accent--text">
              +{{ pilot.MechSkillsController.MechSkills.Sys }}
            </span>
            <cc-slashes class="ml-1 mr-1" />
            <span class="heading h3">Техническая Атака</span>
            <span class="heading h3 accent--text">
              +{{ pilot.MechSkillsController.MechSkills.Sys }}
            </span>
            <cc-slashes class="ml-1 mr-1" />
            <span class="heading h3">СП</span>
            <span class="heading h3 accent--text">
              +{{ Math.floor(pilot.MechSkillsController.MechSkills.Sys / 2) }}
            </span>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="6">
        <cc-title :small="$vuetify.breakpoint.smAndDown">ИНЖЕНЕРИЯ</cc-title>
        <span class="flavor-text">
          ИНЖЕНЕРИЯ описывает вашу способность создавать
          и пилотировать мехи с эффективными реакторами, системами поддержки и припасами
        </span>
        <v-row dense>
          <v-col cols="auto" class="ml-auto mr-auto text-center">
            <v-btn
              color="secondary"
              :disabled="!pilot.MechSkillsController.MechSkills.Eng"
              fab
              x-small
              left
              bottom
              class="d-inline elevation-0"
              @click="remove('Eng')"
            >
              <v-icon>remove</v-icon>
            </v-btn>
            <cc-rating
              :dense="$vuetify.breakpoint.mdAndDown"
              :model="pilot.MechSkillsController.MechSkills.Eng"
            />
            <v-btn
              class="d-inline elevation-0"
              color="secondary"
              :disabled="!pilot.MechSkillsController.IsMissingHASE"
              fab
              x-small
              right
              bottom
              @click="add('Eng')"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row dense class="mt-n3 mb-6">
          <v-col cols="auto" class="ml-auto mr-auto text-center">
            <span class="heading h3">ТЕПЛОВОЙ МАКСИМУМ</span>
            <span class="heading h3 accent--text">
              +{{ pilot.MechSkillsController.MechSkills.Eng }}
            </span>

            <cc-slashes class="ml-1 mr-1" />

            <span class="heading h3">БОНУС ОГРАНИЧЕННЫХ СИСТЕМ ИЛИ ОРУЖИЯ</span>
            <span class="heading h3 accent--text">
              +{{ Math.floor(pilot.MechSkillsController.MechSkills.Eng / 2) }}
            </span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot, HASE } from '@/class'

export default Vue.extend({
  name: 'cc-mech-skills-selector',
  props: {
    pilot: Pilot,
  },
  watch: {
    'pilot.MechSkillsController.IsMissingHASE': function (newVal) {
      if (newVal === false) window.scrollTo(0, document.body.scrollHeight)
    },
  },
  methods: {
    add(field: HASE) {
      this.pilot.MechSkillsController.MechSkills.Increment(field)
    },
    remove(field: HASE) {
      this.pilot.MechSkillsController.MechSkills.Decrement(field)
    },
    close() {
      this.$emit('close')
    },
  },
})
</script>

<style scoped>
.bonus-text {
  position: relative;
  bottom: 20px;
}
</style>
