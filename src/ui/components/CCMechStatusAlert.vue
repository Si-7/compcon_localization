<template>
  <v-alert v-if="show" :color="color" dense dark class="ma-0">
    <v-icon slot="prepend" x-large class="ml-n2 mr-2" color="white">{{ icon }}</v-icon>
    <div :class="`heading ${small ? 'h3' : 'h2'}`">
      <span v-if="type === 'destroyed'">МЕХ УНИЧТОЖЕН</span>
      <span v-else-if="type === 'cascading'">ОПАСНОСТЬ: НЧЛ В КАСКАДЕ</span>
      <span v-else-if="type === 'overSP'">ТРЕВОГА: ВМЕСТИМОСТЬ СИСТЕМ ПРЕВЫШЕНА</span>
      <span v-else-if="type === 'unfinished'">ПРЕДУПРЕЖДЕНИЕ: ЗАМЕЧЕНЫ ПУСТЫЕ СЛОТЫ</span>
      <span v-else-if="type === 'underSP'">ПРЕДУПРЕЖДЕНИЕ: ОСТАЛАСЬ ВМЕСТИМОСТЬ СИСТЕМ</span>
      <span v-else-if="type === 'unlicensed'">ПРЕДУПРЕЖДЕНИЕ: ЗАМЕЧЕНО НЕЛИЦЕНЗИРОВАННОЕ СНАРЯЖЕНИЕ</span>
    </div>
    <div v-if="!small && !hideClear" class="mt-1">
      <v-btn v-if="type === 'destroyed'" block small outlined dark @click="$emit('reprint')">
        <v-icon left>cci-mech</v-icon>
        Перепечатать Меха
      </v-btn>
      <span v-else-if="type === 'cascading'" class="white--text flavor-text">
        ОСВОБОЖДЕННЫЕ НЧЛ ПРЕДСТАВЛЯЮТ НЕПОСРЕДСТВЕННУЮ УГРОЗУ ДЛЯ ЛЮБЫХ ЛЮДЕЙ ИЛИ СОБСТВЕННОСТИ 
        В РАМКАХ МАКСИМАЛЬНОЙ РАБОЧЕЙ ЗОНЫ РАМЫ. НЕВЫПОЛНЕНИЕ ЖЕСТКОГО ЦИКЛА ПРЕДСТАВЛЯЕТ СОБСТВЕННУЮ 
        ХАЛАТНОСТЬ ПО ЗАКОНОДАТЕЛЬСТВУ СОЮЗА.
      </span>
      <span v-else-if="type === 'overSP'" class="white--text flavor-text">
        Снаряжение конфигурации превышает доступные СП
      </span>
      <span v-else-if="type === 'unfinished' || type === 'underSP'" class="white--text flavor-text">
        Эксплуатационные возможности значительно нарушены
      </span>
      <span v-else-if="type === 'unlicensed'" class="white--text flavor-text">
        У пилота нет одной или больше лицензий, необходимых для легальной печати или использования этой конфигурации
      </span>
    </div>
  </v-alert>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'status-alert' })
export default class CCMechStatusAlert extends Vue {
  @Prop({ type: String, required: true })
  readonly type!: string
  @Prop({ type: Boolean })
  readonly criticalOnly?: boolean
  @Prop({ type: Boolean })
  readonly hideClear?: boolean

  get small() {
    return this.$vuetify.breakpoint.smAndDown
  }

  get show() {
    if (!this.criticalOnly) return true
    switch (this.type) {
      case 'overSP':
      case 'underSP':
      case 'unfinished':
      case 'unlicensed':
        return false
      default:
        return true
    }
  }
  get icon() {
    switch (this.type) {
      case 'destroyed':
        return 'mdi-image-broken-variant'
        break
      case 'meltdown':
        return 'mdi-alert-outline'
        break
      case 'reactorDestroyed':
        return 'mdi-nuke'
        break
      case 'unshackled':
        return 'mdi-link-variant-off'
        break
      case 'overSP':
      case 'underSP':
        return 'cci-system'
        break
      case 'unfinished':
        return 'mdi-alert'
        break
      case 'unlicensed':
        return 'cci-license'
        break
      default:
        return ''
        break
    }
  }
  get color() {
    switch (this.type) {
      case 'destroyed':
      case 'cascading':
        return 'error'
        break
      case 'meltdown':
        return 'dangerzone'
        break
      case 'reactorDestroyed':
        return 'error darken-1'
        break
      case 'overSP':
      case 'unlicensed':
        return 'warning darken-1'
        break
      default:
        return 'grey darken-1'
        break
    }
  }
}
</script>
