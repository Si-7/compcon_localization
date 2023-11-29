<template>
  <v-dialog v-model="dialog" width="75vw">
    <v-card flat tile>
      <v-toolbar color="title-bg clipped-large" dark flat>
        <v-toolbar-title class="heading h1">СТРУКТУРНЫЙ УРОН</v-toolbar-title>
      </v-toolbar>
      <v-row justify="center">
        <v-col cols="11">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="2">
                  <span class="heading h3">Бросок</span>
                </v-col>
                <v-col cols="3">
                  <span class="heading h3">Результат</span>
                </v-col>
                <v-col cols="7">
                  <span class="heading h3">Эффект</span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col cols="2">
                  <v-icon large>mdi-dice-5</v-icon>
                  <v-icon large>mdi-minus</v-icon>
                  <v-icon large>mdi-dice-6</v-icon>
                </v-col>
                <v-col cols="3">
                  <span class="heading h3">Скользящий Удар</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Аварийные системы срабатывают и стабилизируют вашего меха, но он будет Ослаблен до конца вашего следующего хода.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col cols="2">
                  <v-icon large>mdi-dice-2</v-icon>
                  <v-icon large>mdi-minus</v-icon>
                  <v-icon large>mdi-dice-4</v-icon>
                </v-col>
                <v-col cols="3">
                  <span class="heading h3">Системная Травма</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Части вашего меха оторваны в результате урона. Бросьте 1d6. При выпадении 1–3
                    уничтожается все оружие в одном слоте по вашему выбору; при 4-6 уничтожается
                    система по вашему выбору. Ограниченные системы и оружие, у которых
                    закончились заряды, не являются доступными вариантами. Если не осталось ни
                    одного доступного варианта, результат меняется. Если не осталось действующих
                    систем или оружия, этот результат становится Прямым Попаданием.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col cols="2">
                  <v-icon large>mdi-dice-1</v-icon>
                </v-col>
                <v-col cols="3">
                  <span class="heading h3">Прямое Попадание</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Результат зависит от оставшейся Структуры вашего меха:
                    <br />
                    3+ Структуры: Ваш мех Ошеломлен до конца вашего следующего хода.
                    <br />
                    2 Структуры: Сделайте проверку Корпуса. При успехе ваш мех Ошеломлен до
                    конца вашего следующего хода. В случае неудачи ваш мех уничтожается.
                    <br />
                    1 Структура: Ваш мех уничтожен.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col cols="2">
                  <v-icon large>mdi-dice-1</v-icon>
                  <v-icon large>mdi-dice-1</v-icon>
                </v-col>
                <v-col cols="3">
                  <span class="heading h3">Сокрушительный Удар</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Ваш мех поврежден и не подлежит ремонту — он уничтожен. Вы по-прежнему
                    можете выйти из него как обычно.
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="dialog = false">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'ref-structure-table',
})
export default class CCRefStructureTable extends Vue {
  dialog = false
  show() {
    this.dialog = true
  }
  close() {
    this.dialog = false
  }
}
</script>

<style scoped>
.title-bg {
  background: repeating-linear-gradient(
    45deg,
    rgb(124, 0, 0),
    rgba(124, 0, 0) 20px,
    rgba(30, 30, 30) 20px,
    rgba(30, 30, 30) 40px
  );
}

.die-hover {
  opacity: 0.75;
  transform: all 0.3s;
}

.die-hover:hover {
  opacity: 1;
  background-color: #e3f2fd;
}
</style>
