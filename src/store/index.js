import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
  },
  mutations: {
    SET_IS_LOADING(state, value) {
      state.loading = value;
    }
  },
  actions: {
  },
  modules: {
  }
})
