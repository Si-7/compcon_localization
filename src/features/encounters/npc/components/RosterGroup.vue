<template>
  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-select-group</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-subheader class="heading h2 white--text primary py-0 px-2 mt-n3">
        Группировать НИП по
      </v-subheader>
      <v-list-item
        v-for="g in groups"
        :key="g.name"
        class="flavor-text"
        @click="$emit('set', g.val)"
      >
        <v-list-item-icon class="ma-0 mr-2 mt-3">
          <v-icon>{{ g.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ g.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'roster-group',
  data: () => ({
    groups: [
      { name: 'Нет', val: null, icon: 'mdi-close' },
      { name: 'Роли', val: 'Class.Role', icon: 'cci-role-striker' },
      { name: 'Классу', val: 'Class.Name', icon: 'mdi-rhombus-outline' },
      { name: 'Ярлыкам', val: 'LabelString', icon: 'mdi-label-outline' },
      { name: 'Кампании', val: 'Campaign', icon: 'mdi-map' },
      { name: 'Градации', val: 'Tier', icon: 'cci-rank-3' },
    ],
  }),
  methods: {
    flatten(val) {
      if (!val.length) return ''
      if (Array.isArray(val)) return val.join(' ,')
      return val
    },
  },
})
</script>
