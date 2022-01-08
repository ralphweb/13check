<template>
  <div v-bind:class="{ 'container-fluid app transition fadeInDown': true }">
    <div class="col fadeIn first signals">
      <signal
        :ref="'signal'"
        :index="i"
        v-bind:key="i"
        v-for="(signal, i) in signalsLeft"
        header="left"
      />
    </div>
    <div class="col fadeIn first signals">
      <signal
        :ref="'signal'"
        :index="i + 2"
        v-bind:key="i"
        v-for="(signal, i) in signalsRight"
        header="left"
      />
    </div>
    <div class="col middle fadeIn second">
      <slider :rating="true" />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import Loader from "@/components/Loader.vue";
import Slider from "@/components/Slider.vue";
import signal from "@/components/Signal.vue";
import IOdometer from "vue-odometer";
import "odometer/themes/odometer-theme-default.css";

export default {
  name: "Comparador",
  components: {
    Loader,
    Slider,
    IOdometer,
    signal,
  },
  data() {
    return {};
  },
  created() {
    var that = this;
    if (!that.$session.exists()) {
      window.location = "/login";
    }
  },
  async mounted() {
    var that = this;
    setTimeout(() => {
      that.currentSignals = [];
      for (let i = 0; i < 4; i++) {
        that.currentSignals.push(that.signals[i]);
      }
    }, 500);
    setTimeout(() => {
      that.checkAvailable();
    }, 750);

    that.$root.$on("checkAvailable", () => {
      that.checkAvailable();
    });
  },
  methods: {
    checkAvailable() {
      let that = this;
      let inUse = [];
      that.$refs.signal.forEach((signal) => {
        inUse.push(signal.currentId);
      });
      that.availableSignals = that.signals.filter((signal) => {
        return !inUse.includes(signal._id) && signal.ipServer != "";
      });
    },
  },
  computed: {
    user: {
      get() {
        let that = this;
        if (that.$session.exists() && that.$session.get("user") != undefined) {
          return that.$session.get("user");
        } else {
          return null;
        }
      },
    },
    signals: {
      get() {
        return this.$store.state.signals;
      },
    },
    signalsLeft: {
      get() {
        let that = this;
        return that.currentSignals.filter((signal, i) => {
          return i < 2;
        });
      },
    },
    signalsRight: {
      get() {
        let that = this;
        return that.currentSignals.filter((signal, i) => {
          return i >= 2 && i < 4;
        });
      },
    },
    signalsCurrent: {
      get() {
        let that = this;
        return that.signalsLeft.concat(that.signalsRight);
      },
    },
    data: {
      get() {
        let that = this;
        return [
          new Date(that.minTime).setMinutes(
            new Date(that.minTime).getMinutes() + 30
          ),
          new Date(that.minTime).setMinutes(
            new Date(that.minTime).getMinutes() + 60
          ),
          new Date(that.minTime).setMinutes(
            new Date(that.minTime).getMinutes() + 90
          ),
          new Date(that.minTime).setMinutes(
            new Date(that.minTime).getMinutes() + 90
          ),
          new Date(that.minTime).setMinutes(
            new Date(that.minTime).getMinutes() + 90
          ),
        ];
      },
    },
    availableSignals: {
      get() {
        return this.$store.state.availableSignals;
      },
      set(value) {
        this.$store.commit("SET_AVAILABLE_SIGNALS", value);
      },
    },
    currentSignals: {
      get() {
        return this.$store.state.currentSignals;
      },
      set(value) {
        this.$store.commit("SET_CURRENT_SIGNALS", value);
      },
    },
    time: {
      get() {
        return this.$store.state.time;
      },
      set(value) {
        this.$store.commit("SET_TIME", value);
      },
    },
    user: {
      get() {
        return this.$store.state.user;
      },
      set(value) {
        this.$store.commit("SET_USER", value);
      },
    },
    views: {
      get() {
        return this.$store.state.views;
      },
      set(value) {
        this.$store.commit("SET_VIEWS", value);
      },
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
$breakpoint-tablet: 735px;

.app {
  grid-area: app;
  display: grid;
  width: 100vw;
  grid-template-columns: 1fr minmax(400px, 650px) 1fr;
  grid-template-rows: minmax(min-content, max-content);
  grid-template-areas: "col1 middle col2";
  padding: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  .col {
    height: 100%;
    padding: 0px;

    &.signals {
      display: flex;
      flex-direction: column;

      &:first-of-type {
        grid-area: col1;
      }
      &:last-of-type {
        grid-area: col2;
      }
    }

    &.middle {
      grid-area: middle;
      min-height: 80px;

      @media only screen and (hover: none) and (pointer: coarse) and (orientation: portrait) {
        position: fixed;
        bottom: 0vh;
        width: 100vw;
        height: 60px;
        min-height: 60px;
        -webkit-backface-visibility: hidden;
        transform: translate3d(0, 0, 0);
      }

      @media only screen and (hover: none) and (pointer: coarse) and (orientation: landscape) {
        position: fixed;
        bottom: -60px;
        width: 100vw;
        height: 60px;
        min-height: 60px;
        -webkit-backface-visibility: hidden;
        transform: translate3d(0, 0, 0);
      }
    }
  }
}
</style>
