<template>
  <v-row justify="center">
    <v-col cols="12" md="7">
      <cc-titled-panel
        title="Новая организация"
        icon="mdi-account-group"
        color="reserve--organization darken-2"
      >
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="orgName" color="accent" label="Название" outlined hide-details />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="orgType"
              label="Тип"
              color="accent"
              :items="orgTypes"
              outlined
              hide-details
            />
          </v-col>
        </v-row>
        <v-textarea
          v-model="orgDetails"
          label="Цель и подробности организации"
          color="accent"
          auto-grow
          rows="2"
          filled
          hide-details
        />
        <br />
        <span class="heading h3">Начать с:</span>
        <v-row dense justify="center" class="mx-4">
          <v-col cols="12" md="" class="text-center">
            <v-btn
              v-if="!orgStart"
              large
              block
              outlined
              color="secondary"
              @click="orgStart = 'efficiency'"
            >
              Эффективности
              <cc-tooltip
                simple
                inline
                content="Эффективность определяет, насколько эффективно ваша организация ведет деятельность в рамках своей сферы
                (например, военная организация с высокой эффективностью будет хороша в бою). Преимущества, полученные с помощью 
                вашей организации, могут быть использованы как <strong>Резервы</strong>."
              >
                <v-icon small right>mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </v-btn>
            <div v-else>
              <span class="heading h3">+ {{ orgStart === 'efficiency' ? '2' : '0' }}</span>
              <br />
              <span>Эффективность организации</span>
            </div>
          </v-col>
          <v-divider v-show="$vuetify.breakpoint.mdAndUp" vertical class="mx-5" />
          <v-col cols="12" md="" class="text-center">
            <v-btn
              v-if="!orgStart"
              large
              block
              outlined
              color="secondary"
              @click="orgStart = 'influence'"
            >
              Влияния
              <cc-tooltip
                simple
                inline
                content="Влияние — это размер,
                охват, богатство и репутация организации. Влияние
                используется при приобретении активов, создании
                возможностей или влиянии на общественное мнение.
                Преимущества, полученные с помощью вашей организации, 
                могут быть использованы как <strong>Резервы</strong>."
              >
                <v-icon small right>mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </v-btn>
            <div v-else>
              <span class="heading h3">+ {{ orgStart === 'influence' ? '2' : '0' }}</span>
              <br />
              <span>Влияние организации</span>
            </div>
          </v-col>
        </v-row>
        <br />
        <v-btn
          block
          tile
          large
          class="mb-2 mt-n2"
          color="primary"
          :disabled="!orgName || !orgType || !orgStart"
          @click="add()"
        >
          <v-icon left>cci-accuracy</v-icon>
          Добавить организацию
        </v-btn>
      </cc-titled-panel>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Organization, OrgType } from '@/class'

export default Vue.extend({
  name: 'custom-reserve-panel',
  data: () => ({
    orgName: '',
    orgType: '',
    orgStart: '',
    orgDetails: '',
  }),
  computed: {
    orgTypes() {
      return Object.keys(OrgType)
        .map(k => OrgType[k as string])
        .sort() as OrgType[]
    },
  },
  methods: {
    add() {
      const o = new Organization({
        name: this.orgName,
        purpose: this.orgType,
        efficiency: this.orgStart === 'efficiency' ? 2 : 0,
        influence: this.orgStart === 'influence' ? 2 : 0,
        description: this.orgDetails,
        actions: '',
      })
      this.clear()
      this.$emit('add', o)
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
