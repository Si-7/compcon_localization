<template>
  <v-footer fixed style="padding-bottom: 4px; border-top: 2px solid var(--v-primary-base)">
    <v-row no-gutters justify="space-between" align="center">
      <v-col cols="auto">
        <v-dialog v-model="ecDialog" width="80vw">
          <template v-slot:activator="{ on }">
            <v-btn
              :small="$vuetify.breakpoint.mdAndUp"
              :x-small="$vuetify.breakpoint.smAndDown"
              color="warning darken-2"
              v-on="on"
            >
              ЗАКОНЧИТЬ БОЙ
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dense dark flat tile color="warning darken-3 heading h2">
              ЗАКОНЧИТЬ БОЙ
            </v-toolbar>
            <v-card-text>
              <p class="flavor-text stark--text mt-1 mb-0 mx-6">
                >//[
                <span class="accent--text">COMP/CON</span>
                :
                <span class="stark-text--text">Необходимо подтверждение</span>
                ] Пилот, продвижение выключит боевой режим и включит протоколы отдыха и починки.
                Это не может быть отменено. Продолжить?
              </p>
              <v-row justify="center" no-gutters class="mt-n2"></v-row>
              <v-row justify="center" class="mt-2">
                <v-col cols="auto">
                  <v-btn
                    x-large
                    tile
                    color="warning darken-3"
                    @click="
                      ecDialog = false
                      state.StartRest()
                    "
                  >
                    &nbsp;Начать отдых
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col cols="auto">
        <v-row dense>
          <v-col cols="auto">
            <v-menu v-if="state.InTurn" v-model="turnConfirm" close-on-content-click offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  slot="activator"
                  :small="$vuetify.breakpoint.mdAndUp"
                  :x-small="$vuetify.breakpoint.smAndDown"
                  color="secondary"
                  dark
                  elevation="0"
                  v-on="endTurnConfirm.length ? on : stageEndTurn()"
                >
                  ЗАКОНЧИТЬ ХОД
                </v-btn>
              </template>
              <cc-confirmation no-cc :content="endTurnConfirm" @confirm="stageEndTurn()" />
            </v-menu>
            <v-btn
              v-else
              outlined
              :small="$vuetify.breakpoint.mdAndUp"
              :x-small="$vuetify.breakpoint.smAndDown"
              color="secondary"
              @click="undoEndTurn"
            >
              ОТМЕНИТЬ КОНЕЦ ХОДА
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-menu v-model="roundConfirm" close-on-content-click offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  :small="$vuetify.breakpoint.mdAndUp"
                  :x-small="$vuetify.breakpoint.smAndDown"
                  color="accent"
                  class="white--text"
                  elevation="0"
                  :disabled="state.InTurn"
                  v-on="on"
                >
                  НАЧАТЬ РАУНД {{ state.Round + 1 }}
                </v-btn>
              </template>
              <cc-confirmation no-cc :content="nextRoundConfirm" @confirm="stageNextRound()" />
            </v-menu>
          </v-col>
        </v-row>
      </v-col>

      <v-col md="auto" cols="12">
        <v-row
          no-gutters
          :class="`text-center ${$vuetify.breakpoint.smAndDown ? 'mt-1' : ''}`"
          justify="space-around"
        >
          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Протоколы" delayed>
              <action-menu-button
                :key="`protocol_btn_${state.IsProtocolAvailable}`"
                :actions="state.ActionsByType('Протокол')"
                :mech="pilot.ActiveMech"
                :available="state.IsProtocolAvailable"
                :color="state.IsProtocolAvailable ? 'action--protocol' : 'grey darken-1'"
                title="ПРОТОКОЛЫ"
                @open-menu="openMenu(0)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="40">cci-protocol</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>

          <v-col v-if="$vuetify.breakpoint.lgAndUp && !mech.Pilot.IsDownAndOut" cols="auto">
            <v-divider vertical class="mx-3" />
          </v-col>

          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Перемещение" delayed>
              <move-menu-button :mech="pilot.ActiveMech" @open-dialog="openDialog($event)" />
            </cc-tooltip>
          </v-col>
          <v-col v-if="!mech.Pilot.IsDownAndOut">
            <cc-tooltip inline content="Полные Действия" delayed>
              <action-menu-button
                :actions="state.ActionsByType('Полное')"
                :mech="pilot.ActiveMech"
                :available="state.Actions > 1"
                :color="state.Actions > 1 ? 'action--full' : 'grey darken-1'"
                title="ПОЛНЫЕ ДЕЙСТВИЯ"
                @open-menu="openMenu(1)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="30">mdi-hexagon-slice-6</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>
          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Быстрые Действия" delayed>
              <action-menu-button
                :actions="state.ActionsByType('Быстрое')"
                :mech="pilot.ActiveMech"
                :color="state.Actions > 0 ? 'action--quick' : 'grey darken-1'"
                :available="state.Actions > 0"
                title="БЫСТРЫЕ ДЕЙСТВИЯ"
                @open-menu="openMenu(2)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="30">mdi-hexagon-slice-3</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>
          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Реакции" delayed>
              <action-menu-button
                :actions="state.ActionsByType('Реакция')"
                :mech="pilot.ActiveMech"
                color="action--reaction"
                :available="!state.IsBraceCooldown"
                title="РЕАКЦИИ"
                @open-menu="openMenu(3)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="35">cci-reaction</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>
          <v-col v-if="!mech.Pilot.IsDownAndOut" cols="auto">
            <cc-tooltip inline content="Свободные Действия" delayed>
              <action-menu-button
                :actions="state.ActionsByType('Свободное')"
                :mech="pilot.ActiveMech"
                :available="!state.IsBraceCooldown"
                color="action--free"
                title="СВОБОДНЫЕ ДЕЙСТВИЯ"
                @open-menu="openMenu(4)"
                @open-dialog="openDialog($event)"
              >
                <v-icon slot="icon" color="white" size="35">cci-free-action</v-icon>
              </action-menu-button>
            </cc-tooltip>
          </v-col>

          <v-col v-if="$vuetify.breakpoint.lgAndUp && !mech.Pilot.IsDownAndOut" cols="auto">
            <v-divider vertical class="mx-3" />
          </v-col>

          <v-col cols="auto">
            <cc-tooltip inline content="Боевой Журнал" delayed>
              <v-btn
                class="mx-1"
                :small="$vuetify.breakpoint.lgAndUp"
                :x-small="$vuetify.breakpoint.smAndDown"
                dark
                :fab="$vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.smAndDown"
                elevation="0"
                color="primary"
                @click="openMenu(5)"
              >
                <v-icon color="white" size="25">mdi-notebook</v-icon>
                <span v-if="$vuetify.breakpoint.md" class="pl-2">БОЕВОЙ ЖУРНАЛ</span>
              </v-btn>
            </cc-tooltip>
          </v-col>
          <v-col>
            <cc-tooltip inline content="Прочее" delayed cols="auto">
              <v-btn
                class="mx-1"
                :small="$vuetify.breakpoint.lgAndUp"
                :x-small="$vuetify.breakpoint.smAndDown"
                dark
                :fab="$vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.smAndDown"
                elevation="0"
                color="primary"
                @click="openMenu(6)"
              >
                <v-icon color="white" size="25">mdi-dots-vertical</v-icon>
                <span v-if="$vuetify.breakpoint.md" class="pl-2">ПРОЧЕЕ</span>
              </v-btn>
            </cc-tooltip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <cc-combat-dialog
      v-for="(a, i) in state.AllActions"
      :key="`fa_${i}_${a.ID}`"
      :ref="`dialog_${a.ID}`"
      :action="a"
      :mech="pilot.ActiveMech"
      :pilot="pilot"
    />

    <cc-solo-dialog ref="actionMenu" no-confirm title="Действия" large no-title-clip>
      <action-menu :tab="menuTab" />
    </cc-solo-dialog>
    <burn-dialog ref="burnDialog" :mech="mech" @complete="endTurn($event)" />
  </v-footer>
</template>

<script lang="ts">
import ActionMenuButton from '../../components/ActionMenuButton.vue'
import MoveMenuButton from '../../components/MoveMenuButton.vue'
import ActionMenu from '../../components/ActionMenu.vue'
import BurnDialog from '../../components/BurnDialog.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'combat-footer',
  components: { MoveMenuButton, ActionMenuButton, ActionMenu, BurnDialog },
  data: () => ({
    menuTab: 1,
    ecDialog: false,
    roundConfirm: false,
    turnConfirm: false,
  }),
  computed: {
    state() {
      return this.pilot.State
    },
    mech() {
      return this.pilot.ActiveMech
    },
    nextRoundConfirm() {
      let str = ''
      if (this.state.Actions > 0) str += `<div class='px-2'>Действия доступны</div>`
      if (this.state.Move > 0) str += `<div class='px-2'>Перемещение доступно</div>`
      if (str.length) {
        str = `<div class='error--text'>ПРЕДУПРЕЖДЕНИЕ::<div>${str}`
      } else
        str =
          '<div>Подтвердите завершение раунда</div> <div class="text--secondary">Это нельзя отменить.</div>'
      return str
    },
    endTurnConfirm() {
      let str = ''
      if (this.state.Actions > 0) str += `<div class='px-2'>Действия доступны</div>`
      if (this.state.Move > 0) str += `<div class='px-2'>Перемещение доступно</div>`
      if (str.length) {
        str = `<div class='error--text'>ПРЕДУПРЕЖДЕНИЕ::<div>${str}`
      } else str = ''
      return str
    },
  },
  methods: {
    stageEndTurn() {
      if (this.mech.Burn) this.$refs.burnDialog.show()
      else this.endTurn()
    },
    stageNextRound() {
      this.nextRound()
    },
    nextRound() {
      this.state.NextRound()
      this.roundConfirm = false
    },
    endTurn(burn) {
      this.state.EndTurn(burn?.hp || 0, burn?.str || 0)
      this.turnConfirm = false
    },
    undoEndTurn() {
      this.state.UndoEndTurn()
    },
    openMenu(tab) {
      this.menuTab = tab
      this.$refs.actionMenu.show()
    },
    openDialog(action) {
      const r = this.$refs[`dialog_${action.ID}`]
      if (r && r[0]) r[0].show()
    },
  },
})
</script>
