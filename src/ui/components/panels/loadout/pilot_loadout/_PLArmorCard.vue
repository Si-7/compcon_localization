<template>
  <pl-card-base
    ref="base"
    title="БРОНЯ ПИЛОТА"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove')"
    @save="$emit('save')"
  >
    <div
      v-if="item"
      class="text-left"
      style="cursor: pointer !important; height: 100%; min-height: 80px"
      @click="$refs.base.openDetail()"
    >
      <span :key="item.Name" class="h2 heading text--text" style="line-height: 35px">
        {{ item.Name }}
        <cc-tooltip v-if="item.Note" :key="item.Note.length" simple inline :content="item.Note">
          <v-icon small color="active">mdi-note</v-icon>
        </cc-tooltip>
      </span>
      <v-row dense class="pb-2">
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Бонус Брони">
            <v-icon>mdi-shield-outline</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ armor }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Бонус ПЗ">
            <v-icon>mdi-heart</v-icon>
          </cc-tooltip>
          <span class="stat-text">+{{ hp }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Э-Защита">
            <v-icon>cci-edef</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ edef }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Уклонение">
            <v-icon>cci-evasion</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ evasion }}</span>
        </v-col>
        <v-col class="my-auto">
          <cc-tooltip simple inline content="Скорость">
            <v-icon>$vuetify.icons.move</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ speed }}</span>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-n3">
        <v-col cols="auto" class="ml-auto mr-4 mt-n2">
          <cc-tags small :tags="item.Tags" color="secondary" />
        </v-col>
      </v-row>
    </div>
    <v-card-text slot="selector">
      <cc-selector-table
        no-filter
        no-extra
        :items="getArmor()"
        :headers="headers"
        @equip="equip($event)"
      >
        <div v-if="item">
          <span class="overline">
            PRINTID ОРУЖЕЙНОЙ ДМС: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
            <span class="success--text text--darken-1">
              [ РЕГИСТРАЦИЯ СОБСТВЕННОСТИ ПИЛОТА ПОДТВЕРЖДЕНА ]
            </span>
          </span>
          <br />
          <span class="heading h1 accent--text" style="line-height: 20px">{{ item.Name }}</span>
          <span class="flavor-text overline mt-n1" style="display: block">CURRENTLY EQUIPPED</span>
        </div>
        <div v-else>
          <span class="overline">
            АВТОРИЗАЦЯ СНАРЯЖЕНИЯ ОРУЖЕЙНОЙ ДМС: ПИЛОТСКАЯ/ПЕРСОНАЛЬНАЯ БРОНЯ::TI - TVII-A
          </span>
          <br />
          <span class="heading h1 subtle--text text--lighten-1" style="line-height: 20px">
            НИЧЕГО НЕ ВЫБРАНО
          </span>
          <span class="flavor-text overline mt-n1 error--text" style="display: block">
            [ ID СОБСТВЕННОСТИ НЕПРАВИЛЕН ИЛИ ОТСУТСТВУЕТ ]
          </span>
        </div>
      </cc-selector-table>
    </v-card-text>
  </pl-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import PlCardBase from './_PLCardBase.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { PilotArmor, CompendiumItem, ItemType } from '@/class'
import { flavorID } from '@/io/Generators'

export default Vue.extend({
  name: 'pl-pilot-armor-card',
  components: { PlCardBase },
  props: {
    item: {
      type: Object,
      required: false,
      default: null,
    },
    extended: {
      type: Boolean,
      required: false,
    },
    readonly: {
      type: Boolean,
    },
    exotics: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data: () => ({
    headers: [
      { text: 'Item', align: 'left', value: 'Name' },
      { text: 'Armor', align: 'center', value: 'Armor' },
      { text: 'HP Bonus', align: 'center', value: 'HPBonus' },
      { text: 'E-Defense', align: 'center', value: 'EDefense' },
      { text: 'Evasion', align: 'center', value: 'Evasion' },
      { text: 'Speed', align: 'center', value: 'Speed' },
      { text: '', align: 'center', value: 'Equip' },
    ],
  }),
  computed: {
    armor() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_armor')
      return attr ? attr.Value : 0
    },
    hp() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_hp')
      return attr ? attr.Value : 0
    },
    edef() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_edef')
      return attr ? attr.Value : 0
    },
    evasion() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_evasion')
      return attr ? attr.Value : 0
    },
    speed() {
      const attr = this.item.Bonuses.find(b => b.ID === 'pilot_speed')
      return attr ? attr.Value : 0
    },
  },
  methods: {
    equip(item: PilotArmor) {
      this.$emit('equip', this.$_.clone(item))
      this.$refs.base.closeSelector()
    },
    getArmor() {
      const compendium = getModule(CompendiumStore, this.$store)
      let gear = compendium.PilotGear.filter(
        (x: CompendiumItem) => !x.IsHidden && !x.IsExotic && x.ItemType === ItemType.PilotArmor
      )
      if (this.exotics.length) {
        gear = gear.concat(this.exotics)
      }
      return gear
    },
    fID(template: string): string {
      return flavorID(template)
    },
  },
})
</script>
