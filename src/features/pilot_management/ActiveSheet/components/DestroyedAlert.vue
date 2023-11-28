<template>
  <v-alert v-if="mech.Destroyed" prominent dense color="error" outlined class="text-center">
    <v-icon slot="prepend" color="error" size="70" class="mr-3">
      {{ mech.ReactorDestroyed ? 'mdi-nuke' : 'cci-eclipse' }}
    </v-icon>
    <span class="heading h1">
      МЕХ УНИЧТОЖЕН
      <span v-if="mech.ReactorDestroyed">
        <cc-slashes />
        РЕАКТОР УНИЧТОЖЕН
      </span>
    </span>
    <div class="heading mt-n4 subtle--text">
      {{
        mech.ReactorDestroyed
          ? 'ОШИБКА ОШИБКА ОШИБКА ОШИБКА ОШИБКА ОШИБКА ОШИБКА'
          : 'РАМА.КРИТИЧЕСКОЕ//: КАТАСТРОФИЧЕСКИЙ УРОН'
      }}
    </div>
    <div class="flavor-text text--text">
      Текущий активный мех ({{ mech.Name }}
      <cc-slashes />
      {{ mech.Frame.Source }} {{ mech.Frame.Name }}) был уничтожен.
      <span v-if="!mech.ReactorDestroyed"></span>
      <span v-if="mech.ReactorDestroyed">
        Реактор вышел из строя, и каркас не подлежит восстановлению. Этот мех необходимо распечатать заново.
      </span>
    </div>
    <div style="position: relative">
      <cc-tooltip
        v-if="!mech.ReactorDestroyed"
        content="Определенные действия и оборудование позволяют выполнять ремонт на поле боя. Нажав здесь, вы восстановите для своего меха 1 очко Структуры и 1 ПЗ."
      >
        <v-btn x-small color="primary" class="fadeSelect" @click="restore(false)">
          <v-icon small left>cci-repair</v-icon>
          РЕМОНТИРОВАТЬ
        </v-btn>
      </cc-tooltip>
      <cc-tooltip
        v-else-if="mech.ReactorDestroyed"
        content="Отмените это состояние и восстановите для своего меха 1 очко Структуры и 1 ПЗ."
      >
        <v-btn x-small color="primary" class="fadeSelect" @click="restore(true)">
          <v-icon small left>mdi-reload</v-icon>
          ОТМЕНИТЬ
        </v-btn>
      </cc-tooltip>
    </div>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'destroyed-alert',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  methods: {
    restore(restoreReactor: boolean): void {
      this.mech.Pilot.State.CancelSelfDestruct()
      this.$emit('restore', restoreReactor)
    }
  }
})
</script>
