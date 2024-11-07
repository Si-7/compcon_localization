import '@mdi/font/css/materialdesignicons.css'
import 'material-icons/iconfont/material-icons.css'
import './assets/css/global.css'
import './ui/style/_style.css'
import './assets/glyphs/glyphs.css'
import './ui/globals'

import Vue from 'vue'
import VueSecureHTML from 'vue-html-secure'

import App from './App.vue'
import router from './router'
import { store } from './store'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify/lib'
import Ripple from 'vuetify/lib/directives/ripple'
import lancerData from '@massif/lancer-data'

import './registerServiceWorker'

import mixins from './mixins'

import _ from 'lodash'
import Startup from './io/Startup'

import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'

import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'
import { awsmobile } from './aws-exports'
import { getThemePreload } from './classes/utility/ThemeManager'

import VueI18n from 'vue-i18n'
import i18n from './i18n'

Amplify.configure(awsmobile)

Object.defineProperty(Vue.prototype, '$_', { value: _ })

Vue.prototype.$appVersion = process.env.VUE_APP_VERSION_TAG || 'dev'
Vue.prototype.$lancerVersion = `${lancerData.info.version}`

const theme = getThemePreload()
const vuetify = new Vuetify(theme)

Vue.use(VueSecureHTML)
Vue.use(Vuetify, {
  directives: {
    Ripple,
  },
})
Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: 'md',
})

Vue.config.devtools = process.env.NODE_ENV === 'development'

mixins.forEach(m => {
  Vue.mixin(m)
})

Vue.config.errorHandler = (error, vm) => {
  console.error(error)
  Vue.prototype.$notifyError(error, vm)
}
window.onerror = error => {
  console.error(error)
  Vue.prototype.$notifyError(error)
}

const v: any = new Vue({
  components: { App },
  vuetify,
  router,
  store,
  i18n,
  async created() {
    await Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion, store, vuetify)
  },
  render: h => h(App),
}).$mount('#app')

// constrain our writes to unload and nav. This will work on tab close and navigation outside the app.
window.onbeforeunload = () => {
  v.$store.dispatch('savePilotData')
  v.$store.dispatch('saveNpcData')
  v.$store.dispatch('saveMissionData')
  v.$store.dispatch('saveEncounterData')
  v.$store.dispatch('updateUserData')
}

Vue.mixin({
  beforeRouteLeave(to, from, next) {
    v.$store.dispatch('savePilotData')
    v.$store.dispatch('saveNpcData')
    v.$store.dispatch('saveEncounterData')
    v.$store.dispatch('saveMissionData')

    next()
  },
})
