<template>
  <div>
    <v-row v-if="state.SelfDestructCounter > 0" dense justify="center" class="text-center">
      <v-col cols="auto">
        <v-alert dense outlined color="error" prominent>
          <v-icon slot="prepend" color="error" size="90" class="mr-3">
            cci-reactor
          </v-icon>
          <span v-if="state.SelfDestructCounter > 1" class="heading h1 pt-2">
            САМОУНИЧТОЖЕНИЕ ЧЕРЕЗ {{ state.SelfDestructCounter }} РАУНДА
          </span>
          <span v-else class="heading h1">САМОУНИЧТОЖЕНИЕ НЕИЗБЕЖНО</span>
          <div class="heading subtle--text">
            ПРИОРИТЕТНАЯ.ТРЕВОГА.РАМЫ::КРИТИЧЕСКОЕ СОБЫТИЕ РЕАКТОРА
          </div>
          <div class="px-5 my-1">
            <v-btn small block color="error" @click="selfDestruct()">
              <v-icon left>mdi-skull</v-icon>
              ДЕТОНИРОВАТЬ РЕАКТОР
              <v-icon right>mdi-skull</v-icon>
            </v-btn>
          </div>
        </v-alert>
        <div class="text-right mt-1">
          <v-btn x-small color="primary" class="fadeSelect" @click="reset()">
            <v-icon small left>mdi-reload</v-icon>
            ОТМЕНИТЬ
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <div v-else>
      <div class="marquee">
        <span v-html="'ПРЕДУПРЕЖДЕНИЕ // '.repeat(400)" />
      </div>
      <div class="text-center mx-12">
        <div class="body-text stark--text">
          <b>
            ПОДТВЕРЖДЕНИЕ ЭТОГО ДЕЙСТВИЯ ИНИЦИИРУЕТ СОБЫТИЕ ПОВЫШЕНИЯ КРИТИЧЕСТВА, КОТОРОЕ 
            <u>ПРИВЕДЕТ</u> К КАТАСТРОФИЧНОМУ ОТКАЗУ РЕАКТОРА И ВЗРЫВНОМУ РАСПЛАВЛЕНИЮ.
          </b>
        </div>
        <div class="flavor-text">
          Вероятность выживания находящихся внутри (monte_carlo//cc-n2@latest):
          <b class="error--text">0.000%</b>
        </div>
      </div>

      <div class="marquee">
        <span v-html="'ПРЕДУПРЕЖДЕНИЕ // '.repeat(400)" />
      </div>

      <v-card-text class="pt-3">
        <v-row justify="center" align="center">
          <v-col>
            <action-detail-expander :action="action" />
          </v-col>
          <v-col cols="auto">
            <v-btn
              large
              tile
              block
              dark
              :disabled="actionFree"
              :color="`${action.Color} ${actionCost ? 'lighten-1' : ''}`"
              @click="actionCost = select(actionCost)"
            >
              <v-icon left>{{ action.Icon }}</v-icon>
              {{ action.Name }}
            </v-btn>
            <v-btn
              v-if="action.Activation !== 'Free'"
              small
              tile
              block
              dark
              :disabled="actionCost"
              :color="`action--free ${actionFree ? 'lighten-1' : ''}`"
              @click="actionFree = select(actionFree)"
            >
              <v-icon left small>cci-free-action</v-icon>
              Свободное Действие
              <cc-tooltip
                inline
                :content="
                  `Специальные правила или снаряжение могут позволить использовать ${action.Name} свободным действием. Нажатие на эту кнопку совершит действие, не используя ${action.Activation} действие`
                "
              >
                <v-icon right small class="fadeSelect">mdi-information-outline</v-icon>
              </cc-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-slide-x-reverse-transition>
        <v-card-text v-if="actionCost || actionFree">
          <p class="flavor-text stark--text ma-0 text-center">
            <span>
              >//[
              <span class="accent--text">
                COMP/CON:
              </span>
              ] :
              <span>ТРЕБУЕТСЯ РУЧНОЕ ПЕРЕОПРЕДЕЛЕНИЕ</span>
            </span>
          </p>
          <v-row justify="space-around">
            <v-col cols="auto">
              <v-btn
                large
                tile
                block
                :color="or1 ? 'error' : 'primary'"
                @click="or1 = true"
                v-html="
                  or1 ? 'ПРОТОКОЛЫ БЕЗОПАСНОСТИ РЕАКТОРА ОТКЛЮЧЕНЫ' : 'ОТКЛЮЧИТЬ ПРОТОКОЛЫ БЕЗОПАСНОСТИ РЕАКТОРА'
                "
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                large
                tile
                block
                :disabled="!or1"
                :color="or2 ? 'error' : 'primary'"
                @click="or2 = true"
                v-html="or2 ? 'АВАРИЙНЫЕ ВЕНТИЛЯЦИИ ЯДРА ЗАКРЫТЫ' : 'ЗАКРЫТЬ АВАРИЙНЫЕ ВЕНТИЛЯЦИИ ЯДРА'"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                large
                tile
                block
                :disabled="!or2"
                :color="or3 ? 'error' : 'primary'"
                @click="or3 = true"
                v-html="or3 ? 'БАЧОК ОХЛАЖДАЮЩЕЙ ЖИДКОСТИ ПУСТОЙ' : 'СЛИТЬ БАЧОК ОХЛАЖДАЮЩЕЙ ЖИДКОСТИ'"
              />
            </v-col>
          </v-row>
          <v-row dense justify="center">
            <v-col cols="10">
              <v-btn
                x-large
                block
                :disabled="!or3"
                :color="finished ? 'error' : `error darken-2`"
                @click="start()"
              >
                <v-icon style="position: absolute; left: 0" large>mdi-alert-rhombus-outline</v-icon>
                {{ finished ? 'КРИТИЧЕСКАЯ ТРЕВОГА: ПЛАВЛЕНИЕ РЕАКТОРА НЕИЗБЕЖНО' : 'ПЕРЕГРУЗИТЬ РЕАКТОР' }}
                <v-icon style="position: absolute; right: 0" large>
                  mdi-alert-rhombus-outline
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-slide-x-reverse-transition>

      <v-slide-x-reverse-transition>
        <v-row v-if="finished" no-gutters>
          <v-col cols="auto" class="ml-auto">
            <cc-tooltip content="Отменить это действие, возвращая любые действия, затраченные на него">
              <v-btn x-small color="primary" class="fadeSelect" @click="reset">
                <v-icon small left>mdi-reload</v-icon>
                ОТМЕНИТЬ
              </v-btn>
            </cc-tooltip>
          </v-col>
        </v-row>
      </v-slide-x-reverse-transition>

      <v-slide-y-reverse-transition>
        <div v-if="finished">
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" tile @click="$emit('hide')">ЗАКРЫТЬ</v-btn>
          </v-card-actions>
        </div>
      </v-slide-y-reverse-transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'

export default Vue.extend({
  name: 'self-destruct-dialog',
  components: { ActionDetailExpander },
  props: {
    synergyLocation: { type: [String, Array], required: false, default: () => [] },
    log: { type: Array, required: false, default: () => [] },
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    actionCost: false,
    actionFree: false,
    expanded: false,
    finished: false,
    or1: false,
    or2: false,
    or3: false,
  }),
  computed: {
    state() {
      return this.mech.Pilot.State
    },
  },
  methods: {
    select(action) {
      return !action
    },
    start() {
      this.finished = true
      this.state.CommitAction(this.action, this.actionFree)
    },
    reset() {
      this.state.UndoAction(this.action)
      this.init()
    },
    init() {
      this.actionCost = false
      this.actionFree = false
      this.finished = false
      this.or1 = false
      this.or2 = false
      this.or3 = false
      this.timer = 0
    },
    selfDestruct() {
      this.state.SelfDestruct()
      this.$emit('hide')
    },
  },
})
</script>

<style scoped>
.marquee {
  width: 100%;
  margin: 8px 0 8px 0px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: var(--v-panel-darken2);
  color: var(--v-warning-base);
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  display: inline-flex;
}

.marquee span {
  display: flex;
  flex-basis: 100%;
  animation: marquee 3000s linear infinite;
  animation-play-state: running;
}

@keyframes marquee {
  0% {
    transform: translate(0%, 0);
  }
  50% {
    transform: translate(-100%, 0);
  }
  50.001% {
    transform: translate(100%, 0);
  }
  100% {
    transform: translate(0%, 0);
  }
}
</style>
