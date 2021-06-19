import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    availableSignals: [],
    currentSignals: [],
    time: Date.now(),
    user: {},
    views: []
  },
  mutations: {
    SET_IS_LOADING(state, value) {
      state.loading = value;
    },
    SET_TIME(state, value) {
      state.time = value;
    },
    SET_AVAILABLE_SIGNALS(state, value) {
      state.availableSignals = value;
    },
    SET_USER(state, value) {
      state.user = value;
    },
    SET_VIEWS(state, value) {
      state.views = value;
    },
    SET_CURRENT_SIGNALS(state, value) {
      state.currentSignals = value;
    }
  },
  actions: {
  },
  modules: {
  }
})
