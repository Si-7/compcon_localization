<template>
  <div>
    <div
      v-for="(d, i) in damage"
      :key="`dmg_${i}`"
      :class="`text-center ml-auto mr-auto ${i > 0 && !small ? 'pl-4' : ''}`"
      style="display: inline-block"
    >
      <cc-tooltip :title="`${d.Value} ${typeOverride || d.Type} урон`" :content="Help(d)">
        <span v-if="small">
          <v-icon
            :color="typeOverride ? `damage--${damageTypeValueToKey(typeOverride).toLowerCase()}` : d.Color" 
            class="mr-n2 ml-n1"
          >
            {{ typeOverride ? `cci-${damageTypeValueToKey(typeOverride).toLowerCase()}` : d.Icon }}
          </v-icon>
          <v-icon v-if="d.Override">mdi-information-outline</v-icon>
          <span v-else>
            {{ `${added ? '+' : ''}${d.Value}` }}
          </span>
        </span>
        <div v-else>
          <v-icon
            x-large
            :color="typeOverride ? `damage--${damageTypeValueToKey(typeOverride).toLowerCase()}` : d.Color"
            class="mt-n4 mr-n3"
          >
            {{ typeOverride ? `cci-${damageTypeValueToKey(typeOverride).toLowerCase()}` : d.Icon }}
          </v-icon>
          <span class="heading text--text" style="font-size: 24pt;">
            {{ `${added ? '+' : ''}${d.Value}` }}
          </span>
        </div>
      </cc-tooltip>
      <span v-if="!small">
        <div class="overline mt-n1">
          <b>{{ typeOverride ? typeOverride : d.Type }}</b>
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Damage, DamageType } from '@/class'

@Component({ name: 'cc-damage-element' })
export default class CCDamageElement extends Vue {
  @Prop({
    type: Array,
    required: true,
    validator: (prop: Damage[]) => prop.every(dmg => dmg instanceof Damage),
  })
  readonly damage: Damage[]

  @Prop({ type: [String, null], required: false })
  readonly typeOverride: DamageType

  @Prop({ type: Boolean, required: false })
  readonly small: boolean

  @Prop({ type: Boolean, required: false })
  readonly added: boolean

  Help(d: Damage): string {
    switch (d.Type.toLowerCase()) {
      case 'heat':
        return `Это снаряжение наносит ${d.Value} ${d.Type} урона<br><div class="overline subtle--text mb-n2 ">Нагрев:</div>Нагрев — это особый тип воздействия, который не считается уроном и игнорирует Броню, хотя на него может влиять Невосприимчивость. Он представляет собой повреждение внутренних систем и реактора меха. Чаще всего он наносится средствами электронной войны, но часто генерируется собственными системами мехов. Мехи, получающие нагрев, отмечают это на своем листе. Когда он достигает своего Теплового Максимума, любой дополнительный нагрев приводит его к перегреву. Если персонаж, не имеющий Теплового Максимума (например, Биологические персонажи и Дроны), полу- чает нагрев, то вместо этого он получает эквивалентное количество энергетического урона.`
      case 'burn':
        return `Это снаряжение наносит ${d.Value} ${d.Type} урона<br><div class="overline subtle--text mb-n2 ">Горение:</div>Некоторые виды оружия вызывают горение (продолжительный урон). Горение может представлять собой пламя, обжигающую плазму, кислоту или что-то более коварное, например, рой серых нанитов. Когда персонажи получают Горение, это имеет два эффекта: во-первых, они немедленно получают урон, игнорирующий Броню, а затем они отмечают только что полученное горение на своем листе персонажа. В конце своего хода персонажи с пометкой горения должны сделать проверку Инженерии. В случае успеха они убирают все отмеченные в данный момент горения; в противном случае они получают урон Горением, равный количеству отмеченных в данный момент горений. Горение от дополнительных источников добавляется к общему количеству отмеченных горений.`
      default:
        return `Это снаряжение наносит ${d.Value} ${d.Type} урона`
    }
  }

  damageTypeValueToKey(t: DamageType): string {
    return Object.keys(DamageType).find(key => DamageType[key] === t)
  }
}
</script>
