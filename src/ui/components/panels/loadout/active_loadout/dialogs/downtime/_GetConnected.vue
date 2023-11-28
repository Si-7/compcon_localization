<template>
  <div>
    <v-card-text>
      <p
        class="text-center body-text"
        v-html="
          'Когда вы Налаживаете Связи, вы устанавливаете контакты, оказываете услуги, просите о помощи или заручаетесь поддержкой для выполнения какого-либо действия. <br /> Вы можете использовать ресурсы или помощь своих знакомых как <strong>Резерв</strong> для следующей миссии. <br/> Чтобы выполнить это действие, вы должны находиться в зоне действия связи или в месте, где вы можете провести старый добрый разговор лицом к лицу.'
        "
      />
      <v-divider class="mb-2" />
      <div class="pt-2 heading h3 text-center">
        Бросьте
        <v-icon large color="accent">mdi-dice-d20</v-icon>
        &nbsp;и добавьте все соответствующие бонусы Триггеров, модификаторы и Точность
      </div>
      <v-row justify="center">
        <v-col cols="3">
          <v-text-field
            v-model="skillRoll"
            type="number"
            label="Результат броска"
            outlined
            dense
            hide-details
            append-outer-icon="mdi-plus-circle-outline"
            prepend-icon="mdi-minus-circle-outline"
            @click:append-outer="skillRoll++"
            @click:prepend="skillRoll > 1 ? skillRoll-- : ''"
          />
        </v-col>
      </v-row>
      <v-slide-y-transition>
        <v-row v-show="skillRoll" dense justify="center" class="text-center flavor-text">
          <v-col cols="10">
            <p
              v-if="skillRoll < 10"
              class="font-weight-bold px-3"
              v-html="
                'Ваш собеседник поможет вам, но вы должны сделать одолжение или выполнить обещание <em>прямо сейчас</em>. Если вы этого не сделаете, он вам не поможет.'
              "
            />

            <p
              v-else-if="skillRoll < 20"
              class="font-weight-bold px-3"
              v-html="
                'Ваш контакт поможет вам, но вы должны сделать одолжение или выполнить обещание <em>после этого</em>. <br /> Если вы не выполните обещание, в следующий раз, когда вы получите этот результат для того же контакта, рассматривайте его как 9 или меньше.'
              "
            />

            <p
              v-else
              class="font-weight-bold px-3"
              v-html="
                'Ваш собеседник поможет вам без всяких условий. <br /> Отнеситесь к этому результату как к 10-19 в следующий раз, когда вы получите его для того же контакта.'
              "
            />
          </v-col>
          <v-row dense>
            <v-col>
              <v-card color="panel" class="ml-5 mr-5 mt-2">
                <v-toolbar dark dense color="action--downtime">
                  <v-toolbar-title>Контакт</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-text-field
                    v-model="custom_name"
                    label="Название контакта или организации"
                    outlined
                    dense
                    hide-details
                  />
                  <v-textarea v-model="details" auto-grow rows="1" label="Details" />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-row>
      </v-slide-y-transition>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn text @click="close()">отменить</v-btn>
      <v-spacer />
      <v-btn large tile color="primary" :disabled="!skillRoll || !custom_name" @click="addReserve">
        добавить резерв
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve } from '@/class'
export default Vue.extend({
  name: 'get-connected',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    skillRoll: '',
    custom_name: '',
    details: '',
  }),
  methods: {
    addReserve() {
      const nr = new Reserve({
        id: 'reserve_boughttime',
        type: 'Ресурс',
        name: 'Контакт',
        label: '',
        description: '',
        resource_note: this.details,
        resource_name: this.custom_name,
        resource_cost: '',
        used: false,
        consumable: true,
      })
      if (this.skillRoll < 10)
        nr.ResourceCost =
          'Вы должны сделать одолжение или выполнить обещание прямо сейчас'
      else if (this.skillRoll < 20)
        nr.ResourceCost = 'Вы должны сделать одолжение или выполнить обещание после этого'
      this.pilot.ReservesController.AddReserve(nr)
      this.close()
    },
    close() {
      this.skillRoll = ''
      this.custom_name = ''
      this.details = ''
      this.$emit('close')
    },
  },
})
</script>
