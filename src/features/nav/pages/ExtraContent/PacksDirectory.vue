<template>
  <div class="packsList" style="min-height: 300px">
    <div class="heading h2 stark--text mt-3 px-2">Оффициальный контент Massif LANCER</div>
    <directory-table :items="massifPacks" :loading="loading" no-author />
    <v-divider class="my-6" />
    <div class="heading h2 stark--text mt-3 px-2">
      Контент сообщества LANCER
      <v-menu bottom open-on-hover>
        <template v-slot:activator="{ on }">
          <v-icon class="fadeSelect" v-on="on">mdi-information-outline</v-icon>
        </template>
        <v-card max-width="500px">
          <v-card-title>Пакеты контента сообщества LANCER</v-card-title>
          <v-card-text>
            <span v-if="communityPacks.length">
              COMP/CON гордится сотрудничеством с сообществом LANCER в предоставлении доступа к этим неофициальным пакетам контента. 
              Они предлагаются «как есть» на усмотрение автора.
            </span>
            <br />
            Если вы заинтересованы в создании собственного хоумбрю контента LANCER или в размещении вашего контента в этом каталоге, пожалуйста,
            <a
              href="https://github.com/massif-press/lancer-data-rus#lancer-community-content-packs"
              target="_blank"
            >
              нажмите здесь
            </a>
            .
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
    <directory-table :items="communityPacks" :loading="loading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import DirectoryTable from './components/DirectoryTable.vue'
import { scan } from './api'

@Component({
  components: { DirectoryTable },
})
export default class PacksDirectory extends Vue {
  private massifPacks = []
  private communityPacks = []
  private loading = true

  async mounted(): Promise<void> {
    scan()
      .then((res: any) => {
        this.communityPacks = res.data.community.Items
        this.massifPacks = res.data.massif.Items
        this.loading = false
      })
      .catch(err => {
        console.error('Возникла проблема при загрузке пакетов контента сообщества.', err)
        this.loading = false
      })
  }
}
</script>
