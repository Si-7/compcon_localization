<template>
  <v-col cols="12" lg="6">
    <v-card flat tile class="clipped-large light-panel pb-2">
      <v-toolbar dense flat>
        <v-toolbar-title>
          <v-row no-gutters>
            <v-col cols="auto">
              <v-icon v-if="$vuetify.breakpoint.mdAndUp" left>{{ deployable.Icon }}</v-icon>
            </v-col>
            <v-col
              :class="$vuetify.breakpoint.mdAndUp ? 'heading h3' : 'body-text font-weight-bold'"
            >
              <cc-short-string-editor inline @set="deployable.Name = $event">
                {{ deployable.Name }}
              </cc-short-string-editor>
            </v-col>
            <v-col v-if="$vuetify.breakpoint.mdAndUp">
              <span class="pl-3 flavor-text subtle--text">//{{ deployable.BaseName }}</span>
            </v-col>
          </v-row>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            v-if="deployable.Recall && !recallState"
            small
            text
            color="accent"
            class="fadeSelect"
            :disabled="!canRecall"
            @click="recall"
          >
            <v-icon v-if="recallIcon" left>{{ recallIcon }}</v-icon>
            Отозвать
          </v-btn>
          <v-btn
            v-if="deployable.Redeploy && recallState"
            small
            text
            color="accent"
            class="fadeSelect"
            :disabled="!canRedeploy"
            @click="redeploy"
          >
            <v-icon v-if="redeployIcon" left>{{ redeployIcon }}</v-icon>
            Разместить заново
          </v-btn>
          <v-menu v-model="removeMenu" offset-y offset-x top left>
            <template v-slot:activator="{ on }">
              <v-btn small text color="error" class="fadeSelect" v-on="on">Убрать</v-btn>
            </template>
            <cc-confirmation
              content="Улан, это уберет размещаемый объект из списка. <span class='accent--text'>Это не может быть отменено.</span> Вы хотите продолжить?"
              @confirm="
                removeMenu = false
                pilot.State.RemoveDeployable(deployable.ID)
              "
            />
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text v-if="deployable.Destroyed">
        <div class="heading h3 error--text text-center">СНАРЯЖЕНИЕ УНИЧТОЖЕНО</div>
        <div class="text-right mr-3 mb-n3">
          <v-btn x-small color="primary" class="fadeSelect" @click="deployable.Repair()">
            <cc-tooltip
              content="Востановите этот размещаемый объект до рабочего состояния. Это не требует действия и должно использоваться для исправления ошибки или в особых случаях, например, по распоряжению ГМа."
            >
              <v-icon small left>mdi-reload</v-icon>
              ВОССТАНОВИТЬ
            </cc-tooltip>
          </v-btn>
        </div>
      </v-card-text>
      <v-card-text v-else-if="recallState">
        <div class="heading h3 subtle--text text-center">СНАРЯЖЕНИЕ ОТОЗВАНО</div>
        <div class="text-right mr-3 mb-n3">
          <v-btn x-small color="primary" class="fadeSelect" @click="freeRecall()">
            <cc-tooltip
              content="Верните этот размещаемый объект на поле боя. Это не требует действия и должно использоваться для исправления ошибки или в особых случаях, например, по распоряжению ГМа."
            >
              <v-icon small left>mdi-reload</v-icon>
              ВОССТАНОВИТЬ
            </cc-tooltip>
          </v-btn>
        </div>
      </v-card-text>

      <v-card-text v-else class="py-1">
        <v-row dense>
          <v-col v-if="deployable.Armor" cols="12" md="auto">
            <cc-tick-bar
              :key="deployable.Armor"
              :current="deployable.Armor"
              :max="deployable.Armor"
              color="armor"
              full-icon="mdi-shield"
              hide-max
              readonly
            >
              <span class="heading">Броня: {{ deployable.Armor }}</span>
            </cc-tick-bar>
          </v-col>
          <v-col v-if="deployable.MaxHP" cols="12" md="auto">
            <cc-tick-bar
              :key="deployable.CurrentHP"
              :current="deployable.CurrentHP"
              :max="deployable.MaxHP"
              color="hp"
              full-icon="mdi-hexagon"
              :max-length="15"
              @update="deployable.CurrentHP = $event"
            >
              <span class="heading">ПЗ</span>
            </cc-tick-bar>
          </v-col>
          <v-col v-if="deployable.MaxHP" cols="12" md="auto">
            <cc-tick-bar
              :key="deployable.Overshield"
              :current="deployable.Overshield"
              :max="deployable.Overshield"
              color="stark"
              :full-icon="'mdi-octagram'"
              max-length="3"
              hide-max
              @update="deployable.Overshield = $event"
            >
              <span class="heading">УСИЛЕНИЕ ЩИТА: {{ deployable.Overshield }}</span>
            </cc-tick-bar>
          </v-col>
          <v-col v-if="deployable.Heatcap" cols="12" md="auto">
            <cc-tick-bar
              :key="deployable.CurrentHeat"
              :current="deployable.CurrentHeat"
              :max="deployable.Heatcap"
              color="heatcap"
              full-icon="mdi-circle"
              clearable
              @update="deployable.CurrentHeat = $event"
            >
              <span class="heading">НАГРЕВ</span>
            </cc-tick-bar>
          </v-col>
          <v-col v-if="deployable.Repcap" cols="12" md="auto">
            <cc-tick-bar
              :key="deployable.CurrentRepairs"
              :current="deployable.CurrentRepairs"
              :max="deployable.Repcap"
              color="repcap"
              full-icon="cci-repair"
              @update="deployable.CurrentRepairs = $event"
            >
              <span class="heading">ЛИМИТ РЕМОНТА</span>
            </cc-tick-bar>
          </v-col>
        </v-row>
        <v-row justify="center" dense :class="$vuetify.breakpoint.smAndDown ? '' : 'mx-8'">
          <cc-statblock-panel
            v-if="deployable.Size"
            inline
            class="mx-1"
            :icon="
              $vuetify.breakpoint.smAndDown
                ? ''
                : `cci-size-${deployable.Size === 0.5 ? 'half' : deployable.Size}`
            "
            name="Размер"
            :value="`${deployable.Size === 0.5 ? '½' : deployable.Size}`"
            :cols="$vuetify.breakpoint.smAndDown ? 'auto' : ''"
          />
          <cc-statblock-panel
            v-if="deployable.Size"
            :icon="$vuetify.breakpoint.smAndDown ? '' : '$vuetify.icons.evasion'"
            inline
            class="mx-1"
            name="Уклонение"
            :value="deployable.Evasion"
            :cols="$vuetify.breakpoint.smAndDown ? 'auto' : ''"
          />
          <cc-statblock-panel
            v-if="deployable.EDefense"
            inline
            class="mx-1"
            :icon="$vuetify.breakpoint.smAndDown ? '' : '$vuetify.icons.edef'"
            name="Э-Защита"
            :value="deployable.EDefense"
            :cols="$vuetify.breakpoint.smAndDown ? 'auto' : ''"
          />
          <cc-statblock-panel
            v-if="deployable.Heatcap"
            inline
            class="mx-1"
            :icon="$vuetify.breakpoint.smAndDown ? '' : '$vuetify.icons.heat'"
            name="Тепловой Максимум"
            :value="deployable.Heatcap"
            :cols="$vuetify.breakpoint.smAndDown ? 'auto' : ''"
          />
          <cc-statblock-panel
            v-if="deployable.Sensor"
            inline
            class="mx-1"
            :icon="$vuetify.breakpoint.smAndDown ? '' : '$vuetify.icons.sensor'"
            name="Сенсоры"
            :value="deployable.Sensor"
            :cols="$vuetify.breakpoint.smAndDown ? 'auto' : ''"
          />
          <cc-statblock-panel
            v-if="deployable.TechAttack"
            inline
            class="mx-1"
            :icon="$vuetify.breakpoint.smAndDown ? '' : '$vuetify.icons.tech'"
            name="Тех. Атака"
            :value="deployable.TechAttack"
            :cols="$vuetify.breakpoint.smAndDown ? 'auto' : ''"
          />
          <cc-statblock-panel
            v-if="deployable.Repcap"
            inline
            class="mx-1"
            :icon="$vuetify.breakpoint.smAndDown ? '' : '$vuetify.icons.repair'"
            name="Лимит Ремонта"
            :value="deployable.Repcap"
            :cols="$vuetify.breakpoint.smAndDown ? 'auto' : ''"
          />
          <cc-statblock-panel
            v-if="deployable.Save"
            inline
            class="mx-1"
            :icon="$vuetify.breakpoint.smAndDown ? '' : '$vuetify.icons.save'"
            name="Спасбросок Цели"
            :value="deployable.Save"
            :cols="$vuetify.breakpoint.smAndDown ? 'auto' : ''"
          />
          <cc-statblock-panel
            v-if="deployable.Speed"
            inline
            class="mx-1"
            :icon="$vuetify.breakpoint.smAndDown ? '' : '$vuetify.icons.speed'"
            name="Скорость"
            :value="deployable.Speed"
            :cols="$vuetify.breakpoint.smAndDown ? 'auto' : ''"
          />
        </v-row>
        <v-row justify="center" dense>
          <v-col cols="auto">
            <p v-html-safe="deployable.Detail" class="light-panel mb-0 clipped body-text px-4" />
          </v-col>
        </v-row>
        <v-row dense justify="center">
          <v-col
            v-for="(a, i) in deployable.Actions"
            :key="`${deployable.Name}_action_${i}`"
            cols="12"
            md="auto"
            style="min-width: 25%"
          >
            <cc-action
              :action="a"
              active
              :activations="pilot.State.Actions"
              :unusable="
                a.Used || (a.Activation === 'Протокол' && !pilot.State.IsProtocolAvailable)
              "
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { ActivationType } from '@/classes/enums'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'deployed-item',
  props: {
    deployable: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    nameFocus: false,
    recallState: false,
    removeMenu: false,
  }),
  watch: {
    isRecalled: {
      immediate: true,
      deep: true,
      handler: function (newval) {
        this.recallState = newval
      },
    },
  },
  computed: {
    isRecalled() {
      return this.deployable.IsRecalled
    },
    canRecall() {
      if (!this.deployable.Recall) return false
      let cost = 0
      if (this.deployable.Recall === ActivationType.Quick) cost = 1
      else if (this.deployable.Recall === ActivationType.Full) cost = 2
      return cost <= this.pilot.State.Actions
    },
    canRedeploy() {
      if (!this.deployable.Redeploy) return false
      let cost = 0
      if (this.deployable.Redeploy === ActivationType.Quick) cost = 1
      else if (this.deployable.Redeploy === ActivationType.Full) cost = 2
      return cost <= this.pilot.State.Actions
    },
    recallIcon() {
      if (!this.deployable.Recall) return ''
      else if (this.deployable.Recall === ActivationType.Quick) return 'mdi-hexagon-slice-3'
      else if (this.deployable.Recall === ActivationType.Full) return 'mdi-hexagon-slice-6'
      else return 'cci-free'
    },
    redeployIcon() {
      if (!this.deployable.Redeploy) return ''
      else if (this.deployable.Redeploy === ActivationType.Quick) return 'mdi-hexagon-slice-3'
      else if (this.deployable.Redeploy === ActivationType.Full) return 'mdi-hexagon-slice-6'
      else return 'cci-free'
    },
  },
  methods: {
    recall() {
      if (this.pilot.State.RecallDeployable(this.deployable)) {
        this.$nextTick().then(() => (this.deployable.IsRecalled = true))
        this.recallState = true
      }
    },
    freeRecall() {
      this.$nextTick().then(() => (this.deployable.IsRecalled = false))
      this.$nextTick().then(() => (this.recallState = false))
    },
    redeploy() {
      if (this.pilot.State.RedeployDeployable(this.deployable)) {
        this.$nextTick().then(() => (this.deployable.IsRecalled = false))
        this.recallState = false
      }
    },
  },
})
</script>
