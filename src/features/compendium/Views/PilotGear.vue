<template>
  <v-container fluid>
    <h1 class="heading">СНАРЯЖЕНИЕ ПИЛОТОВ</h1>
    <v-tabs
      :vertical="$vuetify.breakpoint.mdAndUp"
      background-color="primary"
      :slider-size="12"
      slider-color="active"
      style="min-height: 80vh"
    >
      <v-tab ripple>БРОНЯ</v-tab>
      <v-tab ripple>ОРУЖИЕ</v-tab>
      <v-tab ripple>СНАРЯЖЕНИЕ</v-tab>
      <v-tab-item :class="$vuetify.breakpoint.mdAndUp ? 'ml-4' : ''">
        <compendium-browser no-filter :headers="armor_headers" :items="armor" />
      </v-tab-item>
      <v-tab-item :class="$vuetify.breakpoint.mdAndUp ? 'ml-4' : ''">
        <compendium-browser no-filter :headers="weapon_headers" :items="weapons" />
      </v-tab-item>
      <v-tab-item :class="$vuetify.breakpoint.mdAndUp ? 'ml-4' : ''">
        <compendium-browser no-filter :headers="gear_headers" :items="gear" />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, UserStore } from '@/store'
import { ItemType, PilotArmor, PilotGear } from '@/class'
import { PilotWeapon } from '@/class'

@Component({
  components: { CompendiumBrowser },
})
export default class PilotGearBrowser extends Vue {
  public armor_headers = [
    { text: 'Предмет', align: 'left', value: 'Name' },
    { text: 'Броня', align: 'center', value: 'Armor' },
    { text: 'Бонус ПЗ', align: 'center', value: 'HPBonus' },
    { text: 'Э-Защита', align: 'center', value: 'EDefense' },
    { text: 'Уклонение', align: 'center', value: 'Evasion' },
    { text: 'Скорость', align: 'center', value: 'Speed' },
  ]
  public weapon_headers = [
    { text: 'Предмет', align: 'left', value: 'Name' },
    { text: 'Дистанция', align: 'left', value: 'Range[0].Max' },
    { text: 'Урон', align: 'left', value: 'Damage[0].Max' },
  ]
  public gear_headers = [
    { text: 'Предмет', align: 'left', value: 'Name' },
    { text: 'Использований', align: 'center', value: 'MaxUses' },
  ]

  // typing on these is wrong... look into fixing it
  private compendium = getModule(CompendiumStore, this.$store)
  private user = getModule(UserStore, this.$store).UserProfile
  get armor(): PilotArmor[] {
    let arr = this.compendium.PilotGear.filter(
      x => !x.IsHidden && x.ItemType === ItemType.PilotArmor
    )
    if (!this.user.GetView('showExotics')) arr = arr.filter(x => !x.IsExotic)
    return arr as PilotArmor[]
  }
  get weapons(): PilotWeapon[] {
    let arr = this.compendium.PilotGear.filter(
      x => !x.IsHidden && x.ItemType === ItemType.PilotWeapon
    )
    if (!this.user.GetView('showExotics')) arr = arr.filter(x => !x.IsExotic)
    return arr as PilotWeapon[]
  }
  get gear(): PilotGear[] {
    let arr = this.compendium.PilotGear.filter(
      x => !x.IsHidden && x.ItemType === ItemType.PilotGear
    )
    if (!this.user.GetView('showExotics')) arr = arr.filter(x => !x.IsExotic)
    return arr as PilotGear[]
  }
}
</script>
