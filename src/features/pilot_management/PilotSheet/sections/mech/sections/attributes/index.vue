<template>
  <v-col>
    <div class="ml-n3">
      <cc-title small :color="color" class="pl-3 ml-n6">АТТРИБУТЫ МЕХОВ</cc-title>
    </div>
    <v-row no-gutters>
      <v-col cols="12" md="1" class="mr-3">
        <v-row no-gutters justify="space-between">
          <hase-pips
            :mech="mech"
            :attr="small ? 'крп' : 'корпус'"
            :val="pilot.MechSkillsController.MechSkills.Hull"
            :color="color"
          />
          <hase-pips
            :mech="mech"
            :attr="small ? 'мнвр' : 'маневренность'"
            :val="pilot.MechSkillsController.MechSkills.Agi"
            :color="color"
          />
          <hase-pips
            :mech="mech"
            :attr="small ? 'сис' : 'системы'"
            :val="pilot.MechSkillsController.MechSkills.Sys"
            :color="color"
          />
          <hase-pips
            :mech="mech"
            :attr="small ? 'инж' : 'инженерия'"
            :val="pilot.MechSkillsController.MechSkills.Eng"
            :color="color"
          />
          <v-col cols="auto" md="12">
            <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mt-2" />
            <span v-if="$vuetify.breakpoint.lgAndUp" class="overline no-height">СП</span>
            <span v-else class="overline no-height">СП</span>
            <cc-tooltip
              :title="`${mech.MaxSP} Системных Пунктов`"
              :content="mech.SPContributors.join('<br />')"
            >
              <span class="heading h3 no-height">&nbsp;{{ mech.MaxSP }}</span>
            </cc-tooltip>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row no-gutters align="center">
          <v-col>
            <v-row no-gutters>
              <statblock-item
                :attr="small ? 'СТР' : 'Структура'"
                :val="mech.MaxStructure"
                :contributors="mech.StructureContributors"
                :color="color"
              />
              <statblock-item
                attr="ПЗ"
                :val="mech.MaxHP"
                :contributors="mech.HPContributors"
                :color="color"
              />

              <statblock-item
                attr="Броня"
                :val="mech.Armor"
                :contributors="mech.ArmorContributors"
                :color="color"
              />
            </v-row>

            <v-row no-gutters>
              <statblock-item
                attr="Нагрузка"
                :val="mech.MaxStress"
                :contributors="mech.StressContributors"
                :color="color"
              />
              <statblock-item
                :attr="
                  small ? 'ТеплМакс' : $vuetify.breakpoint.lgAndUp ? 'Тепловой Максимум' : 'Тепл. Макс.'
                "
                :val="mech.HeatCapacity"
                :contributors="mech.HeatCapContributors"
                :color="color"
              />
              <statblock-item
                :attr="
                  small ? 'ЛимРем' : $vuetify.breakpoint.lgAndUp ? 'Лимит Ремонта' : 'Лим. Ремонта'
                "
                :val="mech.RepairCapacity"
                :contributors="mech.RepCapContributors"
                :color="color"
              />
            </v-row>
          </v-col>
          <v-col v-if="!small" cols="auto">
            <v-icon size="120" :color="color" class="px-4 mt-n2">
              {{ mech.SizeIcon }}
            </v-icon>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Бонус Атаки' : 'Бонус Атаки'"
            signed
            :val="mech.AttackBonus"
            :contributors="mech.AttackBonusContributors"
            :color="color"
          />
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Техническая Атака' : 'Тех. Атака'"
            signed
            :val="mech.TechAttack"
            :contributors="mech.TechAttackContributors"
            :color="color"
          />
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Бонус Ограниченных Систем' : 'Бонус Ограниченного'"
            signed
            :val="mech.LimitedBonus"
            :contributors="mech.LimitedContributors"
            :color="color"
          />
        </v-row>
        <v-row no-gutters>
          <statblock-item
            attr="Скорость"
            :val="mech.Speed"
            :contributors="mech.SpeedContributors"
            :color="color"
          />
          <statblock-item
            :attr="small ? 'Укл' : 'Уклонение'"
            :val="mech.Evasion"
            :contributors="mech.EvasionContributors"
            :color="color"
          />
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Э-Защита' : 'Э-Защ'"
            :val="mech.EDefense"
            :contributors="mech.EDefenseContributors"
            :color="color"
          />
          <statblock-item
            :attr="small ? 'sensor' : $vuetify.breakpoint.lgAndUp ? 'Дальность Сенсоров' : 'Сенсоры'"
            :val="mech.SensorRange"
            :contributors="mech.SensorRangeContributors"
            :color="color"
          />
          <statblock-item
            :attr="$vuetify.breakpoint.lgAndUp ? 'Спасбросок Цели' : 'Спасбросок'"
            :val="mech.SaveTarget"
            :contributors="mech.SaveTargetContributors"
            :color="color"
          />
          <statblock-item
            v-if="small"
            attr="Размер"
            :val="mech.Size"
            :contributors="mech.SizeContributors"
            :color="color"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import StatblockItem from './StatblockItem.vue'
import HasePips from './HasePips.vue'

export default Vue.extend({
  name: 'attributes-block',
  components: { StatblockItem, HasePips },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    pilot: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  computed: {
    small() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
})
</script>

<style scoped>
.no-height {
  line-height: 0 !important;
}
</style>
