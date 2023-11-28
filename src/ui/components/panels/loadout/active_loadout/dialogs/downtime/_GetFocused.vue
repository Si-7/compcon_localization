<template>
  <div>
    <v-card-text>
      <p
        class="text-center body-text"
        v-html="
          'Вы концентрируетесь на повышении собственных навыков, обучении и самосовершенствовании. Вы можете практиковаться, учиться, медитировать или обратиться к учителю.'
        "
      />
      <v-divider class="ma-2" />
      <v-alert
        color="secondary"
        prominent
        icon="mdi-information-outline"
        dense
        outlined
        border="left"
      >
        Выполнение этого действия во время отдыха добавит предмет «Сосредоточиться» к резервам отдыха этого пилота. Каждый 
        резерв «Сосредоточиться» добавляет бонусный выбор триггера, который можно сделать на 
        <b class="accent--text">экране выбора триггера в листе пилота.</b>
      </v-alert>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">отменить</v-btn>
      <v-spacer />
      <v-btn large tile color="primary" @click="addSkill()">
        {{ tabs === 0 ? 'Добавить триггер' : 'Улучшить триггер' }}
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'

export default Vue.extend({
  name: 'get-focused',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addSkill() {
      this.pilot.ReservesController.AddReserve(
        new Reserve({
          id: 'reserve_skillfocus',
          type: 'Бонус',
          name: 'Сосредоточение на триггере',
          description: 'Добавлено через действие режима отдыха "Сосредоточиться"',
          bonuses: [
            {
              id: 'skill_point',
              val: 1,
            },
          ],
          resource_name: 'Сосредоточение на триггере',
          resource_cost: '',
          resource_note: '',
          used: false,
          consumable: false,
        })
      )
      this.close()
    },
    close() {
      this.$emit('close')
    },
  },
})
</script>
