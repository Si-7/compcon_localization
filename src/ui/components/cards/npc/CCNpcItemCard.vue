<template>
  <component
    :is="component"
    v-if="component"
    :item="item"
    :active="active"
    @remove-feature="$emit('remove-feature', $event)"
    @add-reaction="$emit('add-reaction', $event)"
    @recalc="$emit('recalc')"
  />
</template>

<script>
export default {
  name: 'cc-npc-item-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
    },
  },
  data() {
    return {
      component: null,
    }
  },
  computed: {
    loader() {
      if (!this.item) {
        return null
      }
      switch (this.item.Feature.FeatureType) {
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
        return () => import(`./cards/_${this.item.Feature.FeatureType}Card.vue`)
    }
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        console.error(`Невозможно загрузить компонент ${this.item.Feature.FeatureType}`)
      })
  },
}
</script>
