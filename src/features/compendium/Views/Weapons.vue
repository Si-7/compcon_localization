<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="weapons">ОРУЖИЕ МЕХОВ</compendium-browser>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, UserStore } from '@/store'
import { MechWeapon } from '../../../classes/mech/components/equipment/MechWeapon'

@Component({
  components: { CompendiumBrowser },
})
export default class Weapons extends Vue {
  public headers = [
    { text: 'Источник', align: 'left', value: 'Source' },
    { text: 'Оружие', align: 'left', value: 'Name' },
    { text: 'Лицензия', align: 'left', value: 'LicenseString' },
    { text: 'Размер', align: 'left', value: 'SizeInt' },
    { text: 'Тип', align: 'left', value: 'WeaponType' },
    { text: 'Дистанция', align: 'left', value: 'Range[0].Max' },
    { text: 'Урон', align: 'left', value: 'Damage[0].Max' },
  ]

  private compendium = getModule(CompendiumStore, this.$store)
  private user = getModule(UserStore, this.$store).UserProfile
  private sourceIds = this.compendium.Manufacturers.map(x => x.ID)

  public get weapons(): MechWeapon[] {
    let arr = this.compendium.MechWeapons.filter(x => !x.IsHidden && !(!x.Source && !x.IsExotic))
    if (!this.user.GetView('showExotics')) {
      arr = arr.filter(x => !x.IsExotic)
    }

    return _.orderBy(arr, [item => this.sourceIds.indexOf(item.Source), 'Name'])
  }
}
</script>
