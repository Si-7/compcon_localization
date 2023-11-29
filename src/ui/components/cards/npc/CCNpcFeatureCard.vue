<template>
  <component :is="component" v-if="component" :item="item" readonly />
</template>

<script>
export default {
  name: 'cc-npc-feature-card',
  props: {
    feature: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      component: null,
    }
  },
  computed: {
    item() {
      return {
        Feature: this.feature,
        Tier: this.tier,
      }
    },
    loader() {
      if (!this.feature) {
        return null
      }
      switch (this.feature.FeatureType) {
        case 'Оружие':
          return () => import(`./cards/_WeaponCard.vue`)
        case 'Реакция':
          return () => import(`./cards/_ReactionCard.vue`)
        case 'Система':
          return () => import(`./cards/_SystemCard.vue`)
        case 'Черта':
          return () => import(`./cards/_TraitCard.vue`)
        case 'Технология':
          return () => import(`./cards/_TechCard.vue`)
        default:
          return () => import(`./cards/_${this.feature.ItemType}Card.vue`)
      }
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        console.error(`Невозможно загрузить компонент ${this.feature.FeatureType}`)
      })
  },
}
</script>
