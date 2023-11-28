<template>
  <div>
    <v-card-text>
      <p
        class="text-center body-text"
        v-html="
          'Назовите, чего вы хотите. Вы <strong>определенно</strong> можете получить все, но в зависимости от необычности просьбы, ГМ выбирает <strong>одно или два</strong> осложнения'
        "
      />

      <v-divider class="mb-2" />
      <v-row class="mx-3">
        <v-col cols="6">
          <span class="heading h3 accent--text">Ресурс получен</span>
          <reserve-selector ref="rs" />
        </v-col>
        <v-col cols="6">
          <span class="heading h3 accent--text">Осложнение</span>
          <v-select
            v-model="complication1"
            label="Осложнение"
            :items="complications"
            outlined
            dense
            hide-details
          />
          <br />
          <span class="heading h3 accent--text">Дополнительное осложнение</span>
          <v-select
            v-model="complication2"
            label="Осложнение"
            :items="complications"
            outlined
            dense
            hide-details
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">отменить</v-btn>
      <v-spacer />
      <v-btn
        large
        tile
        color="primary"
        :disabled="complication1 === 'Нет' || !$refs.rs.reserveComplete"
        @click="addReserve"
      >
        Добавить резерв
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ReserveSelector from './_ReserveSelector.vue'
import { Reserve } from '@/class'

export default Vue.extend({
  name: 'power-at-cost',
  components: { ReserveSelector },
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    complication1: 'Нет',
    complication2: 'Нет',
    complications: [
      'Нет',
      'Это займет гораздо больше времени, чем вы думали',
      'Это будет чертовски рискованно',
      'Вам придется от чего-то отказаться или что-то оставить (например, богатство, ресурсы, союзников)',
      'Вы разозлите кого-то или что-то важное и влиятельное',
      'Все пойдет не по плану',
      'Вам понадобится больше информации, чтобы действовать безопасно',
      'Все развалится чертовски быстро',
      'Вам понадобится больше ресурсов, но вы знаете, где их найти',
      'Вы можете получить что-то почти правильное: меньшую версию или меньшее количество',
    ],
  }),
  methods: {
    addReserve() {
      const rs = this.$refs.rs
      const r = rs.reserveByID(rs.reserve)
      const nr = new Reserve({
        id: rs.reserve || 'reserve_custom',
        type: rs.type,
        name: (r && r.name) || rs.custom_name || 'Пользовательский резерв',
        label: rs.custom_name,
        description: (r && r.description) || '',
        resource_name: rs.custom_name || '',
        resource_note: rs.details || '',
        resource_cost: this.complication1,
        consumable: true,
        used: false,
      })
      if (this.complication2 !== 'Нет') nr.ResourceCost += `\n${this.complication2}`
      this.pilot.ReservesController.AddReserve(nr)
      this.close()
    },
    close() {
      this.complication1 = 'Нет'
      this.complication2 = 'Нет'
      this.$refs.rs.reset()
      this.$emit('close')
    },
  },
})
</script>
