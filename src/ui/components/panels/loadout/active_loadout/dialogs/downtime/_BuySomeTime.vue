<template>
  <div>
    <v-card-text>
      <p
        class="text-center body-text"
        v-html="
          'Вы пытаетесь отсрочить расплату, расширить окно возможностей или просто выиграть немного времени и передышки для себя и своей группы. Возможно, вы пытаетесь укрыться от жары, выжить, застряв в дикой местности, или отвлечь внимание, чтобы другой план достиг своей кульминации. <br /> Вы можете использовать это отвлечение или выигранное время как <strong>Резерв</strong> для следующей миссии.'
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
            <p
              v-if="skillRoll < 10"
              class="font-weight-bold px-3"
              v-html="
                'Вы можете выиграть только немного времени, и только в том случае, если решительные меры будут приняты <em>прямо сейчас.</em> В противном случае то, от чего вы пытаетесь уберечься, настигнет вас.'
              "
            />
            <p
              v-else-if="skillRoll < 20"
              class="font-weight-bold px-3"
              v-html="
                'Вы выигрываете достаточно времени, но ситуация становится опасной или безвыходной. В следующий раз, когда вы получите этот результат для той же ситуации, рассматривайте его как 9 или меньше.'
              "
            />
            <p
              v-else
              class="font-weight-bold px-3"
              v-html="
                'Вы выигрываете столько времени, сколько вам нужно, до следующего сеанса отдыха. В следующий раз, когда вы получите этот результат для той же ситуации, рассматривайте его как 10-19.'
              "
            />
            <v-card color="panel" flat tile class="ml-5 mr-5">
              <v-toolbar dark dense color="action--downtime">
                <v-toolbar-title class="heading h2">Купленное время</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-textarea
                  v-model="details"
                  color="accent"
                  auto-grow
                  rows="1"
                  label="Подробности"
                  filled
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">отменить</v-btn>
      <v-spacer />
      <v-btn
        large
        tile
        color="primary"
        :disabled="skillRoll === '' || details === ''"
        @click="addReserve()"
      >
        добавить резерв
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'

export default Vue.extend({
  name: 'buy-time',
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    skillRoll: '',
    details: '',
  }),
  methods: {
    addReserve() {
      const nr = new Reserve({
        id: 'reserve_boughttime',
        type: 'Ресурс',
        name: 'Купленное время',
        label: '',
        description: 'Немного времени и передышки для себя и своей группы',
        resource_note: this.details,
        resource_cost: '',
        resource_name: '',
        used: false,
        consumable: true,
      })
      if (this.skillRoll < 10)
        nr.ResourceCost = 'Только немного времени, и только в том случае, если решительные меры будут приняты прямо сейчас.'
      else if (this.skillRoll < 20)
        nr.ResourceCost = 'Ситуация становится опасной или безвыходной'
      this.pilot.ReservesController.AddReserve(nr)
      this.close()
    },
    close() {
      this.skillRoll = ''
      this.details = ''
      this.$emit('close')
    },
  },
})
</script>
