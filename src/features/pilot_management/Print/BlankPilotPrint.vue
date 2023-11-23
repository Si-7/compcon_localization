<template>
  <v-container fluid>
    <v-row dense align="start">
      <single cols="5" label="ПОЗЫВНОЙ" height="60" />
      <v-divider vertical class="mx-2" />
      <single cols="1" label="КРП" height="60" />
      <single cols="1" label="МНВР" height="60" />
      <single cols="1" label="СИС" height="60" />
      <single cols="1" label="ИНЖ" height="60" />
      <v-divider vertical class="mx-2" />
      <single cols="auto" label="УРОВЕНЬ" height="60" />
      <single cols="1" label="СТОЙК" height="60" />
    </v-row>
    <v-row dense align="start">
      <single cols="3" label="ИМЯ" height="20" />
      <single cols="3" label="ПРЕДЫСТОРИЯ" height="20" />
      <single cols="2" label="СТАТУС" height="20" />
      <v-spacer />
      <single cols="3" label="ИГРОК" height="20" />
    </v-row>
    <v-row dense justify="center">
      <v-col cols="10">
        <v-row dense justify="space-between">
          <v-col cols="auto">
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
          <v-col cols="auto">
            <div class="overline mb-n1">БРОНЯ</div>
            <v-icon size="60" color="grey lighten-3">mdi-shield-outline</v-icon>
          </v-col>
          <v-col cols="auto">
            <div class="overline mb-n1">ЭЗАЩ</div>
            <v-icon size="60" color="grey lighten-3">cci-marker</v-icon>
          </v-col>
          <v-col cols="auto">
            <div class="overline mb-n1">УКЛОНЕНИЕ</div>
            <v-icon size="60" color="grey lighten-3">cci-evasion</v-icon>
          </v-col>
          <v-col cols="auto">
            <div class="overline mb-n1">СКОРОСТЬ</div>
            <v-icon size="60" color="grey lighten-3">$vuetify.icons.move</v-icon>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <v-row align="start">
      <v-col>
        <span class="overline">ПОЛУЧЕННЫЕ ЛИЦЕНЗИИ</span>
        <v-row v-for="n in 6" :key="`license_${n}`" dense no-gutters>
          <single cols="11" label="ЛИЦЕНЗИЯ" height="25" />
          <single cols="1" label="РАНГ" height="25" />
        </v-row>
      </v-col>
      <v-col>
        <span class="overline">ТРИГГЕРЫ</span>
        <v-row v-for="n in 6" :key="`skill_${n}`" dense no-gutters>
          <single cols="10" label="ТРИГГЕР" height="25" />
          <single cols="2" label="БОНУС" height="25" />
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <span class="overline">ТАЛАНТЫ</span>
    <v-row v-for="n in 2" :key="`talent_${n}`" dense justify="space-between" no-gutters>
      <v-col v-for="x in 2" :key="`talent_${n}_${x}`">
        <v-row dense>
          <single cols="10" label="ТАЛАНТ" height="20" />
          <single cols="1" label="РАНГ" height="20" />
          <single cols="12" label="ОПИСАНИЕ" height="150" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-2" />
    <div style="page-break-before: always;" />
    <span class="overline">СНАРЯЖЕНИЕ ПИЛОТА</span>
    <v-row dense justify="space-between" class="mt-n2">
      <v-col>
        <v-row dense>
          <single cols="12" label="БРОНЯ" height="20" class="mb-n1" />
          <single cols="3" label="ПЗ+" height="20" />
          <single cols="3" label="ЭЗАЩ" height="20" />
          <single cols="3" label="УКЛОН" height="20" />
          <single cols="3" label="СКОР" height="20" />
          <single cols="12" label="ЭФФЕКТЫ" height="100" class="mt-n2" />
        </v-row>
      </v-col>
      <v-col v-for="n in 2" :key="`weapon_${n}`">
        <v-row dense>
          <single cols="12" label="ОРУЖИЕ" height="20" class="mb-n1" />
          <single cols="5" label="ДАЛЬНОСТЬ" height="20" />
          <single cols="7" label="УРОН//ТИП" height="20" />
          <single cols="12" label="ЭФФЕКТЫ" height="100" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <v-row dense justify="space-between">
      <v-col v-for="n in 3" :key="`gear_${n}`">
        <v-row dense>
          <single cols="9" label="СНАРЯЖЕНИЕ" height="20" class="mb-n1" />
          <single cols="2" label="ОГР." height="20" />
          <single cols="12" label="ЭФФЕКТЫ" height="100" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <br />
    <v-divider class="my-2" />
    <span class="overline">РЕЗЕРВЫ</span>
    <v-row dense justify="space-between">
      <v-col v-for="n in 4" :key="`gear_${n}`" cols="6">
        <v-row dense>
          <single cols="9" label="РЕСУРС" height="20" class="mb-n1" />
          <single cols="2" label="ДОСТУПНО?" height="20" />
          <single cols="12" label="ОПИСАНИЕ" height="175" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <div style="page-break-before: always;" />
    <v-row dense>
      <single cols="12" label="ЗАМЕТКИ" height="225" class="mt-n2" />
      <single cols="12" label="РЕСУРСЫ" height="225" />
      <single cols="12" label="КОНТАКТЫ" height="225" />
      <single cols="12" label="ЖУРНАЛ МИССИИ" height="225" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Single from './blanks/Single.vue'

export default Vue.extend({
  name: 'pilot-blank-view',
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
