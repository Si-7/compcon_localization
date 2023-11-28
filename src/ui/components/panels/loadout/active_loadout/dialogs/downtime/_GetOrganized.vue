<template>
  <div>
    <v-card-text>
      <p
        class="text-center body-text"
        v-html="'Вы создаете, запускаете или улучшаете организацию, бизнес или другое предприятие.'"
      />
      <v-divider class="mb-2" />
      <v-card>
        <v-tabs v-model="tabs" color="white" background-color="primary" slider-color="white" grow>
          <v-tab>Создать организацию</v-tab>
          <v-tab :disabled="!organizations.length">Улучшить организацию</v-tab>
          <v-tab-item>
            <v-card flat tile class="ma-3">
              <v-toolbar dark flat tile dense color="action--downtime">
                <v-toolbar-title class="heading h2">Новая организация</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="4">
                    <v-select
                      v-model="type"
                      label="Тип организации"
                      :items="orgTypes"
                      outlined
                      dense
                      hide-details
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="name"
                      outlined
                      dense
                      hide-details
                      label="Название организации"
                    />
                  </v-col>
                </v-row>
                <v-row dense justify="center">
                  <v-col cols="10">
                    <v-textarea
                      v-model="details"
                      auto-grow
                      rows="1"
                      label="Цель и подробности организации"
                    />
                  </v-col>
                </v-row>
                <div class="heading h2 text-center mb-2">Начать с:</div>
                <v-row dense justify="space-around">
                  <v-col cols="5">
                    <cc-tooltip
                      simple
                      inline
                      content="Эффективность определяет, насколько эффективно ваша организация ведет деятельность в рамках своей сферы (например, военная организация с высокой эффективностью будет хороша в бою). <br /> Эффективность используется при выполнении действий, связанных с Фокусом вашей организации. Преимущества, полученные с помощью вашей организации, могут быть использованы как <strong>Резервы</strong>."
                    >
                      <v-btn
                        v-if="!start"
                        large
                        block
                        tile
                        color="primary"
                        @click="start = 'efficiency'"
                      >
                        Эффективность
                      </v-btn>
                      <div v-else class="text-center flavor-text">
                        <span class="heading h2">+ {{ start === 'efficiency' ? '2' : '0' }}</span>
                        <br />
                        <span>Эффективность организации</span>
                      </div>
                    </cc-tooltip>
                  </v-col>

                  <v-col cols="5">
                    <cc-tooltip
                      simple
                      inline
                      content="Влияние — это размер, охват, богатство и репутация организации. Влияние используется при приобретении активов, создании возможностей или влиянии на общественное мнение. <br> Влияние используется при приобретении активов, создании возможностей или влиянии на общественное мнение. Преимущества, полученные с помощью вашей организации, могут быть использованы как <strong>Резервы</strong>."
                    >
                      <v-btn
                        v-if="!start"
                        large
                        block
                        tile
                        color="primary"
                        @click="start = 'influence'"
                      >
                        Влияние
                      </v-btn>
                      <div v-else class="text-center flavor-text">
                        <span class="heading h2">+ {{ start === 'influence' ? '2' : '0' }}</span>
                        <br />
                        <span>Влияние организации</span>
                      </div>
                    </cc-tooltip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card-text>
              <div v-if="!selected" class="mx-3">
                <v-btn
                  v-for="o in organizations"
                  :key="o.Name"
                  tile
                  block
                  dark
                  class="my-3"
                  color="action--downtime"
                  @click="selected = o"
                >
                  {{ o.Name }}
                </v-btn>
              </div>
              <v-slide-x-transition>
                <div v-if="selected">
                  <v-btn small text @click="selected = null">
                    <v-icon left>mdi-chevron-left</v-icon>
                    Выбрать другую организацию
                  </v-btn>

                  <v-card tile flat>
                    <v-toolbar dark flat dense color="action--downtime">
                      <v-toolbar-title class="heading h2">
                        {{ selected.Name }}
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="mx-3">
                      <v-textarea
                        v-model="selected.Description"
                        auto-grow
                        rows="1"
                        label="Цель и подробности организации"
                      />
                      <v-row justify="center">
                        <v-col cols="5">
                          <v-text-field
                            v-model="improveRoll"
                            type="number"
                            label="Результат броска управления организацией"
                            outlined
                            dense
                            hide-details
                            append-outer-icon="mdi-plus-circle-outline"
                            prepend-icon="mdi-minus-circle-outline"
                            @click:append-outer="improveRoll++"
                            @click:prepend="improveRoll > 1 ? improveRoll-- : ''"
                          />
                        </v-col>
                      </v-row>

                      <v-slide-y-transition>
                        <v-row v-if="improveRoll" dense class="text-center flavor-text">
                          <v-col v-if="improveRoll < 10">
                            <v-row dense justify="center">
                              <v-col cols="auto" class="pr-2">Эта организация</v-col>
                              <v-col cols="auto" class="mt-n5">
                                <v-radio-group
                                  v-model="badChoice"
                                  row
                                  dense
                                  style="display: inline-block"
                                >
                                  <v-radio label="Немедленно распадется" value="fold" color="error" />
                                  <v-radio
                                    :label="`Теряет 2 Эффективности (${selected.Efficiency} доступно) и 2 Влияния (${selected.Influence} доступно), до минимума 0`"
                                    :disabled="selected.Influence === 0 && selected.Efficiency === 0"
                                    value="efficiencyInfluence"
                                    color="warning"
                                  />
                                  <v-radio
                                    :label="`Должна действовать`"
                                    value="takeAction"
                                    color="warning"
                                  />     
                                </v-radio-group>
                              </v-col>
                            </v-row>
                            <v-slide-x-reverse-transition>
                              <div v-show="badChoice === 'takeAction'">
                                <br />
                                <span>
                                  Организация предпринимает одно из следующих действий:
                                </span>
                                <v-btn-toggle v-model="action" mandatory>
                                  <v-btn text large value="Pay Debts">Выплатить долги</v-btn>
                                  <v-btn text large value="Prove Worthiness">
                                    Доказать свою ценность
                                  </v-btn>
                                  <v-btn text large value="Get Bailed Out">Получить финансовую помощь</v-btn>
                                  <v-btn text large value="Make an Aggressive Move">
                                    Предпринять агрессивные действия
                                  </v-btn>
                                </v-btn-toggle>
                              </div>
                            </v-slide-x-reverse-transition>
                          </v-col>
                          <v-col v-else-if="improveRoll <= 20" cols="12">
                            <v-row
                              v-if="
                                parseInt(selected.Influence) === 6 &&
                                parseInt(selected.Efficiency) === 6
                              "
                              row
                              wrap
                            >
                              <v-col class="text-center">
                                <span class="heading h3 subtle--text">
                                  Организация работает на максимальной мощности
                                </span>
                              </v-col>
                            </v-row>
                            <v-row v-else>
                              <v-col cols="12" class="text-center">
                                <span class="heading h3">Улучшить:</span>
                              </v-col>
                              <v-col cols="5">
                                <v-tooltip top>
                                  <div slot="activator">
                                    <v-btn
                                      large
                                      block
                                      color="primary"
                                      :disabled="
                                        selected.Efficiency === 6 || improvement === 'efficiency'
                                      "
                                      @click="improvement = 'efficiency'"
                                    >
                                      Эффективность
                                    </v-btn>
                                    <div>
                                      <span class="heading h3">
                                        +
                                        {{
                                          selected.Efficiency +
                                          (improvement === 'efficiency' ? 2 : 0)
                                        }}
                                        Эффективность
                                      </span>
                                      <br />
                                      <span>Эффективность организации</span>
                                    </div>
                                  </div>
                                  <span>
                                    Эффективность определяет, насколько эффективно ваша организация ведет 
                                    деятельность в рамках своей сферы (например, военная организация с 
                                    высокой эффективностью будет хороша в бою). 
                                    <br /> 
                                    Эффективность используется при выполнении действий, связанных с 
                                    Фокусом вашей организации. Преимущества, полученные с помощью вашей 
                                    организации, могут быть использованы как <strong>Резервы</strong>.
                                  </span>
                                </v-tooltip>
                              </v-col>
                              <v-spacer />
                              <v-col cols="5">
                                <v-tooltip top>
                                  <div slot="activator">
                                    <v-btn
                                      large
                                      block
                                      color="primary"
                                      :disabled="
                                        selected.Influence === 6 || improvement === 'influence'
                                      "
                                      @click="improvement = 'influence'"
                                    >
                                      Влияние
                                    </v-btn>
                                    <div>
                                      <span class="heading h3">
                                        +
                                        {{
                                          selected.Influence + (improvement === 'influence' ? 2 : 0)
                                        }}
                                        Влияние
                                      </span>
                                      <br />
                                      <span>Влияние организации</span>
                                    </div>
                                  </div>
                                  <span>
                                    Влияние — это размер, охват, богатство и репутация организации. Влияние 
                                    используется при приобретении активов, создании возможностей или влиянии 
                                    на общественное мнение.
                                  </span>
                                </v-tooltip>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col v-else cols="12">
                            <span
                              v-if="
                                parseInt(selected.Influence) < 6 &&
                                parseInt(selected.Efficiency) < 6
                              "
                              class="heading h3 accent--text"
                            >
                              Ваша организация получает +2 Эффективности и +2 Влияния
                            </span>
                            <span
                              v-else-if="parseInt(selected.Influence) < 6"
                              class="heading h3 accent--text"
                            >
                              Ваша организация получает +2 Влияния
                            </span>
                            <span
                              v-else-if="parseInt(selected.Efficiency) < 6"
                              class="heading h3 accent--text"
                            >
                              Ваша организация получает +2 Эффективности
                            </span>
                            <span v-else class="heading h3 subtle--text">
                              Организация работает на максимальной мощности
                            </span>
                          </v-col>
                        </v-row>
                      </v-slide-y-transition>
                    </v-card-text>
                  </v-card>
                </div>
              </v-slide-x-transition>
            </v-card-text>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">отмена</v-btn>
      <v-spacer />
      <v-btn
        large
        tile
        :color="badChoice === 'fold' ? 'error' : 'primary'"
        :disabled="confirmDisabled"
        @click="tabs === 0 ? addOrg() : improveOrg()"
      >
        {{ confirmName() }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrgType, Organization } from '@/class'
export default Vue.extend({
  name: 'get-organized',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tabs: 0,
    type: '',
    name: '',
    details: '',
    start: '',
    selected: null,
    improveRoll: '',
    badChoice: '',
    action: '',
    improvement: '',
  }),
  computed: {
    orgTypes() {
      return Object.keys(OrgType)
        .map(k => OrgType[k])
        .sort() as OrgType[]
    },
    organizations() {
      return this.pilot.ReservesController.Organizations
    },
    confirmDisabled() {
      if (this.tabs === 0) return !this.name || !this.type || !this.start
      if (this.tabs === 1) {
        if (parseInt(this.improveRoll) < 10) {
          return !(this.badChoice === 'fold' || (this.badChoice && this.action))
        } else if (parseInt(this.improveRoll) < 20) {
          if (this.selected.Efficiency === 6 && this.selected.Influence === 6) return false
          else return
          !this.improvement
        } else {
          return false
        }
      }
      return false
    },
  },
  methods: {
    confirmName() {
      if (this.tabs === 0) return 'Создать организацию'
      if (this.tabs === 1) {
        if (this.badChoice === 'fold') return 'Закрыть организацию'
        else return 'Обновить организацию'
      }
    },
    addOrg() {
      const org = new Organization({
        name: this.name,
        purpose: this.purpose,
        efficiency: this.start === 'efficiency' ? 2 : 0,
        influence: this.start === 'influence' ? 2 : 0,
        description: this.details,
        actions: '',
      })
      this.pilot.ReservesController.AddOrganization(org)
      this.close()
    },
    improveOrg() {
      if (parseInt(this.improveRoll) < 10) {
        if (this.badChoice === 'fold') {
          this.pilot.ReservesController.Organizations.splice(
            this.pilot.ReservesController.Organizations.findIndex(
              x => x.Name === this.selected.Name
            ),
            1
          )
        } else if (this.badChoice === 'efficiencyInfluence') {
          if(this.selected.Efficiency > 0)
            this.selected.Efficiency -= 2
          if(this.selected.Influence > 0)
            this.selected.Influence -= 2
          this.selected.Actions = this.action
          }
      } else if (parseInt(this.improveRoll) < 20) {
        if (this.improvement === 'efficiency') {
          this.selected.Efficiency += 2
        } else if (this.improvement === 'influence') {
          this.selected.Influence += 2
        }
      } else {
        this.selected.Efficiency += 2
        this.selected.Influence += 2
      }

      this.close()
    },
    close() {
      this.tabs = 0
      this.type = ''
      this.name = ''
      this.details = ''
      this.start = ''
      this.selected = null
      this.improveRoll = ''
      this.badChoice = ''
      this.action = ''
      this.improvement = ''
      this.$emit('close')
    },
  },
})
</script>
