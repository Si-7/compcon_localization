<template>
  <v-container>
    <h1 class="heading mb-3 ml-5">СПРАВКА</h1>
    <v-container fluid class="effect-text">
      <span class="heading mech">Структурный урон & Перегрев</span>
      <v-row dense justify="center">
        <v-col>
          <v-toolbar color="red darken-3" dark>
            <v-toolbar-title>СТРУКТУРНЫЙ УРОН</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col>
                  <span class="heading h3">Бросок</span>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
                  <span class="heading h3">Результат</span>
                </v-col>
                <v-col cols="7">
                  <span class="heading h3">Эффект</span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-5</v-icon>
                  <v-icon large>mdi-minus</v-icon>
                  <v-icon large>mdi-dice-6</v-icon>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
                  <span class="heading h3">Скользящий Урон</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Аварийные системы срабатывают и стабилизируют вашего меха, но он будет 
                    <b>Ослаблен</b>
                    до конца вашего следующего хода.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-2</v-icon>
                  <v-icon large>mdi-minus</v-icon>
                  <v-icon large>mdi-dice-4</v-icon>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
                  <span class="heading h3">Системная Травма</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Части вашего меха оторваны в результате урона. Бросьте 1d6. При выпадении 1–3
                    уничтожается все оружие в одном слоте по вашему выбору; при 4-6 уничтожается
                    система по вашему выбору. <b>Ограниченные</b> системы и оружие, у которых
                    закончились заряды, не являются доступными вариантами. Если не осталось ни
                    одного доступного варианта, результат меняется. Если не осталось действующих
                    систем или оружия, этот результат становится <b>Прямым Попаданием</b>.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-1</v-icon>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
                  <span class="heading h3">Прямое Попадание</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Результат зависит от оставшейся Структуры вашего меха.
                    <br />
                    3+ - Ваш мех 
                    <b>Ошеломлен</b> 
                    до конца вашего следующего хода.
                    <br />
                    2 - Сделайте проверку
                    <b>Корпуса</b>.
                    При успехе ваш мех
                    <b>Ошеломлен</b> 
                    до конца вашего следующего хода.
                    В случае неудачи ваш мех уничтожается.
                    <br />
                    1 или меньше - Ваш мех уничтожен.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-1</v-icon>
                  <v-icon large>mdi-dice-1</v-icon>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
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
      <v-row justify="center" class="mt-4">
        <v-col>
          <v-toolbar color="orange darken-4" dark>
            <v-toolbar-title>ПЕРЕГРЕВ</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col>
                  <span class="heading h3">Бросок</span>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
                  <span class="heading h3">Результат</span>
                </v-col>
                <v-col cols="7">
                  <span class="heading h3">Эффект</span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-5</v-icon>
                  <v-icon large>mdi-minus</v-icon>
                  <v-icon large>mdi-dice-6</v-icon>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
                  <span class="heading h3">Аварийный шунт</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Системам охлаждения вашего меха удается сдерживать растущий нагрев;
однако ваш мех становится
                    <b>Ослабленным</b>
                    до конца вашего следующего хода.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-2</v-icon>
                  <v-icon large>mdi-minus</v-icon>
                  <v-icon large>mdi-dice-4</v-icon>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
                  <span class="heading h3">Разрушение Энерго-Установок</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Энерго-установки становятся нестабильными и начинают выбрасывать струи плазмы.
Ваш мех становится
                    <b>Уязвимым</b>
                    , получая двойной Кинетический, Взрывной и Энергетический урон, пока статус не будет снят.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-1</v-icon>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
                  <span class="heading h3">Плавление</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Результат зависит от оставшейся Нагрузки у вашего меха:
                    <br />
                    3+ - Ваш мех становится <b>Уязвимым</b>.
                    <br />
                    2 - Проведите проверку <b>Инженерии</b>. В случае успеха, ваш мех
                    становится <b>Уязвимым</b>; в случае неудачи, он получает расплавление реактора
                    через 1d6 ваших ходов (определяется ГМ). Плавление реактора можно
                    предотвратить, повторив проверку <b>Инженерии</b> в качестве полного действия.
                    <br />
                    1 или меньше - У вашего меха расплавится реактор в конце вашего следующего хода.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-1</v-icon>
                  <v-icon large>mdi-dice-1</v-icon>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
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
                Маневренности или получить 4d6 Взрывного урона. В случае
                успеха они получают половину урона.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center" class="mt-4">
        <v-col>
          <v-toolbar color="yellow darken-4" dark>
            <v-toolbar-title>НОКАУТ</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col>
                  <span class="heading h3">Бросок</span>
                </v-col>
                <v-col cols="10">
                  <span class="heading h3">Эффект</span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-6</v-icon>
                </v-col>
                <v-col cols="10">
                  <span class="body-text text--text">
                    При 6 ваш пилот едва справляется с ударом — он возвращается к 1 ПЗ.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-2</v-icon>
                  <v-icon large>mdi-minus</v-icon>
                  <v-icon large>mdi-dice-5</v-icon>
                </v-col>
                <v-col cols="10">
                  <span class="body-text text--text">
                    При 2-5 ваш пилот получает статус <b>Нокаут</b> 
                    (и состояние <b>Ошеломление</b>) и остается с 0
                    ПЗ. Он находится без сознания, прижат, истекает
                    кровью или не может действовать по иным
                    причинам. Если вы ведете бой с мехом, он оглушен,
                    и его Уклонение падает до 5. Если он получит еще
                    какой-либо урон — например, выстрел в голову —
                    он умрет.
                    <br />
                    Вы можете выбрать, чтобы ваш пилот погиб, а не получил статус <b>Нокаут</b>.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <v-row>
                <v-col>
                  <v-icon large>mdi-dice-1</v-icon>
                </v-col>
                <v-col cols="10">
                  <span class="body-text text--text">
                    При 1 пункте удача вашего пилота закончилась — он немедленно погибает.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <p class="ma-3 flavor-text">Если ПЗ вашего пилота когда-либо снижаются до 0 ПЗ, бросьте 1d6.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'reference',
})
</script>
