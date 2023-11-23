<template>
  <v-alert outlined dense color="primary" class="pb-0 ma-1">
    <div class="text--text">
      <v-row no-gutters>
        <v-col cols="auto">
          <v-icon left large color="stark" class="mt-n2">cci-drone</v-icon>
          <span class="heading h2">{{ deployable.name }}</span>
          <span v-if="deployable.type" class="heading h3 subtle--text">
            <cc-slashes />
            {{ deployable.type }}
          </span>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-chip slot="title-items" color="stark" small class="stat-text mr-2 pr-0" outlined label>
            РАЗВЕРНУТЬ&nbsp;
            <v-chip small label dark :color="`${color}`" class="text-uppercase">
              {{ activation }}
            </v-chip>
          </v-chip>
        </v-col>
      </v-row>
      <deployable-info-base :deployable="deployable" class="mt-n6 mb-n2" />
    </div>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
import deployableInfoBase from './_deployableInfoBase.vue'
import { ActivationType } from '@/class'

export default Vue.extend({
  name: 'deployable-info-panel',
  components: { deployableInfoBase },
  props: {
    deployable: {
      type: Object,
      required: true,
    },
  },
  computed: {
    activation() {
      return this.deployable.activation ? <ActivationType>this.deployable.activation : ActivationType.Quick
    },
    color() {
      return `action--${Object.keys(ActivationType).find(key => ActivationType[key] === (this.deployable.activation ? <ActivationType>this.deployable.activation : ActivationType.Quick)).toLowerCase()}`
    }
  },
})
</script>
