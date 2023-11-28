<template>
  <div>
    <v-card-text>
      <p
        class="text-center body-text"
        v-html="
          'Вы пытаетесь получить в свои руки какое-то снаряжение или актив, копаясь на свалке, разыскивая слухи, обмениваясь на местном рынке или охотясь по округе. Вам может понадобиться лучшее снаряжение пилота, транспортное средство, наркотики, товары или другие вещи. Это должно быть что-то материальное, но не обязательно должно быть в списке снаряжения. Если вы получите это, вы можете взять это на следующее задание в качестве <strong>Резерва.</strong>'
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
              Вы получаете, что хотите, но...
              <v-radio-group v-model="choice" mandatory>
                <v-radio v-for="(c, i) in choices" :key="c" :label="c" :value="i"></v-radio>
              </v-radio-group>
            </p>
            <p v-else-if="skillRoll < 20" class="font-weight-bold px-3">
              Вы получаете то, что хотите, но выбираете цену, которую нужно заплатить:
              <v-radio-group v-model="trade" mandatory>
                <v-radio v-for="(t, i) in trades" :key="t" :label="t" :value="i"></v-radio>
              </v-radio-group>
            </p>
            <p v-else class="font-weight-bold px-3">
              Вы без проблем получаете то, что ищете.
            </p>
          </v-col>
          <v-row dense>
            <v-col>
              <v-card color="panel" class="ml-5 mr-5 mt-2">
                <v-toolbar dark dense color="action--downtime">
                  <v-toolbar-title>Новый актив</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-text-field
                    v-model="custom_name"
                    label="Актив или снаряжение"
                    style="width: 500px"
                    dense
                    outlined
                  />
                  <v-textarea v-model="details" auto-grow rows="1" label="Details" filled />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">отменить</v-btn>
      <v-spacer />
      <v-btn large tile color="primary" :disabled="!skillRoll || !custom_name" @click="addReserve">
        Добавить резерв
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'scrounge-barter',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    skillRoll: '',
    custom_name: '',
    details: '',
    choices: [
      'Он был украден, вероятно, у того, кто его ищет',
      'Он вышел из строя, старый, грязный или неисправный',
      'Кто-то еще владеет этим прямо сейчас и не отдаст без силы или убеждения',
    ],
    choice: 0,
    trades: ['Время', 'Достоинство', 'Репутация', 'Здоровье, комфорт и благополучие'],
    trade: 0,
  }),
  methods: {
    addReserve() {
      const nr = new Reserve({
        id: 'reserve_scroungebarter',
        type: 'Ресурс',
        name: 'Актив',
        label: '',
        description: '',
        resource_note: this.details,
        resource_name: this.custom_name,
        resource_cost: '',
        used: false,
        consumable: false,
      })
      if (this.skillRoll < 10) nr.ResourceCost = this.choices[this.choice]
      else if (this.skillRoll < 20)
        nr.ResourceCost = `Цена за получение этого актива: ${this.trades[
          this.trade
        ].toLowerCase()}`
      this.pilot.ReservesController.AddReserve(nr)
      this.close()
    },
    close() {
      this.choice = 0
      this.trade = 0
      this.skillRoll = ''
      this.custom_name = ''
      this.details = ''
      this.$emit('close')
    },
  },
})
</script>
