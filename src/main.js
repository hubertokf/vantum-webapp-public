import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import VueAnalytics from 'vue-analytics'
// import Vuebar from 'vuebar'
// import * as VueGoogleMaps from 'vue2-google-maps'
import VueGeolocation from 'vue-browser-geolocation'
import Notifications from 'vue-notification'
import VueClipboard from 'vue-clipboard2'
var mobile = require('is-mobile');
import VueLodash from 'vue-lodash'
// import uploader from 'vue-simple-uploader'
// Vue.use(uploader)
import VShowSlide from 'v-show-slide'

Vue.use(VShowSlide)


// import 'vue-googlemaps/dist/vue-googlemaps.css'
// import VueGoogleMaps from 'vue-googlemaps'

import pt_BR from 'vee-validate/dist/locale/pt_BR'
import dictionary from './validator/dictionary'
// import VeeValidate from 'vee-validate'
import VeeValidate, {
  Validator
} from 'vee-validate'
import Buefy from 'buefy'

import 'buefy/dist/buefy.css'
require('@/assets/sass/main.scss')

import Header from '@/components/Header'
import FooterSection from '@/components/FooterSection'
import FooterBar from '@/components/FooterBar'

// import {
//   L
// } from 'vue2-leaflet'
import {
  Icon
} from 'leaflet'
import * as L from 'leaflet' // VALID
import 'leaflet/dist/leaflet.css'

// import LDrawToolbar from 'leaflet-draw-toolbar/dist/leaflet.draw-toolbar.js';

import VueTheMask from 'vue-the-mask'

import './registerServiceWorker'

Vue.use(VueAnalytics, {
  id: 'UA-127414752-1',
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  }
})

Vue.use(VueTheMask)

Vue.prototype.$clone = function (a) {
  return JSON.parse(JSON.stringify(a));
}

Vue.prototype.$isMobile = mobile()

Vue.use(VueLodash)

const moment = require('moment')
require('moment/locale/pt-br')

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('@/assets/icons/placeholder.svg'),
  iconUrl: require('@/assets/icons/placeholder.svg'),
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

// Vue.use(VueGoogleMaps, {
//   load: {
//     // Google API key
//     apiKey: 'AIzaSyD2KaJGWC9avH__7fho8HXG0itdtPM4HhM',
//     // Enable more Google Maps libraries here
//     libraries: ['places,drawing,visualization'],
//     // Use new renderer
//     useBetaRenderer: false,
//   },
// })

Vue.use(Buefy)
Vue.use(VeeValidate)
// Vue.use(Vuebar)
Vue.use(Notifications)
Vue.use(VueGeolocation);
Vue.use(VueClipboard)

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyD2KaJGWC9avH__7fho8HXG0itdtPM4HhM',
//     libraries: 'places,drawing,visualization', // This is required if you use the Autocomplete plugin
//     // OR: libraries: 'places,drawing'
//     // OR: libraries: 'places,drawing,visualization'
//     // (as you require)

//     //// If you want to set the version, you can do so:
//     // v: '3.26',
//   },
// })

Vue.use(require('vue-moment'), {
  moment
})

Validator.localize('pt_BR', pt_BR)
Validator.localize(dictionary)

VeeValidate.Validator.extend('verify_password', {
  getMessage: field => `A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula e 1 número`,
  validate: value => {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    // var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(value);
  }
});

VeeValidate.Validator.extend('verify_email', {
  getMessage: field => `O email não deve conter o caractere "+".`,
  validate: value => {
    if (value.match(/[^a-z0-9\@\.\_\-]/g)) {
      return false
    } else {
      return true
    }
  }
});

VeeValidate.Validator.extend('hotmail_email', {
  getMessage: field => `Infelizmente o hotmail não pode ser utilizado, tente outro email.`,
  validate: value => {
    var res = value.match(/hotmail/);
    if (res && res[0] == 'hotmail') {
      return false
    } else {
      return true
    }
  }
});

Vue.config.productionTip = false

Vue.component('header-view', Header)
Vue.component('footer-section', FooterSection)
Vue.component('footer-bar', FooterBar)

Vue.prototype.$http = Axios;

Vue.config.productionTip = false

const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

// Vue.http.interceptors.push((request, next) => {
//   if (request.url !== '/api/login/post') {
//     const xToken = window.localStorage.getItem('x-token')
//     request.headers.set('X-Token', xToken)
//   }

//   next(response => {
//     if ((response.status === 404) || (response.status === 504)) {
//       router.push({
//         name: 'Home'
//       })
//     }

//     if (response.status === 403) {
//       router.push({
//         name: 'Login'
//       })
//     }
//   })
// })

new Vue({
  router,
  store,
  Axios,
  render: h => h(App),
  mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
}).$mount('#app')

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: {
//     App
//   },
//   template: '<App/>'
// })