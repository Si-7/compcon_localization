<template>
  <v-col cols="auto" class="mx-2">
    <v-dialog v-model="dialog" width="70vw">
      <template v-slot:activator="{ on }">
        <v-btn large outlined color="stark" block v-on="on">
          <v-icon small left color="stark">mdi-account-multiple</v-icon>
          {{ org.Name }}
        </v-btn>
      </template>
      <cc-titled-panel
        :title="org.Name"
        icon="mdi-account-multiple"
        color="primary"
        style="height: 100%"
      >
        <div slot="items">
          <cc-tooltip simple inline content="Удалить организацию">
            <v-btn icon color="error" @click="remove()">
              <v-icon>delete</v-icon>
            </v-btn>
          </cc-tooltip>
          <v-btn icon dark @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </div>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="org.Name" label="Название организации" outlined hide-details />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="org.Purpose"
              label="Тип организации"
              :items="orgTypes"
              outlined
              hide-details
            />
          </v-col>
        </v-row>
        <v-textarea
          v-model="org.Description"
          label="Цель и подробности организации"
          auto-grow
          rows="2"
          filled
          hide-details
        />
        <br />
        <v-row dense justify="center" class="mx-12">
          <v-col cols="auto">
            <v-btn icon large :disabled="org.Efficiency === 0" @click="org.Efficiency -= 2">
              <v-icon large color="accent">remove</v-icon>
            </v-btn>
          </v-col>
          <v-col class="text-center" cols="auto">
            <div>
              <span class="heading h2 accent--text">+ {{ org.Efficiency }}</span>
              <br />
              <span>
                Эффективность организации
                <cc-tooltip
                  simple
                  inline
                  content="Эффективность определяет, насколько эффективно ваша организация ведет деятельность в рамках своей сферы
                (например, военная организация с высокой эффективностью будет хороша в бою). Преимущества, полученные с помощью 
                вашей организации, могут быть использованы как <strong>Резервы</strong>."
                >
                  <v-icon small right>mdi-help-circle-outline</v-icon>
                </cc-tooltip>
              </span>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-btn icon large :disabled="org.Efficiency === 6" @click="org.Efficiency += 2">
              <v-icon large color="accent">add</v-icon>
            </v-btn>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn icon large :disabled="org.Influence === 0" @click="org.Influence -= 2">
              <v-icon large color="accent">remove</v-icon>
            </v-btn>
          </v-col>
          <v-col class="text-center" cols="auto">
            <div>
              <span class="heading h2 accent--text">+ {{ org.Influence }}</span>
              <br />
              <span>
                Влияние организации
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
              </span>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-btn icon large :disabled="org.Influence === 6" @click="org.Influence += 2">
              <v-icon large color="accent">add</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <br />
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Закрыть</v-btn>
        </v-card-actions>
      </cc-titled-panel>
    </v-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrgType } from '@/class'

export default Vue.extend({
  name: 'cc-org-item',
  props: {
    org: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    orgTypes() {
      return Object.keys(OrgType)
        .map(k => OrgType[k as string])
        .sort() as OrgType[]
    },
  },
  methods: {
    remove() {
      this.$emit('remove')
      this.dialog = false
    },
  },
})
</script>
