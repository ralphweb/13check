import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSession from 'vue-session'
import JsonExcel from "vue-json-excel";
import VueBlobJsonCsv from 'vue-blob-json-csv';

const moment = require('moment')
require('moment/locale/es')
 
Vue.use(require('vue-moment'), {
    moment
})
Vue.use(VueSession,{persist:true})

Vue.component("downloadExcel", JsonExcel);
Vue.use(VueBlobJsonCsv);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
