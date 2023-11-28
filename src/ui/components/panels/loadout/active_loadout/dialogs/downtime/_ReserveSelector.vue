<template>
  <div>
    <v-select
      v-model="type"
      label="Тип резерва"
      :items="reserveTypes"
      outlined
      dense
      hide-details
      @change="reserve = ''"
    />
    <v-select
      v-if="type && type !== 'Пользовательский'"
      v-model="reserve"
      class="ma-2"
      label="Резерв"
      :items="reserves"
      item-text="name"
      item-value="id"
      outlined
      dense
      hide-details
    />
    <v-slide-y-transition>
      <v-card v-if="type === 'Пользовательский' || reserve" color="light-panel" class="mx-3 mt-1">
        <v-card-text class="flavor-text pt-1 pb-0">
          <p
            v-if="type !== 'Пользовательский' && reserve"
            class="pa-1 ma-1"
            v-html="reserveByID(reserve).description"
          />
          <div
            v-if="
              type !== 'Мех' &&
                reserve !== 'reserve_extendedharness' &&
                reserve !== 'reserve_bombardment'
            "
          >
            <v-text-field
              v-model="custom_name"
              color="accent"
              label="Название ресурса"
              style="width: 500px"
            />
            <v-textarea
              v-model="details"
              color="accent"
              auto-grow
              rows="1"
              label="Подробности"
              filled
            />
          </div>
        </v-card-text>
      </v-card>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { reserves } from 'lancer-data-rus'

export default Vue.extend({
  name: 'reserve-selector',
  data: () => ({
    type: '',
    reserve: '',
    custom_name: '',
    details: '',
    reserveTypes: ['Ресурс', 'Тактический', 'Мех', 'Пользовательский'],
  }),
  computed: {
    reserveComplete() {
      return (
        (this.type && this.reserve) || (this.type === 'Пользовательский' && this.custom_name && this.details)
      )
    },
    reserves() {
      return reserves.filter(x => x.type === this.type)
    },
  },
  methods: {
    reserveByID(id) {
      return reserves.find(x => x.id === id)
    },
    reset() {
      this.type = ''
      this.reserve = ''
      this.custom_name = ''
      this.details = ''
    },
  },
})
</script>
