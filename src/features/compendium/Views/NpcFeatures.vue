<template>
  <v-container fluid>
    <compendium-browser :headers="headers" :items="features" no-filter lock-view>
      Системы НИП
    </compendium-browser>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CompendiumBrowser from '../components/CompendiumBrowser.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { NpcFeature } from '@/class'

@Component({
  components: { CompendiumBrowser },
})
export default class Weapons extends Vue {
  public headers = [
    { text: 'Система', align: 'left', value: 'Name' },
    { text: 'Тип', align: 'left', value: 'FeatureType' },
    { text: 'Класс', align: 'left', value: 'OriginClass' },
    { text: 'Набор', align: 'left', value: 'OriginSet' },
  ]

  private compendium = getModule(CompendiumStore, this.$store)
  public get features(): NpcFeature[] {
    return this.compendium.NpcFeatures
  }
}
</script>
