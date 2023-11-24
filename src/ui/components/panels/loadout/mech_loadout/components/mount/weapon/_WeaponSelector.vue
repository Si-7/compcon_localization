<template>
  <div>
    <cc-selector-table
      :items="availableWeapons"
      :headers="headers"
      sp-disable
      :sp="freeSP"
      :sp-ignore="showOverSP"
      item-type-fallback="MechWeapon"
      @equip="$emit('equip', $event)"
    >
      <div v-if="weaponSlot.Weapon">
        <span class="overline">
          PRINTID ОРУЖЕЙНОЙ СОЮЗА: {{ fID('ANN-NNN-NNN::AA//AA') }} &mdash;
          <span class="success--text text--darken-1">
            [ РЕГИСТРАЦИЯ СНАРЯЖЕНИЯ РАМЫ ПОДТВЕРЖДЕНА ]
          </span>
        </span>
        <br />
        <span class="heading h1 accent--text" style="line-height: 20px">
          {{ weaponSlot.Weapon.Name }}
        </span>
        <span class="flavor-text overline mt-n1" style="display: block">СЕЙЧАС ИСПОЛЬЗУЕТСЯ</span>
      </div>
      <div v-else>
        <span class="overline">
          АВТОРИЗАЦИЯ СНАРЯЖЕНИЯ ОРУЖЕЙНОЙ СОЮЗА: СНАРЯЖЕНИЕ РАМЫ//ВООРУЖЕНИЕ::{{ weaponSlot.Size }}
          СЛОТ
        </span>
        <br />
        <span class="heading h1 subtle--text text--lighten-1" style="line-height: 20px">
          НИЧЕГО НЕ ВЫБРАНО
        </span>
        <span class="flavor-text overline mt-n1 error--text" style="display: block">
          [ ID НЕПРАВИЛЕН ИЛИ ОТСУТСТВУЕТ ]
        </span>
      </div>
      <div slot="extra-item" class="mt-2 mb-n2">
        <div class="mb-n2">
          <v-switch
            v-model="showUnlicensed"
            dense
            inset
            hide-details
            color="warning"
            class="mr-3 d-inline"
          >
            <cc-tooltip
              slot="label"
              simple
              inline
              :content="
                showUnlicensed ? 'Нелицензированное снаряжение: ПОКАЗАНО' : 'Нелицензированное снаряжение: СПРЯТАНО'
              "
            >
              <v-icon
                class="ml-n2"
                :color="showUnlicensed ? 'warning' : 'success'"
                v-html="showUnlicensed ? 'mdi-lock-open' : 'mdi-lock'"
              />
            </cc-tooltip>
          </v-switch>
        </div>
        <div class="mt-n4">
          <v-switch
            v-model="showOverSP"
            dense
            inset
            hide-details
            color="warning"
            class="mr-3 d-inline"
          >
            <cc-tooltip
              slot="label"
              simple
              inline
              :content="
                showOverSP
                  ? 'Системы, превышающие оставшиеся СП: ПОКАЗАНЫ'
                  : 'Системы, превышающие оставшиеся СП: СПРЯТАНЫ'
              "
            >
              <v-icon
                class="ml-n2"
                :color="showOverSP ? 'warning' : 'success'"
                v-html="'cci-system-point'"
              />
            </cc-tooltip>
          </v-switch>
        </div>
      </div>
    </cc-selector-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Rules, MechWeapon } from '@/class'
import { flavorID } from '@/io/Generators'
import { Bonus } from '@/classes/components/feature/bonus/Bonus'

export default Vue.extend({
  name: 'weapon-selector',
  props: {
    weaponSlot: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: 'Источник', align: 'left', value: 'Source' },
      { text: 'Оружие', align: 'left', value: 'Name' },
      { text: 'Лицензия', align: 'left', value: 'LicenseString' },
      { text: 'Размер', align: 'left', value: 'SizeInt' },
      { text: 'Тип', align: 'left', value: 'WeaponType' },
      { text: 'Дальность', align: 'left', value: 'Range[0].Max' },
      { text: 'Урон', align: 'left', value: 'Damage[0].Max' },
      { text: 'СП', align: 'left', value: 'SP' },
      { text: '', align: 'center', value: 'Equip' },
    ],
    weapons: [],
    showUnlicensed: false,
    showOverSP: false,
  }),
  computed: {
    freeSP(): number {
      return this.weaponSlot.Weapon
        ? this.mech.FreeSP + this.weaponSlot.Weapon.SP
        : this.mech.FreeSP
    },
    availableWeapons(): MechWeapon[] {
      const fittings = Rules.MountFittings[this.weaponSlot.Size]
      // filter by fitting size
      console.log(this.weapons);
      console.log(fittings);
      let i = this.weapons.filter(x => fittings.includes(x.Size) && !x.IsHidden && !x.IsExotic)

      // filter already equipped
      if (this.weaponSlot.Weapon) i = i.filter(x => x.ID !== this.weaponSlot.Weapon.ID)

      // filter ai
      if (
        this.mech.MechLoadoutController.ActiveLoadout.AICount >=
        1 + Bonus.get('ai_cap', this.mech)
      ) {
        i = i.filter(x => !x.IsAI)
      }

      if (!this.showUnlicensed) {
        i = i.filter(
          x => !x.LicenseLevel || this.mech.Pilot.has('License', x.License, x.LicenseLevel)
        )
      }

      i = i.concat(
        this.mech.Pilot.SpecialEquipment.filter(
          x => x.ItemType === 'MechWeapon' && fittings.includes(x.Size)
        )
      )

      // filter unique
      i = i.filter(
        x =>
          !this.mech.MechLoadoutController.ActiveLoadout.UniqueWeapons.map(y => y.ID).includes(x.ID)
      )

      return _.sortBy(i, ['Source', 'Name'])
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.weapons = compendium.MechWeapons.filter(x => x.Source)
  },
  methods: {
    fID(template: string): string {
      return flavorID(template)
    },
  },
})
</script>
