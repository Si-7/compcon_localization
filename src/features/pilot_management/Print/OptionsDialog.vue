<template>
  <cc-solo-dialog
    ref="dialog"
    icon="mdi-printer"
    large
    title="Опции печати"
    @confirm="$emit('set', options)"
  >
    <v-card-text class="flavor-text">
      <v-card flat tile>
        <fieldset>
          <legend class="clipped-small heading h3">Общие настройки печати&emsp;</legend>
          <print-option-select mandatory title="Разметка" :items="layoutOptions" />
          <print-option-select mandatory title="Размер Шрифта" :items="fontSizeOptions" />
          <print-option-select
            mandatory
            title="Распечатать отслеживаемые статы как:"
            :items="trackableStatOptions"
          />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text--text">Функционал В Разработке</span>
        </v-overlay>
      </v-card>
      <v-card flat tile>
        <fieldset>
          <legend class="clipped-small heading h3">Настройки листа пилота&emsp;</legend>
          <print-option-select multiple title="Включить" :items="pilotIncludeOptions" />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text--text">Функционал В Разработке</span>
        </v-overlay>
      </v-card>
      <v-scroll-y-transition>
        <v-card flat tile>
          <fieldset>
            <legend class="clipped-small heading h3">Настройки листа меха&emsp;</legend>
            <print-option-select multiple title="Включить" :items="mechIncludeOptions" />
          </fieldset>
          <v-overlay absolute :value="true" color="panel" opacity="0.85">
            <span class="heading h2 text--text">Функционал В Разработке</span>
          </v-overlay>
        </v-card>
      </v-scroll-y-transition>
      <v-card flat tile>
        <fieldset>
          <legend>Дополнительно</legend>
          <print-option-select multiple title="Также распечатать" :items="extraOptions" />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text--text">Функционал В Разработке</span>
        </v-overlay>
      </v-card>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import PrintOptionSelect from './PrintOptionSelect.vue'

export default Vue.extend({
  name: 'print-options-dialog',
  components: { PrintOptionSelect },
  data: () => ({
    options: null,
    layoutOptions: [
      { text: 'Graphic/Portrait', icon: 'mdi-file' },
      { text: 'Graphic/Landscape', icon: 'mdi-note' },
      { text: 'Text-Only/Portrait', icon: 'mdi-file-document-outline' },
      { text: 'Text-Only/Landscape', icon: 'mdi-file-document-outline-outline' },
    ],
    fontSizeOptions: [
      { text: 'Small', icon: 'mdi-format-font-size-decrease' },
      { text: 'Regular', icon: 'mdi-format-text-variant' },
      { text: 'Large', icon: 'mdi-format-font-size-increase' },
    ],
    trackableStatOptions: [
      { text: 'Numbers', icon: 'mdi-numeric' },
      { text: 'Pips', icon: 'mdi-checkbox-multiple-marked-outline' },
    ],
    pilotIncludeOptions: [
      { text: 'Pilot Portrait' },
      { text: 'Appearance Notes' },
      { text: 'Extended Info' },
      { text: 'Pilot Biography' },
      { text: 'Item Notes' },
      { text: 'Pilot Notes' },
      { text: 'Portrait Sketch Panel' },
      { text: 'Blank Lined Panel' },
      { text: 'Blank Unlined Panel' },
      { text: 'Extra Equipment Space' },
      { text: 'Blank Panel: Top' },
      { text: 'Blank Panel: Middle' },
      { text: 'Blank Panel: Bottom' },
      { text: 'Append Unlined Section' },
      { text: 'Append Lined Section' },
    ],
    mechIncludeOptions: [
      { text: 'Mech Image' },
      { text: 'Mech Notes' },
      { text: 'Item Notes' },
      { text: 'Extra Mount Panel' },
      { text: 'Extra System Space' },
      { text: 'Sketch Panel' },
      { text: 'Blank Lined Panel' },
      { text: 'Blank Unlined Panel' },
      { text: 'Append Unlined Section' },
      { text: 'Append Lined Section' },
    ],
    extraOptions: [
      { text: 'Relevant Tag Info' },
      { text: 'Combat Quick Reference' },
      { text: 'Downtime Quick Reference' },
    ],
  }),
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
  },
})
</script>

<style scoped>
fieldset {
  border-color: var(--v-primary-base);
  border-radius: 2px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  background-color: var(--v-primary-base);
  color: #fff;
  padding: 3px 6px;
}
</style>
