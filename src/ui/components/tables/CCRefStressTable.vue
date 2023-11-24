<template>
  <v-dialog v-model="dialog" width="75vw">
    <v-card flat tile>
      <v-toolbar color="title-bg clipped-large" dark flat>
        <v-toolbar-title class="heading h1">ПЕРЕГРЕВ</v-toolbar-title>
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
                  <span class="heading h3">Аварийный шунт</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Системам охлаждения вашего меха удается сдерживать растущий нагрев;
                    однако ваш мех становится <b>Ослабленным</b> до конца вашего следующего хода.
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
                  <span class="heading h3">Разрушение Энерго-Установок</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Энерго-установки становятся нестабильными и начинают выбрасывать струи плазмы.
                    Ваш мех становится <b>Уязвимым</b>, получая двойной урон, пока статус не будет снят.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col cols="2">
                  <v-icon large>mdi-dice-1</v-icon>
                </v-col>
                <v-col cols="3">
                  <span class="heading h3">Плавление</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Результат зависит от оставшейся Нагрузки у вашего меха:
                    <br />
                    3+ Нагрузки: Ваш мех становится Уязвимым
                    <br />
                    2 Нагрузки: Проведите проверку Инженерии. В случае успеха, ваш мех
                    становится Уязвимым; в случае неудачи, он получает расплавление реактора
                    через 1d6 ваших ходов (определяется ГМ). Плавление реактора можно
                    предотвратить, повторив проверку Инженерии в качестве полного действия
                    <br />
                    1 Нагрузка: У вашего меха расплавится реактор в конце вашего следующего хода
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
                  <span class="heading h3">Необратимое Плавление</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Реактор выходит из строя — реактор вашего меха будет расплавлен в конце
                    вашего следующего хода.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <p class="ma-3 flavor-text">
                Перегрев иногда приводит к плавлению реактора. Это
                может произойти сразу или после обратного отсчета, и
                в этом случае обратный отсчет обновляется в начале
                вашего хода, а плавление срабатывает, когда указано.
                Когда реактор расплавляется, любой пилот внутри
                немедленно погибает, а мех исчезает в результате
                катастрофического извержения с областью Взрыва 2.
                Обломки уничтожаются, и все персонажи, находящиеся
                в зоне поражения, должны преуспеть в спасброске
                Маневренности или получить 4d6 урона. В случае
                успеха они получают половину урона.
              </p>
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
  name: 'ref-stress-table',
})
export default class CCRefStressTable extends Vue {
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
