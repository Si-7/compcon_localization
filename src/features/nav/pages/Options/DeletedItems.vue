<template>
  <div>
    <v-alert outlined class="text-center" color="subtle" dense>
      <span v-if="items.length">
        Удаленные элементы сохраняются в течение 30 дней, после чего автоматически удаляются
      </span>
      <span v-else>Ничего не найдено</span>
    </v-alert>
    <v-simple-table v-if="items.length" class="text-left pa-2">
      <thead>
        <th>Тип объекта</th>
        <th>Название объекта</th>
        <th>Удален</th>
        <th>Восстанавливаем до</th>
        <th />
        <th />
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.ID">
          <td>{{ displayTypes(item.ItemType).toUpperCase() }}</td>
          <td>{{ item.Name }}{{ item.Callsign ? ` (${item.Callsign})` : '' }}</td>
          <td>{{ item.SaveController.DeleteTime }}</td>
          <td>{{ item.SaveController.ExpireTime }}</td>
          <td class="text-right">
            <v-btn small color="primary" @click="item.SaveController.restore()">Восстановить</v-btn>
          </td>
          <td class="text-right">
            <v-btn small color="primary" @click="permanentlyDelete(item)">Удалить Навсегда</v-btn>
          </td>
        </tr>
      </tbody>

      <tfoot class="light-panel">
        <tr>
          <td colspan="4" />
          <td><v-btn small color="error" @click="restoreAll()">Восстановить Все</v-btn></td>
          <td>
            <v-btn small color="error" @click="deleteAll()">Удалить Навсегда Все</v-btn>
          </td>
        </tr>
      </tfoot>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { MissionStore, EncounterStore, NpcStore, PilotManagementStore } from '@/store'

export default Vue.extend({
  name: 'deleted-items',
  computed: {
    items() {
      return [
        ...getModule(MissionStore, this.$store).AllActiveMissions.filter(
          x => x.SaveController.IsDeleted
        ),
        ...getModule(MissionStore, this.$store).AllMissions.filter(x => x.SaveController.IsDeleted),
        ...getModule(EncounterStore, this.$store).AllEncounters.filter(
          x => x.SaveController.IsDeleted
        ),
        ...getModule(NpcStore, this.$store).AllNpcs.filter(x => x.SaveController.IsDeleted),
        ...getModule(PilotManagementStore, this.$store).AllPilots.filter(
          x => x.SaveController.IsDeleted
        ),
      ]
    },
  },
  methods: {
    displayTypes(type) {
      switch (type) {
        case 'Active Mission':
          return 'Активная Миссия'
        case 'Mission':
          return 'Миссия'
        case 'Encounter':
          return 'Бой'
        case 'NPC':
          return 'НИП'
        case 'Pilot':
        default:
          return 'Пилот'
      }
    },
    permanentlyDelete(item) {
      switch (item.ItemType) {
        case 'mission':
          const ms = getModule(MissionStore, this.$store)
          ms.deleteMissionPermanent(ms.AllMissions.find(x => x.ID === item.ID))
          break
        case 'activemission':
          const ams = getModule(MissionStore, this.$store)
          ams.deleteActiveMissionPermanent(ams.AllActiveMissions.find(x => x.ID === item.ID))
          break
        case 'encounter':
          const es = getModule(EncounterStore, this.$store)
          es.deleteEncounterPermanent(es.AllEncounters.find(x => x.ID === item.ID))
          break
        case 'npc':
          const ns = getModule(NpcStore, this.$store)
          ns.deleteNpcPermanent(ns.AllNpcs.find(x => x.ID === item.ID))
          break
        case 'pilot':
          const ps = getModule(PilotManagementStore, this.$store)
          ps.deletePilotPermanent(ps.AllPilots.find(x => x.ID === item.ID))
          break
        default:
          break
      }
    },
    restoreAll() {
      this.items.forEach(item => {
        item.SaveController.restore()
      })
    },
    deleteAll() {
      this.items.forEach(item => {
        this.permanentlyDelete(item)
      })
    },
  },
})
</script>
