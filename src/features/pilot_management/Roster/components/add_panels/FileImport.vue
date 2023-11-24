<template>
  <v-container>
    <v-file-input
      v-model="fileValue"
      accept="text/json"
      outlined
      label="Выберите файл даных пилота"
      prepend-icon="mdi-paperclip"
      @change="stageImport"
      @click:clear="reset"
    />
    <v-card v-if="missingContent.length">
      <p v-if="oldBrewsWarning" class="heading h3 accent--text">
        ВНИМАНИЕ: Импортированный пилот был создан с использованием более старой версии COMP/CON. 
        Анализ Lancer Content Pack может быть неполным, и существует вероятность того, что COMP/CON 
        не сможет правильно загрузить эти данные. Экспортируйте исходный файл в последнюю версию COMP/CON, 
        чтобы гарантировать проверку LCP.
      </p>
      <v-card-text class="text-center">
        <p class="heading h4 accent--text">
          Импортированному пилоту требуются следующие пакеты LCP, 
          которые в данный момент не установлены/активны или имеют несовпадающие версии:
        </p>
        <p class="effect-text text-center" v-html="missingContent" />
        <p class="text--text">
          Этого пилота нельзя импортировать до тех пор, пока не будут 
          установлены и активированы отсутствующие пакеты LCP или пока версии пакетов LCP не будут синхронизированы.
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="reset">Отменить импорт</v-btn>
      </v-card-actions>
    </v-card>
    <div class="mt-2">
      <p v-if="alreadyPresent" class="accent--text text-center">
        Пилот с таким идентификатором уже существует в списке. При импорте будет создана уникальная копия этого пилота.
      </p>
      <v-slide-x-reverse-transition>
        <v-row v-if="stagedData" align="center" justify="center">
          <v-col cols="auto">
            <v-btn
              large
              color="secondary"
              :disabled="missingContent.length > 0"
              @click="importFile()"
            >
              <v-icon large left>cci-accuracy</v-icon>
              Импортировать {{ stagedData.callsign }} ({{ stagedData.name }})
            </v-btn>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot } from '@/class'
import { importData } from '@/io/Data'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore } from '@/store'
import { PilotData } from '@/interface'

export default Vue.extend({
  name: 'file-import',
  data: () => ({
    // fileValue is just used to clear the file input
    fileValue: null,
    oldBrewsWarning: false,
    missingContent: '',
    stagedData: null,
    alreadyPresent: false,
  }),
  methods: {
    reset() {
      this.fileValue = null
      this.oldBrewsWarning = false
      this.missingContent = ''
      this.stagedData = null
      this.alreadyPresent = false
    },
    async stageImport(file) {
      if (!file) return
      const pilotData = await importData<PilotData>(file)
      if (!pilotData.brews) pilotData.brews = []
      // catch old style brews
      if (pilotData.brews.length && !pilotData.brews[0].LcpId) {
        this.oldBrewsWarning = true

        const installedPacks = getModule(CompendiumStore, this.$store)
          .ContentPacks.filter(x => x.Active)
          .map(x => `${x.Name} @ ${x.Version}`)
        const missingPacks = this.$_.pullAll(pilotData.brews, installedPacks)
        if (missingPacks.length) this.missingContent = missingPacks.join('<br />')
      } else {
        const installedPacks = getModule(CompendiumStore, this.$store)
          .ContentPacks.filter(x => x.Active)
          .map(x => x.ID)
        let missing = []
        pilotData.brews.forEach(b => {
          if (!installedPacks.includes(b.LcpId)) {
            missing.push(`${b.LcpName} @ ${b.LcpVersion}`)
          }
        })
        if (missing.length) this.missingContent = missing.join('<br />')
      }
      if (
        getModule(PilotManagementStore)
          .Pilots.map(x => x.ID)
          .includes(pilotData.id)
      ) {
        this.alreadyPresent = true
        pilotData.name += '※'
        pilotData.callsign += '※'
      }
      this.stagedData = pilotData
    },
    importFile() {
      try {
        const importPilot = Pilot.Deserialize(this.stagedData)
        importPilot.GroupController.reset()
        importPilot.CloudController.reset()
        importPilot.RenewID()
        this.$store.dispatch('addPilot', importPilot)
        this.reset()
        this.$emit('done')
        this.$notify('Пилот успешно импортирован', 'success')
      } catch (error) {
        this.$notify(
          'Во время попытки импорта произошла ошибка. Пожалуйста, проверьте журнал консоли.',
          'error'
        )
      }
    },
    cancelImport() {
      this.reset()
    },
  },
})
</script>

<style scoped>
#panel {
  border: 5px double var(--v-panel-border-base) !important;
  border-radius: 2px !important;
}
</style>
