<template>
  <v-card-text>
    <v-row dense>
      <v-col md="12" lg="7">
        <v-row dense align="start">
          <v-col>
            <span class="heading h2 text--text">
              {{ item.Source }} {{ item.MechTypeString }} РАМА
            </span>
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <cc-tooltip
              :title="`Размер ${item.Size === 0.5 ? '½' : item.Size}`"
              :content="glossary('Размер')"
            >
              <v-icon size="60" color="accent" class="mt-n2" style="line-height: 40px">
                {{ item.SizeIcon }}
              </v-icon>
            </cc-tooltip>
          </v-col>
        </v-row>
        <div v-if="item.InLcp" class="heading h4 text--text">{{ item.LcpName }}</div>
        <div v-if="item.Description">
          <div class="overline ml-n2 my-1 text--text">СТАТЬЯ КОМПЕНДИУМА</div>
          <p v-html-safe="item.Description" class="flavor-text" />
        </div>
        <div>
          <span class="overline ml-n2 text--text">БОЕВОЙ ПРОФИЛЬ</span>
          <p class="heading h3 subtle--text light-panel text-center py-10">
            <v-icon large color="grey">mdi-lock</v-icon>
            <br />
            ФУНКЦИОНАЛ В РАЗРАБОТКЕ
          </p>
        </div>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.lgAndUp" cols="5">
        <v-img :src="item.DefaultImage" max-width="35vw" />
        <cc-tooltip simple content="Функционал в разработке">
          <frame-gallery-modal :frame="item" />
        </cc-tooltip>
      </v-col>
    </v-row>

    <span class="overline ml-n2 mb-n2 text--text">БАЗОВЫЕ АТТРИБУТЫ РАМЫ</span>
    <frame-statblock :frame="item" />

    <span class="overline ml-n2 text--text">ЧЕРТЫ РАМЫ</span>
    <cc-trait-item
      v-for="(t, i) in item.Traits"
      :key="`trait_${i}`"
      :trait="t"
      :color="item.Manufacturer.GetColor($vuetify.theme.dark)"
    />

    <span class="overline ml-n2 text--text">ДОСТУПНЫЕ СЛОТЫ</span>
    <v-row justify="space-around" class="mb-3">
      <v-col v-for="(m, i) in item.Mounts" :key="m + i" cols="auto">
        <v-card color="primary" dark class="clipped">
          <cc-tooltip simple inline :content="get_mount_tooltip(m)">
            <v-card-text class="heading h3 px-8">{{ m }} Слот</v-card-text>
          </cc-tooltip>
        </v-card>
      </v-col>
    </v-row>

    <span class="overline ml-n2 text--text">СИСТЕМА ЯДРА</span>
    <frame-core-system-panel :cs="item.CoreSystem" />
  </v-card-text>
</template>

<script lang="ts">
import Vue from 'vue'
import { FrameGalleryModal, FrameStatblock, FrameCoreSystemPanel } from './frame'
import { glossary } from 'lancer-data-rus'

export default Vue.extend({
  name: 'cc-frame-card',
  components: { FrameGalleryModal, FrameStatblock, FrameCoreSystemPanel },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    glossary(name: string) {
      return glossary.find(x => x.name.toLowerCase() === name.toLowerCase()).description
    },

    get_mount_tooltip(mount_type: string) {
      const mount_tooltips = {
        "Тяжёлый": "Вмещает одно <b>Тяжёлое</b>, <b>Основное</b> либо <b>Вторичное</b> оружие",
        "Основной": "Вмещает одно <b>Основное</b> либо <b>Вторичное</b> оружие",
        "Втор./Вспом.": "Вмещает до 2 <b>Вторичных</b> оружий",
        "Втор.": "Вмещает одно <b>Вторичное</b> оружие",
        "Осн./Втор.": "Вмещает одно <b>Основное</b> и одно <b>Вторичное</b>, либо два <b>Вторичных</b> оружия",
        "Гибкий": "Вмещает одно <b>Основное</b> либо два <b>Вторичных</b> оружия",
      }
      if (mount_type in mount_tooltips) {
        return mount_tooltips[mount_type]
      }
      return "Error: Unknown Mount Type"
    },
  },
})
</script>
