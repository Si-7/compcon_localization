<template>
  <span>
    <v-menu offset-x left>
      <template v-slot:activator="{ on }">
        <v-icon icon dark class="fadeSelect" v-on="on">mdi-cog</v-icon>
      </template>
      <v-list dense>
        <v-list-item :disabled="item.Tier === 3" @click="upgradeTier()">
          <v-list-item-icon class="ma-0 mr-2 mt-3">
            <v-icon>mdi-arrow-up-thick</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Повысить градацию</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :disabled="item.Tier === 1" @click="downgradeTier()">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-arrow-down-thick</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Уменьшить градацию</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.cName.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Установить Пользовательское Название</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="$refs.cDesc.show()">
          <v-list-item-icon class="ma-0 mr-2 mt-2">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Установить Пользовательское Описание</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div>
          <v-divider />
          <v-list-item @click="$emit('remove-feature', $event)">
            <v-list-item-icon class="ma-0 mr-2 mt-2">
              <v-icon color="error">mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Убрать {{ item.Feature.FeatureType }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
    <cc-string-edit-dialog
      ref="cName"
      :placeholder="item.Name"
      label="Пользовательское Название объекта"
      @save="save('Name', $event)"
      @reset="save('Name', '')"
    />
    <cc-string-edit-dialog
      ref="cDesc"
      :placeholder="item.Description"
      label="Пользовательское Описание объекта"
      @save="save('Description', $event)"
      @reset="save('Description', '')"
    />
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'npc-item-menu',
  props: {
    item: { type: Object, required: true },
  },
  methods: {
    upgradeTier() {
      this.item.Tier++
      this.$emit('recalc')
    },
    downgradeTier() {
      this.item.Tier--
      this.$emit('recalc')
    },
    save(prop, newName) {
      this.$set(this.item, prop, newName)
    },
  },
})
</script>
