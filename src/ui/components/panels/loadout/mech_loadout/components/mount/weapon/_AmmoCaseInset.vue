<template>
  <div v-show="level > 0" class="light-panel clipped" @click.stop>
    <div class="caption stark--text px-2 py-1">
      ХОДЯЧАЯ ОРУЖЕЙНАЯ//
      <b>ВЫБРАННЫЙ БОЕПРИПАС</b>
    </div>
    <v-row no-gutters class="px-2 mr-4">
      <v-col cols="3">
        <v-select
          v-model="selected"
          color="accent"
          item-color="accent"
          :item-disabled="item => !readonly && item.cost > uses"
          outlined
          dense
          hide-details
          :items="ammoItems"
          item-text="name"
          return-object
          class="mb-1"
          @change="setSelection($event)"
        />
      </v-col>
      <v-col v-if="selected.cost" class="ml-auto pl-4 pr-3 text-left">
        <div class="overline my-n2">ЦЕНА::ФУТЛЯР ДЛЯ БОЕПРИПАСОВ</div>
        <div>
          <v-icon v-for="n in selected.cost" :key="selected.name + '_ammo_' + n">
            mdi-hexagon-slice-6
          </v-icon>
        </div>
      </v-col>
    </v-row>
    <div v-if="selected.effect" class="mb-1 py-1">
      <div class="caption px-2 font-weight-bold">ЭФФЕКТ</div>
      <div class="body-text px-4">{{ selected.effect }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ammo-case-inset',
  props: {
    level: { type: Number, required: true, default: 0 },
    uses: { type: Number, required: false, default: 0 },
    readonly: { type: Boolean },
  },
  data: () => ({
    selected: null,
    allAmmo: [
      {
        name: 'Стандартные',
        cost: 0,
        damage: '',
        effect: '',
      },
      {
        name: 'Громадина',
        cost: 1,
        damage: 'explosive',
        effect: 'Атака приобретает эффект Толчок 1 и наносит взрывной урон.',
      },
      {
        name: 'Шок',
        cost: 1,
        damage: 'energy',
        effect:
          'Атака наносит урон энергетический урон. Выберите одну цель, на которую направлена ваша атака; соседние персонажи получают 1 ББ энергетический урон, независимо от того, попали вы или промахнулись.',
      },
      {
        name: 'Дозатор Гранат',
        cost: 1,
        damage: 'kinetic',
        effect: 'Атака становится Дуговой и наносит кинетический урон.',
      },
      {
        name: 'Хелфаер',
        cost: 2,
        damage: 'energy',
        effect: 'Атака наносит энергетический урон и наносит бонусный урон как Горение.',
      },
      {
        name: 'Джагер',
        cost: 2,
        damage: 'explosive',
        effect: 'Атака получает значение Толчок 2, наносит взрывной урон, и один персонаж, пораженный атакой — на ваш выбор — должен успешно пройти спасбросок Корпуса или он будет Сбит с ног.',
      },
      {
        name: 'Подкалиберный',
        cost: 2,
        damage: 'kinetic',
        effect: 'Атака получает ББ и наносит кинетический урон.',
      },
    ],
  }),
  computed: {
    ammoItems() {
      if (this.level < 2) return this.allAmmo.slice(0, 4)
      return this.allAmmo
    },
  },
  created() {
    this.selected = this.allAmmo[0]
  },
  methods: {
    setSelection(ammo) {
      this.$emit('set-cost', ammo.cost)
      this.$emit('set-damage', ammo.damage)
    },
  },
})
</script>
