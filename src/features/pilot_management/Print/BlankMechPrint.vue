<template>
  <v-container fluid>
    <v-row dense align="start">
      <single cols="8" label="НАЗВАНИЕ МЕХА" height="60" />
      <v-spacer />
      <single cols="1" label="РЗМР" height="60" />
      <v-col cols="2" class="mt-n1">
        <v-row dense>
          <single cols="6" label="КРП" height="20" />
          <single cols="6" label="МНВР" height="20" />
        </v-row>
        <v-row dense class="mt-n2">
          <single cols="6" label="СИС" height="20" />
          <single cols="6" label="ИНЖ" height="20" />
        </v-row>
      </v-col>
    </v-row>
    <v-row dense align="start" class="mt-n3">
      <single cols="2" label="ПРОИЗВОДИТЕЛЬ" height="20" />
      <single cols="4" label="РАМА" height="20" />
      <single cols="2" label="СТАТУС" height="20" />
      <v-spacer />
      <single cols="3" label="ПИЛОТ" height="20" />
    </v-row>

    <v-row dense>
      <v-col>
        <div class="overline mb-n1">СТРУКТУРА</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-structure</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto">
        <div class="overline mb-n1">БРОНЯ</div>
        <v-icon size="60" color="grey lighten-3">mdi-shield-outline</v-icon>
      </v-col>
      <v-col>
        <div class="overline mb-n1">ПЗ</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div class="overline mb-n1">НАГРУЗКА</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-reactor</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div class="overline mb-n1">НАГРЕВ</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-burn</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div class="overline mb-n1">ЛИМИТ РЕМОНТА</div>
        <v-row dense no-gutters align="center">
          <v-col cols="auto">
            <v-icon size="60" color="grey lighten-3" class="mr-n1">cci-repair</v-icon>
          </v-col>
          <v-col cols="auto" class="mt-6 mr-n2">
            <span class="subtle--text text--lighten-1 display-2" style="line-height: 0">/</span>
          </v-col>
          <v-col cols="auto" class="mb-n2">
            <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="overline mb-n1 mt-n1">ПЕРЕГРУЗКА</div>
    <v-row no-gutters class="text-center" justify="space-around">
      <v-col cols="auto" class="grey lighten-3 mx-2 oc-border">
        +1
        <v-icon small>mdi-fire</v-icon>
      </v-col>
      <v-col cols="auto" class="grey lighten-3 mx-2 oc-border">
        +1d3
        <v-icon small>mdi-fire</v-icon>
      </v-col>
      <v-col cols="auto" class="grey lighten-3 mx-2 oc-border">
        +1d6
        <v-icon small>mdi-fire</v-icon>
      </v-col>
      <v-col cols="auto" class="grey lighten-3 mx-2 oc-border">
        +1d6+4
        <v-icon small>mdi-fire</v-icon>
      </v-col>
    </v-row>
    <v-row align="start" class="mt-n2">
      <single cols="2" label="+ К АТАКЕ" height="40" />
      <single cols="2" label="ТЕХ АТАКА" height="40" />
      <single cols="2" label="СПАСБРОСОК" height="40" />
      <single cols="2" label="СКОРОСТЬ" height="40" />
      <single cols="2" label="Э-ЗАЩИТА" height="40" />
      <single cols="2" label="УКЛОНЕНИЕ" height="40" />
    </v-row>

    <v-divider />
    <span class="overline">ЧЕРТЫ РАМЫ</span>
    <v-row v-for="n in 3" :key="`trait${n}`" dense class="mt-n2">
      <single cols="7" label="ЧЕРТА" height="20" />
      <single cols="12" label="ЭФФЕКТ" height="75" class="mt-n2" />
    </v-row>

    <v-divider />
    <span class="overline">СИСТЕМА ЯДРА</span>
    <v-row dense class="mt-n2">
      <single cols="7" label="СИСТЕМА ЯДРА" height="20" />
      <v-spacer />
      <single cols="2" label="ИСПОЛЬЗОВАНА" height="20" />
      <single cols="12" label="ПАССИВНАЯ СПОСОБНОСТЬ" height="50" class="mt-n2" />
      <single cols="12" label="АКТИВНАЯ СПОСОБНОСТЬ" height="100" class="mt-n2" />
    </v-row>

    <div style="page-break-before: always;" />

    <span class="overline">ВООРУЖЕНИЕ</span>
    <v-row v-for="n in 2" :key="`mr_${n}`">
      <v-col v-for="x in 2" :key="`mc_${n}_${x}`">
        <fieldset>
          <legend>
            <div
              class="d-inline-block text-right"
              style="height: 35px; min-width: 300px; border: 2px solid grey; border-radius: 3px"
            >
              <span class="d-inline-block flavor-text" style="font-size:20px">
                СЛОТ&nbsp;
              </span>
            </div>
          </legend>
          <v-row v-for="y in 2" :key="`mc_${n}_${x}_${y}`" dense class="mt-n1">
            <single cols="9" label="ОРУЖИЕ" height="20" />
            <single cols="3" label="ТИП" height="20" />
            <single cols="6" label="УРОН" height="20" class="mt-n2" />
            <single cols="6" label="ДАЛЬНОСТЬ" height="20" class="mt-n2" />
            <single cols="12" label="ЭФФЕКТ" height="50" class="mt-n2" />
            <v-col v-if="y === 1" cols="12">
              <v-divider class="my-1" />
            </v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>
    <v-divider class="my-1" />
    <span class="overline">СИСТЕМЫ</span>
    <v-row v-for="n in 5" :key="`ms_${n}`" dense class="mt-n3">
      <v-col v-for="x in 2" :key="`ms_${n}_${x}`" cols="6">
        <v-row dense>
          <single cols="10" label="СИСТЕМА" height="20" />
          <single cols="2" label="СП" height="20" />
          <single cols="12" label="ЭФФЕКТ" height="150" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <v-row dense>
      <single cols="3" label="ИСПОЛЬЗОВАНО СП" height="20" class="ml-auto mt-n3" />
      <single cols="2" label="МАКСИМУМ СП" height="20" class="mt-n3" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Single from './blanks/Single.vue'

export default Vue.extend({
  name: 'mech-blank-view',
  components: { Single },
})
</script>

<style scoped>
.no-height {
  line-height: 0;
}

.icon-overlap {
  position: absolute;
  top: -5px;
  left: 1px;
  width: 100%;
  width: -webkit-fill-available;
  width: -moz-available;
  text-align: center;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: var(--v-grey-lighten2);
}
</style>
