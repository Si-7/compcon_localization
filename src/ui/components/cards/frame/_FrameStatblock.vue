<template>
  <v-container class="mt-0 pt-1">
    <v-row justify="center" dense>
      <cc-statblock-panel icon="cci-structure" name="Структура" :value="frame.Structure" />
      <cc-statblock-panel icon="cci-reactor" name="Нагрузка" :value="frame.HeatStress" />
      <cc-statblock-panel icon="$vuetify.icons.armor" name="Броня" :value="frame.Armor" />
      <cc-statblock-panel icon="$vuetify.icons.hp" name="ПЗ" :value="frame.HP" />
      <cc-statblock-panel icon="$vuetify.icons.evasion" name="Уклонение" :value="frame.Evasion" />
      <cc-statblock-panel icon="$vuetify.icons.edef" name="Э-Защита" :value="frame.EDefense" />
      <cc-statblock-panel icon="$vuetify.icons.heat" name="Тепловой Максимум" :value="frame.HeatCap" />
      <cc-statblock-panel
        icon="$vuetify.icons.sensor"
        name="Сенсоры"
        :value="frame.SensorRange"
      />
      <cc-statblock-panel icon="$vuetify.icons.tech" name="Техническая Атака" :value="frame.TechAttack" />
      <cc-statblock-panel
        icon="$vuetify.icons.repair"
        name="Лимит Ремонта"
        :value="frame.RepCap"
      />
      <cc-statblock-panel icon="$vuetify.icons.save" name="Спасбросок Цели" :value="frame.SaveTarget" />
      <cc-statblock-panel icon="$vuetify.icons.speed" name="Скорость" :value="frame.Speed" />
      <cc-statblock-panel icon="$vuetify.icons.sp" name="Системные Пункты" :value="frame.SP" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-frame-statblock',
  props: {
    frame: {
      type: Object,
      required: true,
    },
  },
})
</script>
