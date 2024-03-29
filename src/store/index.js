import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    live: true,
    play: true,
    muted: false,
    range: false,
    availableSignals: [],
    currentSignals: [],
    time: Date.now(),
    currentTime: 0,
    user: {},
    views: [],
    signals: [],
    timeInterval: null,
    playInterval: null,
    currentSignalId: null,
    startDate: null,
    endDate: null,
    showMenu: false,
    isMobile: false,
  },
  mutations: {
    SET_IS_LOADING(state, value) {
      state.loading = value;
    },
    SET_LIVE(state, value) {
      state.live = value;
    },
    SET_PLAY(state, value) {
      state.play = value;
    },
    SET_RANGE(state, value) {
      state.range = value;
    },
    SET_MUTED(state, value) {
      state.muted = value;
    },
    SET_TIME(state, value) {
      state.time = value;
    },
    SET_CURRENT_TIME(state, value) {
      state.currentTime = value;
    },
    SET_CURRENT_SIGNAL_ID(state, value) {
      state.currentSignalId = value;
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
    SET_SIGNALS(state, value) {
      state.signals = value;
    },
    SET_TIME_INTERVAL(state, value) {
      state.timeInterval = value;
    },
    SET_PLAY_INTERVAL(state, value) {
      state.playInterval = value;
    },
    SET_CURRENT_SIGNALS(state, value) {
      state.currentSignals = value;
    },
    SET_START_DATE(state, value) {
      state.startDate = value;
    },
    SET_END_DATE(state, value) {
      state.endDate = value;
    },
    SET_SHOW_MENU(state, value) {
      state.showMenu = value;
    },
    SET_ISMOBILE(state, value) {
      state.isMobile = value;
    },
  },
  actions: {},
  modules: {},
});
