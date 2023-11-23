<template>
  <v-row justify="center">
    <v-col cols="12" md="7">
      <cc-titled-panel title="Новый проект" icon="mdi-atom-variant" color="reserve--project">
        <v-row dense>
          <v-col cols="12" md="">
            <v-text-field
              v-model="projectName"
              color="accent"
              label="Название проекта"
              outlined
              hide-details
            />
          </v-col>
          <v-col cols="12" md="auto">
            <v-row no-gutters align="start">
              <v-col cols="auto" class="text-center">
                <v-switch
                  v-model="complicated"
                  dense
                  inset
                  hide-details
                  color="secondary"
                  class="mr-3"
                >
                  <span slot="label" class="stat-text text--text">
                    Сложный
                    <cc-tooltip
                      simple
                      inline
                      content="Этот проект сложен, требует много ресурсов или в общем сложновыполним"
                    >
                      <v-icon small>mdi-help-circle-outline</v-icon>
                    </cc-tooltip>
                  </span>
                </v-switch>
              </v-col>
              <v-col cols="auto" class="text-center">
                <v-switch v-model="finished" dense inset hide-details color="secondary">
                  <span slot="label" class="stat-text text--text">
                    Закончен
                    <cc-tooltip
                      simple
                      inline
                      content="Этот проект выполнен и доступен для использования в виде <strong>резерва</strong>"
                    >
                      <v-icon small>mdi-help-circle-outline</v-icon>
                    </cc-tooltip>
                  </span>
                </v-switch>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-textarea
          v-model="details"
          auto-grow
          rows="2"
          label="Детали"
          filled
          hide-details
          color="accent"
          class="my-3"
        />
        <v-combobox
          v-model="costs"
          label="Требования"
          :items="projectCosts"
          chips
          multiple
          outlined
          color="accent"
          dense
          class="mr-5 ml-5 mt-5"
          :disabled="finished"
        ></v-combobox>
        <v-btn
          block
          tile
          large
          class="mb-2 mt-n2"
          color="primary"
          :disabled="!projectName"
          @click="add()"
        >
          <v-icon left>cci-accuracy</v-icon>
          Добавить проект
        </v-btn>
      </cc-titled-panel>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Project } from '@/class'

export default Vue.extend({
  name: 'custom-reserve-panel',
  data: () => ({
    projectName: '',
    details: '',
    complicated: false,
    finished: false,
    costs: [],
    projectCosts: [
      'Качественные материалы',
      'Специальные знания или методы',
      'Специализированные инструменты',
      'Хорошее рабочее место',
    ],
  }),
  methods: {
    add() {
      const p = new Project({
        id: 'reserve_project',
        type: 'Project',
        name: `${this.projectName} ${this.finished ? '' : ' (In Progress)'}`,
        label: 'Project',
        description: '',
        complicated: this.complicated,
        can_finish: false,
        finished: false,
        progress: 0,
        requirements: [],
        resource_name: this.projectName,
        resource_note: this.details,
        resource_cost: '',
        used: false,
        consumable: false,
      })
      if (this.costs && !this.finished) p.ResourceCost = `Requires: ${this.costs.join(', ')}`
      p.IsFinished = this.finished
      this.clear()
      this.$emit('add', p)
    },
    clear() {
      this.projectName = ''
      this.details = ''
      this.complicated = false
      this.finished = false
      this.costs = []
    },
  },
})
</script>
