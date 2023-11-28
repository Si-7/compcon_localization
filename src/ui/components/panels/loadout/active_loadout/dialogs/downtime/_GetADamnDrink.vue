<template>
  <div>
    <v-card-text>
      <p
        class="text-center body-text"
        v-html="
          'Когда вы Получаете Чертову Выпивку, вы выпускаете пар, резвитесь и, как правило, попадаете в неприятности. Возможно, вы пытаетесь обзавестись связями, собрать сплетни, создать себе репутацию или даже просто забыть о том, что произошло на последнем задании. Обычно это приводит к проблемам. <br/> Вы можете совершить это действие только там, где действительно есть, что выпить (например, на станции, в городе или другом населенном пункте), или в каком-либо другом виде развлечения.'
        "
      />
      <v-divider class="mb-2" />
      <div class="pt-2 heading h3 text-center">
        Бросьте
        <v-icon large color="accent">mdi-dice-d20</v-icon>
        &nbsp;и добавьте все соответствующие бонусы Триггеров, модификаторы и Точность
      </div>
      <v-row justify="center">
        <v-col cols="3">
          <v-text-field
            v-model="skillRoll"
            type="number"
            label="Результат броска"
            outlined
            dense
            hide-details
            append-outer-icon="mdi-plus-circle-outline"
            prepend-icon="mdi-minus-circle-outline"
            @click:append-outer="skillRoll++"
            @click:prepend="skillRoll > 1 ? skillRoll-- : ''"
          />
        </v-col>
      </v-row>
      <v-slide-y-transition>
        <v-row v-show="skillRoll" justify="center" class="text-center flavor-text">
          <v-col cols="10">
            <p v-if="skillRoll < 10" class="font-weight-bold px-3">
              Решите, хорошо вы провели время или нет; в любом случае, вы просыпаетесь где-нибудь в канаве, где при вас остается только одно:
              <v-select
                v-model="kept"
                class="ml-5 mr-5"
                outlined
                :items="losses"
                label="При вас остается..."
              />
            </p>
            <p v-else-if="skillRoll < 20" class="font-weight-bold px-3">
              <span
                v-html="
                  'Получите что-то одно в качестве <strong>Резерва</strong> и потеряйте что-то одно:'
                "
              />
              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="reserve1"
                    hide-details
                    dense
                    outlined
                    :items="choices"
                    label="Вы получаете..."
                  />
                  <v-textarea
                    v-if="reserve1"
                    v-model="details1"
                    auto-grow
                    rows="1"
                    label="Подробности"
                    filled
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="loss"
                    outlined
                    dense
                    hide-details
                    :items="choices"
                    label="Вы теряете..."
                  />
                </v-col>
              </v-row>
            </p>
            <p v-else class="font-weight-bold px-3">
              Получите два <strong>Резерва</strong>:
              <v-row>
                <v-col cols="6">
                  <div class="ma-2">
                    <v-select
                      v-model="reserve1"
                      hide-details
                      outlined
                      dense
                      :items="choices"
                      label="Вы получаете..."
                    />
                    <v-textarea
                      v-if="reserve1"
                      v-model="details1"
                      auto-grow
                      rows="1"
                      label="Подробности"
                      filled
                    />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="ma-2">
                    <v-select
                      v-model="reserve2"
                      hide-details
                      outlined
                      dense
                      :items="choices"
                      label="...и еще..."
                    />
                    <v-textarea
                      v-if="reserve2"
                      v-model="details2"
                      auto-grow
                      rows="1"
                      label="Подробности"
                      filled
                    />
                  </div>
                </v-col>
              </v-row>
            </p>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">отменить</v-btn>
      <v-spacer />
      <v-btn large tile color="primary" :disabled="addDisabled" @click="addReserve">
        добавить резерв
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'damn-drink',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    skillRoll: '',
    details: '',
    losses: ['Ваше достоинство', 'Все ваше имущество', 'Ваша память'],
    kept: '',
    reserve1: '',
    details1: '',
    reserve2: '',
    details2: '',
    loss: '',
    choices: [
      'Хорошая репутация',
      'Друг или связи',
      'Полезный предмет или информация',
      'Удобная возможность',
    ],
  }),
  computed: {
    addDisabled() {
      if (!this.skillRoll) return true
      return (
        (this.skillRoll < 10 && !this.kept) ||
        (this.skillRoll > 10 && this.skillRoll < 20 && (!this.reserve1 || !this.loss)) ||
        (this.skillRoll >= 20 && (!this.reserve1 || !this.reserve2))
      )
    },
  },
  methods: {
    addReserve() {
      if (this.skillRoll < 10) {
        const nr = new Reserve({
          id: 'reserve_damndrink',
          type: 'Ресурс',
          name: 'Чертова выпивка',
          label: '',
          description: '',
          resource_note: '',
          resource_cost: '',
          resource_name: '',
          consumable: true,
          used: false,
        })
        const lossArr = [...this.losses]
        lossArr.splice(
          lossArr.findIndex(x => x === this.kept),
          1
        )
        nr.ResourceCost = `Вы потеряли ${lossArr[0].toLowerCase()}, а также ${lossArr[1].toLowerCase()}`
        this.pilot.ReservesController.AddReserve(nr)
      } else if (this.skillRoll < 20) {
        const nr = new Reserve({
          id: 'reserve_damndrink',
          type: 'Ресурс',
          name: this.reserve1,
          label: '',
          description: '',
          resource_note: '',
          resource_cost: '',
          resource_name: '',
          consumable: true,
          used: false,
        })
        nr.Note = this.details1
        nr.ResourceCost = `Вы потеряли ${this.loss.toLowerCase()}`
        this.pilot.ReservesController.AddReserve(nr)
      } else {
        const nr = new Reserve({
          id: 'reserve_damndrink',
          type: 'Ресурс',
          name: this.reserve1,
          label: '',
          description: '',
          resource_note: '',
          resource_cost: '',
          resource_name: '',
          consumable: true,
          used: false,
        })
        nr.Note = this.details1
        this.pilot.ReservesController.AddReserve(nr)

        const nr2 = new Reserve({
          id: 'reserve_damndrink',
          type: 'Ресурс',
          name: this.reserve2,
          label: '',
          description: '',
          resource_note: '',
          resource_cost: '',
          resource_name: '',
          consumable: true,
          used: false,
        })
        nr2.Note = this.details2
        this.pilot.ReservesController.AddReserve(nr2)
      }
      this.close()
    },
    close() {
      this.skillRoll = ''
      this.details = ''
      this.kept = ''
      this.reserve1 = ''
      this.details1 = ''
      this.reserve2 = ''
      this.details2 = ''
      this.loss = ''
      this.$emit('close')
    },
  },
})
</script>
