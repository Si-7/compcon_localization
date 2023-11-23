<template>
  <v-card-text>
    <v-row justify="center" dense class="mt-2 mx-8">
      <cc-statblock-panel
        v-if="deployable.size"
        inline
        class="mx-1"
        :icon="`cci-size-${deployable.size === 0.5 ? 'half' : deployable.size}`"
        name="Размер"
        :value="`${deployable.size === 0.5 ? '½' : deployable.size}`"
      />
      <cc-statblock-panel
        v-if="deployable.armor"
        inline
        class="mx-1"
        icon="$vuetify.icons.armor"
        name="Броня"
        :value="deployable.armor"
      />
      <cc-statblock-panel
        v-if="deployable.hp || deployable.size"
        inline
        class="mx-1"
        icon="$vuetify.icons.hp"
        name="ПЗ"
        :value="
          deployable.hp
            ? deployable.hp.toString().replace(/[{}]/gim, '')
            : parseFloat(deployable.size || 0.5) * 10
        "
      />
      <cc-statblock-panel
        v-if="deployable.size"
        icon="$vuetify.icons.evasion"
        inline
        class="mx-1"
        name="Уклонение"
        :value="deployable.evasion || 5"
      />
      <cc-statblock-panel
        v-if="deployable.edef"
        inline
        class="mx-1"
        icon="$vuetify.icons.edef"
        name="Э-Защита"
        :value="deployable.edef"
      />
      <cc-statblock-panel
        v-if="deployable.heatcap"
        inline
        class="mx-1"
        icon="$vuetify.icons.heat"
        name="Тепловой Максимум"
        :value="deployable.heatcap"
      />
      <cc-statblock-panel
        v-if="deployable.sensor"
        inline
        class="mx-1"
        icon="$vuetify.icons.sensor"
        name="Дальность Сенсоров"
        :value="deployable.sensor"
      />
      <cc-statblock-panel
        v-if="deployable.techattack"
        inline
        class="mx-1"
        icon="$vuetify.icons.tech"
        name="Техническая Атака"
        :value="deployable.techattack"
      />
      <cc-statblock-panel
        v-if="deployable.repcap"
        inline
        class="mx-1"
        icon="$vuetify.icons.repair"
        name="Лимит Ремонта"
        :value="deployable.repcap"
      />
      <cc-statblock-panel
        v-if="deployable.save"
        inline
        class="mx-1"
        icon="$vuetify.icons.save"
        name="Спасбросок Цели"
        :value="deployable.save"
      />
      <cc-statblock-panel
        v-if="deployable.speed"
        inline
        class="mx-1"
        icon="$vuetify.icons.speed"
        name="Скорость"
        :value="deployable.speed"
      />
    </v-row>
    <v-row justify="center" dense>
      <v-col cols="auto">
        <p v-html-safe="deployable.detail" class="light-panel mb-0 clipped body-text px-4 py-2" />
      </v-col>
    </v-row>
    <div v-if="actions.length">
      <v-row no-gutters justify="center">
        <v-col v-for="(a, i) in actions" :key="`${deployable.name}_action_${i}`" cols="auto">
          <cc-action :action="a" :panel="$vuetify.breakpoint.lgAndUp" class="ma-2" />
        </v-col>
      </v-row>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import { Action } from '@/classes/Action'
import Vue from 'vue'

export default Vue.extend({
  name: 'deployable-info-base',
  props: {
    deployable: {
      type: Object,
      required: true,
    },
  },
  computed: {
    actions() {
      return this.deployable.actions ? this.deployable.actions.map(x => new Action(x)) : []
    },
  },
})
</script>
