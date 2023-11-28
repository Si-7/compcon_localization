<template>
  <div v-show="versionAnalysis !== 'err'" class="ma-1 py-1 px-2 panel rounded">
    <span v-if="versionAnalysis === 'brew outdated'">
      COMP/CON обнаружил более новую версию этого LCP, чем та, которая присутствует в 
      данных этого элемента. C/C может попытаться принудительно выполнить обновление. 
      Если идентификаторы элементов остались одинаковыми во всех версиях LCP, этот процесс 
      будет успешным.
    </span>
    <span v-else-if="versionAnalysis === 'pack outdated'">
      COMP/CON обнаружил, что этот элемент был создан с помощью LCP, более нового, чем тот, 
      который установлен в данный момент. Рекомендуется обновить локальный LCP, но C/C может 
      попытаться принудительно понизить версию этих данных. Это может вызвать ошибки, если оно 
      содержит содержимое LCP, которого нет в более ранних версиях.
    </span>
    <v-btn color="secondary" x-small @click="$emit('update')">Принудительно обновить данные</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'autoupdater',
  props: ['brew'],
  computed: {
    lcps() {
      return getModule(CompendiumStore, this.$store).ContentPacks
    },
    normalizedBrew() {
      if (this.brew.LcpName) return this.brew
      const arr = this.brew.split(' @ ')
      return {
        LcpName: arr[0],
        LcpVersion: arr[1],
      }
    },
    packByName() {
      return this.lcps.find(x => x.Name.toLowerCase() === this.normalizedBrew.LcpName.toLowerCase())
    },
    versionAnalysis() {
      if (!this.packByName) return 'err'
      let vBrew = parseInt(this.normalizedBrew.LcpVersion.split('.').join(''))
      if (isNaN(vBrew)) return 'err'
      let vPack = parseInt(this.packByName.Version.split('.').join(''))
      if (isNaN(vPack)) return 'err'

      if (vBrew < vPack) return 'brew outdated'
      return 'pack outdated'
    },
  },
})
</script>
