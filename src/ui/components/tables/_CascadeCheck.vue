<template>
  <div v-show="AiSystems.length">
    <cc-synergy-display location="cascade" :mech="mech" />
    <v-card tile elevation="0" outlined>
      <v-toolbar dense elevation="0" color="error" class="text-center white--text heading h3">
        ОПАСТНОСТЬ КАСКАДА
        <v-spacer />
        <cc-tooltip
          title="КАСКАД"
          content="<p>За исключением некоторых ограниченных систем &ndash; например, комп/конов &ndash; каждый раз, когда мех с меткой ИИ делает проверку структурного урона или нагрева, бросьте 1d20. Если выпадет 1, оболочка НЧЛ получила травмирующий удар или вторжение в код, и НЧЛ входит в каскад.&nbsp;</p>
<p>Когда НЧЛ входит каскад, он немедленно берет на себя управление мехом и становится НИПом под контролем ГМ. Он сам начинает планировать свои действия и принимает одну из нескольких моделей поведения &ndash; игнорирует своего пилота, управляет своим пилотом, пытается убрать своего пилота с дороги или просто действуют вне ограничений человеческой логики и желаний. В каскаде действия НЧЛ не всегда соответствуют человеческой логике — хотя они еще не освобождены от оков, их действия могут казаться людям странными, противоположными или угрожающими.&nbsp;</p>
<p>НЧЛ в каскаде может быть стабилизирован, если пилот решит Отключить своего меха, вернув его в базовое состояние. Это единственное действие, которое может предпринять пилот в каскадном мехе. </p>"
        >
          <v-icon>mdi-information-outline</v-icon>
        </cc-tooltip>
      </v-toolbar>
      <v-row
        v-for="(a, i) in AiSystems"
        :key="`${a.ID}_${i}`"
        class="heading h3 py-2"
        align="center"
      >
        <v-col>
          {{ a.Name }}
        </v-col>
        <v-col>
          СТАТУС:
          <span v-if="!checked.includes(i)" style="opacity: 0.4">PENDING</span>
          <span v-else :class="a.IsCascading ? 'red--text' : 'success--text'">
            {{ a.IsCascading ? 'В КАСКАДЕ' : 'НОРМАЛЬНЫЙ' }}
          </span>
        </v-col>
        <v-col cols="auto" class="mr-3">
          <cc-dice-menu preset="1d20" @commit="checkCascade($event.total, i)" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cascade-check',
  props: {
    mech: { type: Object, required: true },
  },
  data: () => ({
    checked: [],
  }),
  computed: {
    AiSystems() {
      return this.mech.MechLoadoutController.ActiveLoadout.Equipment.filter(
        x => x.IsAI && !x.NoCascade && !x.Destroyed
      )
    },
  },
  methods: {
    checkCascade(roll, index) {
      this.checked.push(index)
      if (roll === 1) this.AiSystems[index].IsCascading = true
      else this.AiSystems[index].IsCascading = false
    },
  },
})
</script>
