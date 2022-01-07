<template>
  <div
    v-bind:class="['signal', header]"
    v-if="currentSignals[index]"
    @click="currentSignalId = currentId"
  >
    <div class="signal-header">
      <div class="signal-header-logo d-flex">
        <div
          class="signal-header-logo-img d-flex align-items-center justify-content-end"
          :style="
            'background-image:url(\'' + currentSignals[index].logo + '\');'
          "
          @click="toggleAvailable"
        >
          <i
            v-bind:class="{
              'fa fa-chevron-down text-light': true,
              'fa-rotate-180': showAvailable,
            }"
            v-if="availableSignals.length"
          ></i>
        </div>
        <div
          v-bind:class="{
            'signal-header-logo-available d-flex justify-content-start': true,
            show: showAvailable,
          }"
        >
          <div
            class="signal-header-logo-img d-flex align-items-center justify-content-end"
            :style="'background-image:url(\'' + availableSignal.logo + '\');'"
            v-for="(availableSignal, av) in availableSignals"
            v-bind:key="av"
            @click="replaceSignal(av)"
          ></div>
        </div>
      </div>
      <div class="signal-header-rating" v-if="user.role.allowRating">
        <h5>Rating</h5>
        <h2 :style="'color:' + currentSignals[index].colorBorde">N/A</h2>
      </div>
      <div class="signal-header-share" v-if="user.role.allowRating">
        <h5>Share</h5>
        <h2 :style="'color:' + currentSignals[index].colorBorde">N/A</h2>
      </div>
    </div>
    <div class="signal-player">
      <div class="icon-active" v-if="isCurrent">
        <i class="fa fa-volume-up"></i>
      </div>
      <video-player
        :options="videoOptions"
        :muted="!isCurrent"
        :globalmuted="muted"
        :ip="currentSignals[index].ipServer"
        :time="currentTime"
        :live="live"
      />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import VideoPlayer from "@/components/VideoPlayer.vue";
import "video.js/dist/video-js.css";

export default {
  name: "signal",
  components: {
    VideoPlayer,
  },
  data() {
    return {
      currentId: null,
      showAvailable: false,
      videoOptions: {
        // videojs and plugin options
        height: "1080",
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
        },
      },
    };
  },
  props: {
    header: String,
    index: Number,
  },
  mounted() {
    var that = this;
    try {
      setTimeout(() => {
        that.currentId = that.currentSignals[that.index]._id;
      }, 750);
    } catch (err) {
      console.log("Signal error:", err);
    }
  },
  computed: {
    isCurrent: {
      get() {
        var that = this;
        return that.currentSignalId == that.currentId;
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
    currentSignalId: {
      get() {
        return this.$store.state.currentSignalId;
      },
      set(value) {
        this.$store.commit("SET_CURRENT_SIGNAL_ID", value);
      },
    },
    currentTime: {
      get() {
        return this.$store.state.currentTime;
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
    live: {
      get() {
        return this.$store.state.live;
      },
    },
    muted: {
      get() {
        return this.$store.state.muted;
      },
    },
  },
  methods: {
    replaceSignal(av) {
      var that = this;
      let nextSignal = that.availableSignals[av];
      let oldSignal = that.currentSignals[that.index];
      that.currentSignals[that.index] = nextSignal;
      that.currentId = nextSignal._id;
      that.$root.$emit("checkAvailable");
      that.showAvailable = false;
    },
    toggleAvailable() {
      var that = this;
      that.showAvailable = !that.showAvailable;
    },
    prettify(ts) {
      return moment(ts).format("HH:mm:ss.SSS");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.signal {
  display: flex;
  flex-direction: column;
  position: relative;

  &.current {
    border: 1px solid red;
  }

  &-header {
    grid-area: head;
    flex: 1 1 100%;
    min-height: 80px;
    max-height: 80px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 34% 33% 33%;
    background: #050505;
    z-index: 9;

    &-logo {
      &-img {
        background-size: 40px;
        background-position: center center;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
      }

      &-available {
        position: absolute;
        width: 100%;
        height: 80px;
        background-color: rgba(0, 0, 0, 0.8);
        overflow-x: auto;
        flex-wrap: nowrap;
        pointer-events: none;
        opacity: 0;
        top: 60px;
        transition: all 500ms ease-in-out;
        z-index: 8;

        &.show {
          top: 80px;
          opacity: 1;
          pointer-events: all;
        }

        .signal-header-logo-img {
          min-width: 80px;
        }
      }
    }

    &-rating,
    &-share {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      h5 {
        margin: 0;
        font-size: 8pt;
        font-weight: 200;
        color: white;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      h2 {
        margin: 0;
        font-size: 12pt;
        font-weight: 200;
        color: white;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    }
  }

  &-player {
    grid-area: player;
    flex: 0 0 auto;
    display: grid;
    color: white;
    background-color: black;
    aspect-ratio: 16 / 9;
    position: relative;

    .icon-active {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 9;
      text-shadow: 2px 2px 2px black;
    }
  }
}
</style>
