<template>
  <div>
    <v-card-text>
      <p
        class="text-center body-text"
        v-html="
          'Когда вы Собираете Информацию, вы суете нос туда, где ему не место, и что-то расследуете — проводите исследования, расследуете тайну, выслеживаете цель или следите за чем-то. Вы можете отправиться в библиотеку или работать под прикрытием, чтобы узнать все, что можно. Что бы это ни было, вы пытаетесь Собрать Информацию по выбранному вами вопросу. Вы можете использовать полученную информацию в качестве Резерва.'
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
        <v-row v-show="skillRoll" dense justify="center" class="text-center flavor-text">
          <v-col cols="10">
            <p v-if="skillRoll < 10" class="font-weight-bold px-3">
              Вы можете выбрать выйти сейчас или получить то, что ищете. Если вы выбираете последнее, вы получаете то, что ищете, но это сразу приводит к неприятностям.
              <br />
              <v-slide-x-transition>
                <v-btn
                  v-show="!commit"
                  small
                  tile
                  class="mx-2"
                  color="success darken-1"
                  @click="close"
                >
                  Выйти сейчас
                </v-btn>
              </v-slide-x-transition>
              <v-slide-x-reverse-transition>
                <v-btn
                  v-show="!commit"
                  small
                  tile
                  class="mx-2"
                  color="primary"
                  @click="commit = true"
                >
                  Получить то, что ищете
                </v-btn>
              </v-slide-x-reverse-transition>
            </p>
            <p v-else-if="skillRoll < 20" class="font-weight-bold px-3">
              Вы найдете то, что ищете, но...
              <v-card class="pa-1 ma-0" color="panel">
                <v-card-text class="pa-1 ma-0">
                  <v-radio-group v-model="choice" mandatory>
                    <v-radio :label="choices[0]" :value="0"></v-radio>
                    <v-radio :label="choices[1]" :value="1"></v-radio>
                  </v-radio-group>
                </v-card-text>
              </v-card>
            </p>
            <p v-else class="font-weight-bold px-3">
              Вы получаете то, что ищете, без каких-либо осложнений
            </p>
          </v-col>
          <v-row dense>
            <v-col>
              <v-slide-y-transition>
                <v-card
                  v-if="skillRoll >= 10 || (skillRoll < 10 && commit)"
                  color="panel"
                  class="ml-5 mr-5 mt-2"
                >
                  <v-toolbar dark dense color="action--downtime">
                    <v-toolbar-title>Собранная информация</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-textarea v-model="details" auto-grow rows="1" label="Details" />
                  </v-card-text>
                </v-card>
              </v-slide-y-transition>
            </v-col>
          </v-row>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">отменить</v-btn>
      <v-spacer />
      <v-btn large tile color="primary" :disabled="!skillRoll || !details" @click="addReserve">
        добавить резерв
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'gather-information',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    commit: false,
    skillRoll: '',
    details: '',
    choices: [
      'Вы оставляете явные свидетельства ваших попыток нарыть информацию',
      'Чтобы избежать внимания, вам приходится подставить кого-то или вовлечь кого-то невиновного',
    ],
    choice: 0,
  }),
  methods: {
    addReserve() {
      const nr = new Reserve({
        id: 'reserve_gatherinfo',
        type: 'Ресурс',
        name: 'Информация',
        label: '',
        description: '',
        resource_note: this.details,
        resource_name: '',
        resource_cost: '',
        used: false,
        consumable: true,
      })
      if (this.skillRoll < 10)
        nr.ResourceCost = 'Получение этой информации сразу привело к неприятностям'
      else if (this.skillRoll < 20) nr.ResourceCost = this.choices[this.choice]
      this.pilot.ReservesController.AddReserve(nr)
      this.close()
    },
    close() {
      this.commit = false
      this.skillRoll = ''
      this.details = ''
      this.choice = 0
      this.$emit('close')
    },
  },
})
</script>
