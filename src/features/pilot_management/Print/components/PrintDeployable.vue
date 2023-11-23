<template>
  <div class="mt-1 mb-3 mx-2">
    <div v-for="d in deployables" :key="`deployable${d.ID}`" style="border: 1px solid grey">
      <div class="text-center caption font-weight-bold">{{ d.name }}</div>
      <v-row justify="center" dense class="text-center mt-n1">
        <v-col v-if="d.size" cols="auto">
          <div class="caption font-weight-bold" v-html="`Размер ${d.size === 0.5 ? '½' : d.size}`" />
        </v-col>
        <v-col v-if="d.armor" cols="auto">
          <div class="caption" v-html="`<b>Броня</b>: ${d.armor}`" />
        </v-col>
        <v-col v-if="d.hp || d.size" cols="auto">
          <div
            class="caption"
            v-html="
              `<b>ПЗ</b>: ${
                d.hp ? d.hp.toString().replace(/[{}]/gim, '') : parseFloat(d.size || 0.5) * 10
              }`
            "
          />
        </v-col>
        <v-col v-if="d.size" cols="auto">
          <div class="caption" v-html="`<b>Уклонение:</b> ${d.evasion || 10}`" />
        </v-col>
        <v-col v-if="d.edef" cols="auto">
          <div class="caption" v-html="`<b>Э-Защита:</b> ${d.edef}`" />
        </v-col>
        <v-col v-if="d.heatcap" cols="auto">
          <div class="caption" v-html="`<b>Тепловой Максимум:</b> ${d.heatcap}`" />
        </v-col>
        <v-col v-if="d.sensor" cols="auto">
          <div class="caption" v-html="`<b>Дальность Сенсоров:</b> ${d.sensor}`" />
        </v-col>
        <v-col v-if="d.techattack" cols="auto">
          <div class="caption" v-html="`<b>Тех Атака:</b> ${d.techattack}`" />
        </v-col>
        <v-col v-if="d.repcap" cols="auto">
          <div class="caption" v-html="`<b>Лимит Ремонта:</b> ${d.repcap}`" />
        </v-col>
        <v-col v-if="d.save" cols="auto">
          <div class="caption" v-html="`<b>Спасбросок Цели:</b> ${d.save}`" />
        </v-col>
        <v-col v-if="d.speed" cols="auto">
          <div class="caption" v-html="`<b>Скорость:</b> ${d.speed}`" />
        </v-col>
      </v-row>
      <div>
        <p class="caption mb-0 px-2" v-html="d.detail" />
      </div>
      <div v-if="actions(d).length">
        <print-action :actions="actions(d)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Action } from '@/classes/Action'
import Vue from 'vue'
import PrintAction from './PrintAction.vue'

export default Vue.extend({
  name: 'print-deployable',
  components: { PrintAction },
  props: {
    deployables: {
      type: Array,
      required: true,
    },
  },
  methods: {
    actions(deployable) {
      return deployable.actions ? deployable.actions.map(x => new Action(x)) : []
    },
  },
})
</script>
