<template>
  <div>
    <v-container fluid>
      <div
        class="font-weight-light text-center my-n2"
        :style="
          $vuetify.breakpoint.mdAndDown
            ? 'letter-spacing: 1vw!important; font-size: 7vw!important;'
            : 'letter-spacing: 2vw!important; font-size: 4vw!important;'
        "
      >
        КОМПЕНДИУМ
      </div>
      <v-row dense justify="center">
        <v-col lg="8" xs="12">
          <search-bar />
        </v-col>
      </v-row>
    </v-container>
    <div>
      <v-container fluid grid-list-lg class="mt-0 pt-0">
        <v-row
          dense
          :justify="$vuetify.breakpoint.smAndDown ? 'space-between' : 'space-around'"
          align="center"
        >
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-manufacturer"
            name="Производители"
            @clicked="$router.push('compendium/manufacturers')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-license"
            name="Лицензии"
            @clicked="$router.push('compendium/licenses')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-corebonus"
            name="Бонусы ЯДРА"
            @clicked="$router.push('compendium/corebonuses')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="frame"
            icon="cci-frame"
            name="Рамы"
            @clicked="$router.push('compendium/frames')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="weapon"
            icon="cci-melee"
            name="Оружие мехов"
            @clicked="$router.push('compendium/weapons')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="system"
            icon="mdi-chip"
            name="Системы мехов"
            @clicked="$router.push('compendium/systems')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="secondary"
            icon="cci-pilot"
            name="Снаряжение пилотов"
            @clicked="$router.push('compendium/pilot_gear')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="secondary"
            icon="public"
            name="Предыстории"
            @clicked="$router.push('compendium/backgrounds')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="secondary"
            icon="cci-accuracy"
            name="Триггеры"
            @clicked="$router.push('compendium/skills')"
          />
          <compendium-page-button
            :lg="hasBonds ? '6' : '4'"
            md="6"
            sm="12"
            color="secondary"
            icon="cci-rank-3"
            name="Таланты"
            @clicked="$router.push('compendium/talents')"
          />
          <compendium-page-button
            v-show="hasBonds"
            lg="6"
            md="6"
            sm="12"
            color="secondary"
            icon="mdi-vector-link"
            name="Bonds"
            @clicked="$router.push('compendium/bonds')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-npc-class"
            name="Классы НИП"
            @clicked="$router.push('compendium/npc_classes')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-npc-feature"
            name="Системы НИП"
            @clicked="$router.push('compendium/npc_features')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            color="primary"
            icon="cci-npc-template"
            name="Шаблоны НИП"
            @clicked="$router.push('compendium/npc_templates')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-status-exposed"
            name="Статусы &amp; Состояния"
            @clicked="$router.push('compendium/statuses')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-reserve-mech"
            name="Резервы"
            @clicked="$router.push('compendium/reserves')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-activate"
            name="Экономика действий"
            @clicked="$router.push('compendium/actions')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="mdi-tag"
            name="Метки снаряжения"
            @clicked="$router.push('compendium/tags')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-accuracy"
            name="Справка"
            @clicked="$router.push('compendium/reference')"
          />
          <compendium-page-button
            lg="4"
            md="6"
            sm="12"
            icon="cci-compendium"
            name="Словарь"
            @clicked="$router.push('compendium/glossary')"
          />
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBar from '../SearchBar.vue'
import CompendiumPageButton from '../components/CompendiumPageButton.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'compendium-home',
  components: { SearchBar, CompendiumPageButton },
  computed: {
    hasBonds() {
      return getModule(CompendiumStore, this.$store).Bonds.length
    },
  },
})
</script>
