import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSession from 'vue-session'
import { VueHammer } from 'vue2-hammer'
import HistogramSlider from '@/lib/vue-histogram-slider';
import 'vue-histogram-slider/dist/histogram-slider.css';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import ToggleButton from 'vue-js-toggle-button'
 
Vue.use(ToggleButton)

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

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

Vue.use(VueHammer)

Vue.component(HistogramSlider.name, HistogramSlider);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
