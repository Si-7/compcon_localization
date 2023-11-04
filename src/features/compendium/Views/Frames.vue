<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="frames">Рамы</compendium-browser>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, UserStore } from '@/store'
import { MechType, Frame } from '@/class'

@Component({
  components: { CompendiumBrowser },
})
export default class Frames extends Vue {
  public headers = [
    { text: 'Источник', align: 'left', value: 'Source' },
    { text: 'Рама', align: 'left', value: 'Name' },
    { text: 'Размер', align: 'left', value: 'Size' },
    { text: 'Броня', align: 'left', value: 'Armor' },
    { text: 'ПЗ', align: 'left', value: 'HP' },
    { text: 'Уклонение', align: 'left', value: 'Evasion' },
    { text: 'Э-Защита', align: 'left', value: 'EDefense' },
    { text: 'ТепМаксимум', align: 'left', value: 'HeatCap' },
    { text: 'Лимит Ремонта', align: 'left', value: 'RepCap' },
    { text: 'Сенсоры', align: 'left', value: 'SensorRange' },
    { text: 'ТехАтака', align: 'left', value: 'TechAttack' },
    { text: 'Спасбросок', align: 'left', value: 'SaveTarget' },
    { text: 'Скорость', align: 'left', value: 'Speed' },
    { text: 'СП', align: 'left', value: 'SP' },
  ]

  private compendium = getModule(CompendiumStore, this.$store)
  private user = getModule(UserStore, this.$store).UserProfile
  private sourceIds = this.compendium.Manufacturers.map(x => x.ID)

  public get frames(): Frame[] {
    let arr = this.compendium.Frames.filter(x => !x.IsHidden)
    if (!this.user.GetView('showExotics')) arr = arr.filter(x => !x.IsExotic)
    return _.sortBy(arr, [
      item => this.sourceIds.indexOf(item.Source), 
      'Name'
    ])
  }

  public frameTypes = Object.keys(MechType).sort() as MechType[]
}
</script>
