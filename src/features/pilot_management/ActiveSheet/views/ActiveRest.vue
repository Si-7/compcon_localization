<template>
  <div>
    <v-row align="start" class="mb-n3">
      <v-col>
        <span class="heading mech" style="line-height: 5px">{{ pilot.Callsign }}</span>
        <div class="flavor-text subtle--text">{{ pilot.Name }}</div>
      </v-col>
      <v-col cols="auto" class="ml-auto text-right mr-2 mt-n2">
        <div class="heading h3 accent--text">ПЗ</div>
        <div class="font-weight-bold mr-n5">
          <v-btn icon x-small class="fadeSelect" @click="pilot.CurrentHP -= 1">
            <v-icon small color="primary">mdi-minus</v-icon>
          </v-btn>
          {{ pilot.CurrentHP }}/{{ pilot.MaxHP }}
          <v-btn icon x-small class="fadeSelect" @click="pilot.CurrentHP += 1">
            <v-icon small color="primary">mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Броня</div>
        <div class="font-weight-bold">{{ pilot.Armor }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Э-Защита</div>
        <div class="font-weight-bold">{{ pilot.EDefense }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Уклонение</div>
        <div class="font-weight-bold">{{ pilot.Evasion }}</div>
      </v-col>
      <v-col cols="auto" class="text-right mx-2 mt-n2">
        <div class="heading h3 accent--text">Стойкость</div>
        <div class="font-weight-bold">+{{ pilot.Grit }}</div>
      </v-col>
    </v-row>

    <div v-if="mech.Destroyed || mech.ReactorDestroyed">
      <v-row v-if="mech.Destroyed" dense justify="center" class="text-center mb-n5">
        <v-col cols="auto">
          <v-alert dense outlined color="error" prominent>
            <v-icon slot="prepend" color="error" size="70" class="mr-3">cci-eclipse</v-icon>
            <span class="heading h1">МЕХ УНИЧТОЖЕН</span>
            <div class="heading mt-n4 subtle--text">FRAME.КРИТИЧЕСКОЕ//: КАТАСТРОФИЧЕСКИЙ УРОН</div>
          </v-alert>
        </v-col>
      </v-row>
      <div v-if="mech.ReactorDestroyed">
        <p class="heading h2 stark--text text-center pt-4">
          Этот мех не может быть отремонтирован и должен быть распечатан заново.
        </p>
      </div>
      <div v-else class="ma-3 panel clipped pt-3 px-6 text-center">
        <v-alert color="warning" outlined border="bottom" class="mb-2">
          <div class="body-text text--text">
            Этот мех может быть отремонтирован до рабочего состояния при использовании
            <b class="accent--text">4</b>
            Ремонта. Любой может пожертвовать свои Ремонты на это, что означает, что разрушенный мех может быть восстановлен, даже если у него недостаточно Ремонтов.
          </div>
        </v-alert>
        <div class="subtle--text mt-2">
          ОСТАВШИЕСЯ РЕМОНТЫ:
          <b class="accent--text">{{ mech.CurrentRepairs }}</b>
        </div>
        <div>
          <v-icon v-for="n in mech.CurrentRepairs" :key="'rep_' + n" large>control_point</v-icon>
          <v-icon
            v-for="n in mech.RepairCapacity - mech.CurrentRepairs"
            :key="'repcap_' + n"
            large
            color="grey darken-1"
          >
            mdi-circle-outline
          </v-icon>
        </div>
        <div class="heading h3 mt-2 text-left">РЕМОНТЫ</div>
        <v-slider
          v-model="selfRepair"
          :max="Math.min(mech.CurrentRepairs, 4)"
          step="1"
          thumb-label
          ticks="always"
          tick-size="6"
          track-color="active"
          track-fill-color="success"
        />
        <div class="heading h3 mt-2 text-left">РЕМОНТЫ СОЮЗНИКОВ</div>
        <v-slider
          v-model="allyRepair"
          step="1"
          :max="4 - selfRepair"
          ticks="always"
          thumb-label
          tick-size="6"
          track-color="active"
          track-fill-color="success"
        />
        <v-btn
          tile
          color="success darken-1"
          x-large
          dark
          class="mb-4 mt-n1"
          :disabled="selfRepair + allyRepair < 4"
          @click="pilot.State.RepairDestroyed(selfRepair)"
        >
          <v-icon x-large left>cci-repair</v-icon>
          &nbsp; Ремонтировать меха
        </v-btn>
      </div>
    </div>
    <div v-if="!mech.ReactorDestroyed">
      <v-divider class="my-4" />
      <div class="text-center">
        <cc-active-synergy :locations="['rest']" :mech="mech" />
      </div>
      <span v-if="!mech.Destroyed && !mech.ReactorDestroyed" class="overline">
        ИНТЕРФЕЙС ПОЛЕВОГО РЕМОНТА
        <v-btn small right icon class="fadeSelect" @click="showRepair = !showRepair">
          <v-icon small v-html="showRepair ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
        </v-btn>
      </span>
      <v-container
        v-if="!mech.Destroyed && !mech.ReactorDestroyed && showRepair"
        class="panel clipped mb-6 mt-n1"
      >
        <v-row dense class="px-3">
          <v-col v-if="$vuetify.breakpoint.mdAndUp">
            <p class="caption flavor-text subtle--text pb-0 mb-0">
              //[COMP/CON: БОЕВЫЕ ОПЕРАЦИИ ЗАВЕРШЕНЫ
              <br />
              ОТКЛЮЧЕНИЕ СЕНСОРИУМА ПИЛОТА ... успешно
              <br />
              ОТПРАВКА БОЕВОЙ ТЕЛЕМЕТРИИ ... успешно
              <br />
              ПРОВЕДЕНИЕ КОМПЛЕКТА ДИАГНОСТИКИ РАМЫ ... успешно ]
              <br />
              <span class="overline stark--text">
                ДИАГНОСТИКА {{ mech.Frame.Source }} {{ mech.Frame.Name }} ЗАВЕРШЕНА
              </span>
            </p>
            <p class="flavor-text subtle--text mb-0">
              >//[
              <span class="accent--text">COMP/CON</span>
              <span class="text--text">
                Улан, замечен{{ issues === 0 ? 'о' : ( issues === 1 ? 'а' : 'ы' ) }}
                <b class="accent--text">{{ issues }}</b>
                проблем{{ issues === 0 ? '' : ( issues === 1 ? 'а' : 'ы' ) }}, требующ{{ issues === 0 ? 'их' : ( issues === 1 ? 'ая' : 'ие' ) }} вашего внимания:
              </span>
              ]
            </p>
          </v-col>
          <v-col>
            <div class="text-center mb-1">
              <span class="heading h3">
                ОСТАВШИЕСЯ РЕМОНТЫ:
                <b class="accent--text heading h2">{{ mech.CurrentRepairs }}</b>
              </span>
              <br />
              <span>
                <v-icon v-for="n in mech.CurrentRepairs" :key="'rep_' + n" large>cci-repair</v-icon>
                <v-icon
                  v-for="n in mech.RepairCapacity - mech.CurrentRepairs"
                  :key="'repcap_' + n"
                  large
                  color="grey"
                  style="opacity: 0.4"
                >
                  mdi-hexagon-outline
                </v-icon>
              </span>
            </div>
            <div>
              <span class="overline">
                <cc-slashes />
                {{ mech.Frame.Source }} {{ mech.Frame.Name }} "{{ mech.Name }}"
              </span>
              <v-progress-linear
                class="pa-0 mt-0 mb-2"
                :value="progress"
                color="blue darken-3"
                background-color="red darken-4"
                height="10"
              />
            </div>
          </v-col>
        </v-row>

        <v-row dense class="px-3">
          <v-col class="text-center flavor-text background">
            <span v-if="mech.CurrentHP === mech.MaxHP" class="stark--text">
              > УРОН НЕ ОБНАРУЖЕН
            </span>
            <b v-else class="warning--text">ПРЕДУПРЕЖДЕНИЕ: ОБНАРУЖЕН УРОН</b>
            <br />
            <v-btn
              v-if="mech.CurrentHP !== mech.MaxHP"
              small
              dark
              tile
              outlined
              color="secondary"
              :disabled="!mech.CurrentRepairs"
              @click="pilot.State.RepairHP()"
            >
              Ремонт
              <v-icon right>control_point</v-icon>
            </v-btn>
          </v-col>

          <v-col class="text-center flavor-text background">
            <span v-if="mech.CurrentStructure === mech.MaxStructure" class="stark--text">
              > СТРУКТУРНАЯ ЦЕЛОСТНОСТЬ В НОРМЕ
            </span>
            <b v-else class="error--text">КРИТИЧЕСКОЕ: СТРУКТУРА НАРУШЕНА</b>
            <br />
            <v-btn
              v-if="mech.CurrentStructure !== mech.MaxStructure"
              small
              dark
              tile
              outlined
              color="secondary"
              :disabled="cheapStruct ? !mech.CurrentRepairs : mech.CurrentRepairs < 2"
              @click="pilot.State.RepairStructure()"
            >
              Ремонт
              <v-icon right>control_point</v-icon>
              <v-icon v-if="!cheapStruct" right>control_point</v-icon>
            </v-btn>
          </v-col>

          <v-col class="text-center flavor-text background">
            <span v-if="mech.CurrentStress === mech.MaxStress" class="stark--text">
              > РЕАКТОРНАЯ ЦЕЛОСТНОСТЬ В НОРМЕ
            </span>
            <b v-else class="error--text">КРИТИЧЕСКОЕ: ЦЕЛОСТНОСТЬ РЕАКТОРА НАРУШЕНА</b>
            <br />
            <v-btn
              v-if="mech.CurrentStress !== mech.MaxStress"
              small
              dark
              tile
              outlined
              color="secondary"
              :disabled="cheapStress ? !mech.CurrentRepairs : mech.CurrentRepairs < 2"
              @click="pilot.State.RepairStress()"
            >
              Ремонт
              <v-icon v-if="!cheapStress" right>control_point</v-icon>
              <v-icon right>control_point</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="px-5">
          <v-col class="text-center flavor-text background">
            <span v-if="!destroyedWeapons.length" class="stark--text">> ВООРУЖЕНИЕ В НОРМЕ</span>
            <b v-else class="warning--text">ПРЕДУПРЕЖДЕНИЕ: ВООРУЖЕНИЕ ПОВРЕЖДЕНО</b>
            <br />
            <v-btn
              v-for="w in destroyedWeapons"
              :key="w.ID"
              small
              dark
              tile
              outlined
              color="secondary"
              class="my-0"
              :disabled="!mech.CurrentRepairs"
              @click="pilot.State.RepairSystem(w)"
            >
              Ремонтировать {{ w.Name }}
              <v-icon right>control_point</v-icon>
            </v-btn>
          </v-col>

          <v-col class="text-center flavor-text background">
            <span v-if="!destroyedSystems.length" class="stark--text">> СИСТЕМЫ В НОРМЕ</span>
            <b v-else class="warning--text">ПРЕДУПРЕЖДЕНИЕ: СИСТЕМЫ ПОВРЕЖДЕНЫ</b>
            <br />
            <v-btn
              v-for="s in destroyedSystems"
              :key="s.ID"
              small
              dark
              tile
              outlined
              class="my-0"
              color="secondary"
              :disabled="!mech.CurrentRepairs"
              @click="pilot.State.RepairSystem(s)"
            >
              Ремонтировать {{ s.Name }}
              <v-icon right>control_point</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <div class="mt-2">
        <v-row dense align="center" justify="space-between" class="mt-n3 mx-4">
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentStructure"
              :current="mech.CurrentStructure"
              :max="mech.MaxStructure"
              large
              :number-only="$vuetify.breakpoint.smAndDown"
              :no-input="$vuetify.breakpoint.smAndDown"
              :show-buttons="$vuetify.breakpoint.smAndDown"
              color="structure"
              full-icon="cci-structure"
              @update="mech.CurrentStructure = $event"
            >
              <span class="heading h3">Структура</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentStress"
              :current="mech.CurrentStress"
              :max="mech.MaxStress"
              large
              :number-only="$vuetify.breakpoint.smAndDown"
              :no-input="$vuetify.breakpoint.smAndDown"
              :show-buttons="$vuetify.breakpoint.smAndDown"
              color="stress"
              full-icon="cci-reactor"
              @update="mech.CurrentStress = $event"
            >
              <span class="heading h3">Нагрузка</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentHP"
              :current="mech.CurrentHP"
              :max="mech.MaxHP"
              large
              :number-only="$vuetify.breakpoint.smAndDown"
              :no-input="$vuetify.breakpoint.smAndDown"
              :show-buttons="$vuetify.breakpoint.smAndDown"
              color="hp"
              full-icon="mdi-hexagon"
              max-length="25"
              @update="mech.CurrentHP = $event"
            >
              <span class="heading h3">ПЗ</span>
            </cc-tick-bar>
          </v-col>
          <v-col cols="auto">
            <cc-tick-bar
              :key="mech.CurrentRepairs"
              :current="mech.CurrentRepairs"
              :max="mech.RepairCapacity"
              large
              :number-only="$vuetify.breakpoint.smAndDown"
              :no-input="$vuetify.breakpoint.smAndDown"
              :show-buttons="$vuetify.breakpoint.smAndDown"
              color="repcap"
              full-icon="cci-repair"
              @update="mech.CurrentRepairs = $event"
            >
              <span v-if="$vuetify.breakpoint.mdAndUp" class="heading h3">ЛИМИТ РЕМОНТА</span>
              <span v-else class="heading h3">ЛИМ. РЕМ.</span>
            </cc-tick-bar>
          </v-col>
        </v-row>
      </div>

      <active-mode-loadout :mech="mech" rest />

      <div v-show="pilot.State.IsMounted">
        <v-divider class="my-5" />
        <div :style="pilot.IsDead || pilot.IsDownAndOut ? 'opacity: 0.5' : ''">
          <span class="overline">ВЫГРУЗКА ПИЛОТА</span>
          <cc-pilot-loadout :pilot="pilot" readonly />

          <v-row dense>
            <v-col cols="auto">
              <span class="overline">ТРИГГЕРЫ</span>
            </v-col>
            <v-col cols="12" md="auto" class="ml-auto">
              <v-btn
                x-small
                outlined
                class="fadeSelect"
                @click="expandAll(pilot.SkillsController.Skills.length, 'sk_', true)"
              >
                <v-icon small left>mdi-chevron-up</v-icon>
                Все
              </v-btn>
              <v-btn
                x-small
                outlined
                class="fadeSelect"
                @click="expandAll(pilot.SkillsController.Skills.length, 'sk_', false)"
              >
                <v-icon small left>mdi-chevron-down</v-icon>
                Все
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense justify="center">
            <cc-active-card
              v-for="(s, i) in pilot.SkillsController.Skills"
              :key="`sk_${i}`"
              :ref="`sk_${i}`"
              :cols="$vuetify.breakpoint.lgAndUp ? 4 : $vuetify.breakpoint.smAndDown ? 12 : 6"
              color="secondary"
              collapsible
              start-closed
              :header="`${s.Skill.Name} (+${s.Bonus})`"
              :content="s.Skill.Detail"
            />
          </v-row>
        </div>

        <span
          v-if="pilot.ReservesController.Reserves || pilot.ReservesController.Organizations"
          class="overline"
        >
          РЕЗЕРВЫ И РЕСУРСЫ
          <v-btn small right icon class="fadeSelect" @click="showReserves = !showReserves">
            <v-icon small v-html="showReserves ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
          </v-btn>
        </span>
        <v-scroll-y-reverse-transition mode="out-in">
          <v-row
            v-if="
              showReserves &&
              (pilot.ReservesController.Reserves || pilot.ReservesController.Organizations)
            "
            class="mt-n3"
          >
            <cc-reserve-item
              v-for="(r, i) in pilot.ReservesController.Reserves.filter(r => r.Type !== 'Бонус')"
              :key="`r_${i}`"
              :reserve="r"
              @remove="pilot.ReservesController.RemoveReserve(i)"
            />
            <cc-org-item
              v-for="(o, i) in pilot.ReservesController.Organizations"
              :key="`o_${i}`"
              :org="o"
              @remove="pilot.ReservesController.RemoveOrganization(i)"
            />
          </v-row>
        </v-scroll-y-reverse-transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'
import ActiveModeLoadout from '../layout/ActiveModeLoadout.vue'

function normalize(current, max): number {
  if (!max) return 1
  return current / max
}

export default vueMixins(activePilot).extend({
  name: 'active-rest',
  components: { ActiveModeLoadout },
  data: () => ({
    rest: false,
    diagNumber: 0,
    selfRepair: 0,
    allyRepair: 0,
    showRepair: true,
    showReserves: true,
  }),
  computed: {
    mech() {
      return this.pilot.ActiveMech
    },
    loadout() {
      return this.mech.MechLoadoutController.ActiveLoadout
    },
    destroyedWeapons() {
      return this.loadout.Weapons.filter(x => x.Destroyed)
    },
    destroyedSystems() {
      return this.loadout.Systems.filter(x => x.Destroyed)
    },
    cheapStruct() {
      return this.mech.FeatureController.Bonuses.some(x => x.ID === 'cheap_struct')
    },
    cheapStress() {
      return this.mech.FeatureController.Bonuses.some(x => x.ID === 'cheap_stress')
    },
    issues() {
      return (
        (this.mech.CurrentHP === this.mech.MaxHP ? 0 : 1) +
        (this.mech.CurrentStructure === this.mech.MaxStructure ? 0 : 1) +
        (this.mech.CurrentStress === this.mech.MaxStress ? 0 : 1) +
        this.destroyedWeapons.length +
        this.destroyedSystems.length
      )
    },
    progress(): number {
      return (
        ((normalize(this.mech.CurrentHP, this.mech.MaxHP) +
          normalize(
            this.loadout.Weapons.length - this.destroyedWeapons.length,
            this.loadout.Weapons.length
          ) *
            3 +
          normalize(
            this.loadout.Systems.length - this.destroyedSystems.length,
            this.loadout.Systems.length
          ) *
            3 +
          normalize(this.mech.CurrentStructure, this.mech.MaxStructure) * 10 +
          normalize(this.mech.CurrentStress, this.mech.MaxStress) * 8) /
          24) *
        100
      )
    },
  },
  methods: {
    expandAll(len: number, key: string, expand: boolean) {
      for (let i = 0; i < len; i++) {
        const k = key + i
        this.$refs[k][0].collapsed = expand
      }
    },
  },
})
</script>
