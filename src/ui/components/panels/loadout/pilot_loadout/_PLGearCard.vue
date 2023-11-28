<template>
  <pl-card-base
    ref="base"
    title="СНАРЯЖЕНИЕ ПИЛОТА"
    :extended="extended"
    :item="item"
    :readonly="readonly"
    @remove="$emit('remove')"
    @save="$emit('save')"
  >
    <div
      v-if="item"
      class="text-left"
      style="cursor: pointer !important; height: 100%"
      @click="$refs.base.openDetail()"
    >
      <v-row dense>
        <v-col>
          <span :key="item.Name" class="h2 heading text--text" style="line-height: 35px">
            {{ item.Name }}
            <cc-tooltip v-if="item.Note" :key="item.Note.length" simple inline :content="item.Note">
              <v-icon small color="active">mdi-note</v-icon>
            </cc-tooltip>
          </span>
        </v-col>
        <v-col cols="auto" class="ml-auto text-right mt-n2 mb-n2">
          <div class="overline">ИСПОЛЬЗОВАНИЙ ПРЕДМЕТА</div>
          <v-icon v-if="!item.MaxUses" color="secondary" class="mt-n3 mr-2">mdi-infinity</v-icon>
          <cc-item-uses v-else :item="item" color="secondary" class="mt-n3" />
        </v-col>
      </v-row>
      <v-row
        v-if="!readonly"
        dense
        class="mt-2"
        :style="`max-height: ${
          $vuetify.breakpoint.smAndDown ? '125' : '200'
        }px; overflow-y: scroll`"
      >
        <p v-html-safe="item.Description" class="text--text" />
      </v-row>
      <v-row no-gutters>
        <v-col cols="auto" class="ml-auto mr-4 mt-n2">
          <cc-tags small :tags="item.Tags" color="secondary" />
        </v-col>
      </v-row>
    </div>
    <v-card-text slot="selector">
      <cc-selector-table
        no-filter
        no-extra
        :items="getGear()"
        :headers="headers"
        @equip="equip($event)"
      >
        <div v-if="item">
          <span class="overline">
            PRINTID КАТАЛОГА СНАРЯЖЕНИЯ ДМС: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
            <span class="success--text text--darken-1">
              [ РЕГИСТРАЦИЯ СНАРЯЖЕНИЯ ПИЛОТА ПОДТВЕРЖДЕНА ]
            </span>
          </span>
          <br />
          <span class="heading h1 accent--text" style="line-height: 20px">{{ item.Name }}</span>
          <span class="flavor-text overline mt-n1" style="display: block">СЕЙЧАС ИСПОЛЬЗУЕТСЯ</span>
        </div>
        <div v-else>
          <span class="overline">АВТОРИЗАЦИЯ СНАРЯЖЕНИЯ ДМС: ПИЛОТСКОЕ/ДОПОЛНИТЕЛЬНОЕ СНАРЯЖЕНИЕ (ЛЮБОЕ)</span>
          <br />
          <span class="heading h1 subtle--text text--lighten-1" style="line-height: 20px">
            НИЧЕГО НЕ ВЫБРАНО
          </span>
          <span class="flavor-text overline mt-n1 error--text" style="display: block">
            [ ID СНАРЯЖЕНИЯ НЕПРАВИЛЕН ИЛИ ОТСУТСТВУЕТ ]
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
import { PilotGear, CompendiumItem, ItemType } from '@/class'
import { flavorID } from '@/io/Generators'

export default Vue.extend({
  name: 'pl-pilot-gear-card',
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
      { text: 'Предмет', align: 'left', value: 'Name' },
      { text: 'Использований', align: 'center', value: 'MaxUses' },
      { text: 'Подробности', align: 'center', value: 'Detail' },
      { text: '', align: 'center', value: 'Equip' },
    ],
  }),
  methods: {
    equip(item: PilotGear) {
      this.$emit('equip', this.$_.clone(item))
      this.$refs.base.closeSelector()
    },
    getGear() {
      const compendium = getModule(CompendiumStore, this.$store)
      let gear = compendium.PilotGear.filter(
        (x: CompendiumItem) => !x.IsHidden && !x.IsExotic && x.ItemType === ItemType.PilotGear
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
