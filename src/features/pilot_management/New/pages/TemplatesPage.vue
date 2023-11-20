<template>
  <cc-stepper-content
    :complete="selectionComplete"
    exit="pilot_management"
    back
    mandatory
    @back="$emit('back')"
    @complete="setTemplate()"
  >
    <cc-title large>Регистрация Нового Пилота&emsp;</cc-title>
    <h2 v-show="$vuetify.breakpoint.mdAndUp" class="heading">
      Служба IDENT АДС
      <cc-slashes />
      &nbsp;PRM-ALT ВЫБОР БЫСТРОГО ДОСТУПА
    </h2>
    <v-row dense justify="start" align="center">
      <v-col v-show="$vuetify.breakpoint.mdAndUp">
        <div class="flavor-text mt-n2" style="font-size: 14px">
          В соответствии с Законом 5017 PRM-ALT служба регистрации IDENT Административного департамента 
          Союза предоставляет модуль выбора быстрого доступа, созданный и курируемый Поддержкой Бронированной Кавалерии 
          АДС. Сотрудники НЧЛ АДС-ПБК подготовили подборку Шаблонов Боевой Доктрины на 
          основе результатов вашего медицинского обследования OHM//сканирования мозговой активности CR-2. 
          Каждый из этих шаблонов заполнит оставшуюся часть вашей боевой регистрации IDENT специальным 
          набором оптимальных для боевой роли ответов.
        </div>
        <br />
        <v-alert dense outlined color="accent" class="mt-n1">
          <div class="text-center stark--text">
            Выбор шаблона завершит интерфейс Нового Пилота и создаст вашего пилота с 
            тщательно подобранным набором навыков и талантов, а также оснащенным мехом 
            ДМС ЭВЕРЕСТ, адаптированным к боевой роли, выбранной ниже. Все эти параметры 
            можно редактировать в любое время через разделы Пилота и Меха, 
            а также через заголовки разделов со значком
            <v-icon color="accent">mdi-circle-edit-outline</v-icon>
            .
          </div>
        </v-alert>
      </v-col>
      <v-col cols="12" md="4">
        <b class="caption accent--text mt-n2">MECH ART COURTESY OF</b>
        <v-img
          target="_blank"
          href="https://www.retrogrademinis.com/"
          :src="retrogradeLogo"
          class="img-select"
          max-height="131px"
          max-width="478px"
          contain
        />
      </v-col>
    </v-row>
    <v-row :class="$vuetify.breakpoint.mdAndUp ? 'mx-6' : 'mx-2'">
      <template-item
        v-for="t in templates"
        :key="t.name"
        :template="t"
        :is-selected="t === selected"
        @select="selected = t"
      />
    </v-row>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import TemplateItem from './components/TemplateItem.vue'
import Templates from '../pregens.json'
import { MechSkills, Mech } from '@/class'
import { mechname } from '@/io/Generators'

export default Vue.extend({
  name: 'templates-page',
  components: { TemplateItem },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selected: null,
  }),
  computed: {
    templates() {
      return Templates
    },
    retrogradeLogo() {
      return getImagePath(ImageTag.Misc, 'retrograde_logo.png')
    },
    selectionComplete(): boolean {
      return this.selected !== null
    },
  },
  watch: {
    selectionComplete(bool) {
      if (bool) window.scrollTo(0, document.body.scrollHeight)
    },
  },
  methods: {
    item(type: string, id: string) {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.referenceByID(type, id)
    },
    setTemplate() {
      const t = this.selected.build
      this.pilot.MechSkillsController.MechSkills = MechSkills.Deserialize(t.mechSkills)
      this.pilot.SkillsController.ClearSkills()
      t.skills.forEach(s => {
        this.pilot.SkillsController.AddSkill(this.item('Skills', s))
      })
      this.pilot.TalentsController.ClearTalents()
      t.talents.forEach(t => {
        this.pilot.TalentsController.AddTalent(this.item('Talents', t))
      })
      this.pilot.Loadout.Armor = [this.item('PilotGear', t.gear.armor)]
      this.pilot.Loadout.Weapons = t.gear.weapons.map(x => this.item('PilotGear', x))
      this.pilot.Loadout.Gear = t.gear.gear.map(x => this.item('PilotGear', x))

      const m = t.mech
      const mech = new Mech(this.item('Frames', 'mf_standard_pattern_i_everest'), this.pilot)

      mech.Name = mechname()
      mech.MechLoadoutController.ActiveLoadout.Systems = m.systems.map(x =>
        this.item('MechSystems', x)
      )

      mech.MechLoadoutController.ActiveLoadout.AllMounts()
        .find(m => m.Type === 'Основной')
        .Slots[0].EquipWeapon(this.item('MechWeapons', m.mounts[0].slots[0]))
      mech.MechLoadoutController.ActiveLoadout.AllMounts()
        .find(m => m.Type === 'Гибкий')
        .Slots[0].EquipWeapon(this.item('MechWeapons', m.mounts[1].slots[0]))
      mech.MechLoadoutController.ActiveLoadout.AllMounts()
        .find(m => m.Type === 'Гибкий')
        .Slots[1].EquipWeapon(this.item('MechWeapons', m.mounts[1].slots[1]))
      mech.MechLoadoutController.ActiveLoadout.AllMounts()
        .find(m => m.Type === 'Тяжелый')
        .Slots[0].EquipWeapon(this.item('MechWeapons', m.mounts[2].slots[0]))

      mech.PortraitController.SetLocalImage(this.selected.image)

      this.pilot.Mechs.forEach(m => {
        this.pilot.RemoveMech(m)
      })
      this.pilot.AddMech(mech)
      this.pilot.ActiveMech = mech

      this.$emit('next')
    },
  },
})
</script>

<style scoped>
.img-select {
  filter: saturate(0.6) brightness(80%);
  -webkit-filter: saturate(0.6) brightness(80%);
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s;
}

.img-select:hover {
  cursor: pointer;
  filter: saturate(1) brightness(110%);
  -webkit-filter: saturate(1) brightness(110%);
}
</style>
