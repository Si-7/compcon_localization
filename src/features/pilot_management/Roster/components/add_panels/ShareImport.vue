<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-text-field
          v-model="shareCode"
          outlined
          label="Pilot Share Code"
          style="width: 200px"
          hide-details
          clearable
          color="accent"
          @click:clear="reset"
          @keyup="sanitizeShareCode()"
          :readonly="!!searchResults"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn
          large
          color="secondary"
          :disabled="shareCode && shareCode.length !== 6"
          :loading="loading"
          @click="search()"
        >
          <v-icon large left>mdi-account-search</v-icon>
          Поиск
        </v-btn>
      </v-col>
    </v-row>
    <div v-if="searchResults !== null" class="my-2">
      <v-card outlined>
        <v-card-text class="text-center">
          <i v-if="!searchResults.Item">Не найдено записей с кодом {{ shareCode }}</i>
          <div v-else>
            <div>Запись найдена! Попытка загрузить данные...</div>
            <v-progress-linear v-show="loading" indeterminate />
            <v-fade-transition>
              <div v-if="pilotData">
                Загружен {{ pilotData.callsign }} ({{ pilotData.name }}). Подготовка к импортированию...
              </div>
            </v-fade-transition>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <v-card v-if="missingContent.length">
      <p v-if="oldBrewsWarning" class="heading h3 accent--text">
        ВНИМАНИЕ: Импортированный пилот был создан с использованием более старой 
        версии COMP/CON. Анализ пакета контента Lancer может быть неполным, и существует 
        вероятность того, что COMP/CON не сможет правильно загрузить эти данные. Экспортируйте 
        исходный файл в последнюю версию COMP/CON, чтобы гарантировать проверку LCP.
      </p>
      <v-card-text class="text-center">
        <p class="heading h4 accent--text">
          Импортированному пилоту требуются следующие пакеты контента, которые в данный момент не установлены/активны или имеют несовпадающие версии:
        </p>
        <p class="effect-text text-center" v-html="missingContent" />
        <p class="text--text">
          Этот пилот нельзя импортировать до тех пор, пока не будут 
          установлены и активированы отсутствующие пакеты содержимого или пока версии пакетов содержимого не будут синхронизированы.
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="reset">Прервать импорт</v-btn>
      </v-card-actions>
    </v-card>
    <div class="mt-2">
      <p v-if="alreadyPresentItem" class="accent--text text-center">
        Пилот с таким идентификатором уже существует в списке. Невозможно установить этот пилот в качестве удаленного ресурса. Вы можете
        <b class="accent--text">навсегда удалить</b>
        существующего пилота, чтобы продолжить импорт.
        <v-btn x-small color="error" @click="deleteAP()">Удалить локальный элемент навсегда</v-btn>
      </p>
      <p v-if="isSameUser" class="accent--text text-center">
        Идентификатор облачной учетной записи, связанный с этим элементом, такой же, как у текущего 
        вошедшего в систему пользователя. Невозможно установить этого пилота в качестве удаленного ресурса.
      </p>
      <v-slide-x-reverse-transition>
        <v-row v-if="stagedData" align="center" justify="space-around">
          <v-col cols="auto">
            <v-btn
              large
              color="secondary"
              :disabled="missingContent.length > 0"
              @click="importAsCopy()"
            >
              <v-icon large left>cci-accuracy</v-icon>
              Импортировать {{ stagedData.callsign }} ({{ stagedData.name }}) как&nbsp;
              <b>копию</b>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              large
              color="secondary"
              :disabled="missingContent.length > 0 || alreadyPresentItem || isSameUser"
              @click="importAsRemote()"
            >
              <v-icon large left>cci-accuracy</v-icon>
              Импортировать {{ stagedData.callsign }} ({{ stagedData.name }}) как&nbsp;
              <b>удаленный проект</b>
              <cc-tooltip
                title="Удаленный ресурс"
                content="Импорт этого пилота в качестве удаленного ресурса приведет к созданию в 
                вашем списке версии этого пилота, доступной <b>только для чтения</b>, которую можно будет обновить, 
                когда владелец этих данных опубликует изменения в своей облачной учетной записи. Удаленные данные не могут 
                быть сохранены в вашей собственной облачной учетной записи. Редактируемую локальную копию пилота 
                удаленного ресурса можно создать путем дублирования пилота (Параметры пилотного проекта > Клонировать > Дублировать)."
              >
                <v-icon right>mdi-information-outline</v-icon>
              </cc-tooltip>
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
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, PilotManagementStore } from '@/store'
import { getRecord } from '@/io/apis/share'
import { GetSingleRemote } from '@/cloud/item_sync'
import { Auth } from 'aws-amplify'

export default Vue.extend({
  name: 'share-import',
  data: () => ({
    cid: '',
    shareCode: '',
    loading: false,
    pilotData: null,
    oldBrewsWarning: false,
    missingContent: '',
    stagedData: null,
    alreadyPresentItem: null,
    isSameUser: false,
    searchResults: null,
  }),
  async mounted() {
    this.cid = await Auth.currentUserCredentials()
      .then(res => res.identityId)
      .catch(() => '')
  },
  watch: {
    searchResults(newval) {
      if (newval && newval.Item) {
        if (newval.Item.iid === this.cid) {
          this.isSameUser = true
        }
        this.downloadPilotData()
      }
    },
  },
  methods: {
    reset() {
      this.shareCode = ''
      this.loading = false
      this.pilotData = null
      this.oldBrewsWarning = false
      this.missingContent = ''
      this.stagedData = null
      this.alreadyPresentItem = null
      this.searchResults = null
      this.isSameUser = false
    },
    async search() {
      this.loading = true
      this.shareCode = this.shareCode.toUpperCase()
      getRecord(this.shareCode)
        .then(res => {
          this.searchResults = res.data
          if (!res.data.Item) this.loading = false
        })
        .catch(err => {
          console.error(err)
          this.$notify('Произошла ошибка при поиске кода.', err)
          this.loading = false
        })
    },
    async downloadPilotData() {
      const record = this.searchResults.Item
      GetSingleRemote(record.key, record.iid)
        .then(res => {
          this.pilotData = res
        })
        .then(() => this.stageImport())
        .catch(err => {
          console.error(err)
          this.$notify('Произошла ошибка при загрузке удаленных данных.', err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    async stageImport() {
      if (!this.pilotData.brews) this.pilotData.brews = []
      // catch old style brews
      if (this.pilotData.brews.length && !this.pilotData.brews[0].LcpId) {
        this.oldBrewsWarning = true

        const installedPacks = getModule(CompendiumStore, this.$store)
          .ContentPacks.filter(x => x.Active)
          .map(x => `${x.Name} @ ${x.Version}`)
        const missingPacks = this.$_.pullAll(this.pilotData.brews, installedPacks)
        if (missingPacks.length) this.missingContent = missingPacks.join('<br />')
      } else {
        const installedPacks = getModule(CompendiumStore, this.$store)
          .ContentPacks.filter(x => x.Active)
          .map(x => x.ID)
        let missing = []
        this.pilotData.brews.forEach(b => {
          if (!installedPacks.includes(b.LcpId)) {
            missing.push(`${b.LcpName} @ ${b.LcpVersion}`)
          }
        })
        if (missing.length) this.missingContent = missing.join('<br />')
      }
      const ap = getModule(PilotManagementStore).AllPilots.find(x => x.ID === this.pilotData.id)
      if (ap) {
        this.alreadyPresentItem = ap
      }
      this.stagedData = this.pilotData
    },
    importAsCopy() {
      console.log('importing as copy')
      try {
        this.pilotData.name += '※'
        this.pilotData.callsign += '※'
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
    importAsRemote() {
      console.log('importing as remote')
      try {
        const importPilot = Pilot.Deserialize(this.stagedData)
        importPilot.GroupController.reset()
        const record = this.searchResults.Item
        importPilot.CloudController.SetRemoteResource(record.iid, record.key)
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
    sanitizeShareCode() {
      if (!this.shareCode) this.shareCode = ''
      this.shareCode = this.shareCode.replaceAll(' ', '')
    },
    deleteAP() {
      const ps = getModule(PilotManagementStore, this.$store)
      ps.deletePilotPermanent(ps.AllPilots.find(x => x.ID === this.alreadyPresentItem.ID))
      this.alreadyPresentItem = null
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
