import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSession from 'vue-session'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import ToggleButton from 'vue-js-toggle-button'
import es from 'vee-validate/dist/locale/es';
import VeeValidate, { Validator } from 'vee-validate';
import VueHorizontal from "vue-horizontal";
import vSelect from 'vue-select'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import VueVideoPlayer from 'vue-video-player'
// require videojs style
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { LoaderPlugin } from 'vue-google-login';

Vue.use(LoaderPlugin, {
  client_id: "177898246150-fv67agbfpe1t4qeq3hfmtmeds180g75s.apps.googleusercontent.com"
});

Vue.use(VueVideoPlayer)

Vue.component('VueSlider', VueSlider)

Vue.component('v-select', vSelect)

Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: "veeFields",
  errorBagName: "veeErrors"
});

Validator.localize('es', es);

Vue.use(ToggleButton)
Vue.component(VueHorizontal)

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Import the styles too, typically in App.vue or main.js
import 'vue-swatches/dist/vue-swatches.css'
import 'vue-select/dist/vue-select.css';

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

const VueScrollTo = require('vue-scrollto');
// You can also pass in the default options
Vue.use(VueScrollTo, {
     container: ".app",
     duration: 500,
     easing: "ease",
     offset: 0,
     force: true,
     cancelable: true,
     onStart: false,
     onDone: false,
     onCancel: false,
     x: false,
     y: true
 })

const moment = require('moment')
require('moment/locale/es')
 
Vue.use(require('vue-moment'), {
    moment
})
Vue.use(VueSession,{persist:true})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
