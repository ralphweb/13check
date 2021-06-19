<template>
<div v-bind:class="{'container-fluid app transition fadeInDown':true}" v-hammer:swipe.up="onSwipeUp" v-hammer:swipe.down="onSwipeDown">
    <div class="col fadeIn single">
      <signal :ref="'signal'" :index="0" v-bind:key="i" v-for="(signal,i) in [currentSignals[0]]" header="left"/>
    </div>
    <div class="col middle fadeIn second">
      <HistogramSlider
        style="margin: 200px auto"
        :bar-height="100"
        :data="data"
        :type="'single'"
        :prettify="prettify"
        :drag-interval="true"
        :force-edges="true"
        :primaryColor="'#FFFFFF'"
        :holderColor="'rgba(255,255,255,0.3)'"
        :handleColor="'#00FF00'"
        :min="minTime"
        :max="maxTime"
        :step="0.1"
        :value="time"
        @change="sliderChanged"
        v-if="user.role.allowRating"
    />
    </div>
</div>
</template>

<script>
import store from "@/store";
import moment from 'moment';
import Loader from '@/components/Loader.vue';
import signal from '@/components/Signal.vue';
import {
    getSignals
} from '@/helpers/API.js';
import IOdometer from 'vue-odometer';
import 'odometer/themes/odometer-theme-default.css';

export default {
    name: 'Vistaunica',
    components: {
        Loader,
        IOdometer,
        signal
    },
    data() {
        var that = this;
        var today = new Date(Date.now());
        setInterval(()=>{
            that.time = new Date(Date.now()).valueOf();
            that.maxTime = that.time;
        },1000);
        return {
            loaded: false,
            signals: [],
            minTime: (new Date(today)).setHours(today.getHours()-2).valueOf(),
            maxTime: today.valueOf(),
            currentTime: today.valueOf()
        }
    },
    created() {
        var that = this;
        if (!that.$session.exists()) {
            window.location = "/login";
        }
    },
    async mounted() {
        var that = this;
        getSignals()
            .then((result)=>{
                that.signals = that.processSignals(result.data);
                that.currentSignals = [];
                for(let i=0;i<4;i++) {
                    that.currentSignals.push(that.signals[i]);
                }
                setTimeout(()=>{
                    that.checkAvailable();
                },500)
            }).catch((err)=>{
                console.log(err);
            })
        console.log(that.$refs);
    },
    methods: {
        checkAvailable() {
            let that = this;
            let inUse = [];
            that.$refs.signal.forEach((signal)=>{
                inUse.push(signal.currentId);
            })
            that.availableSignals = that.signals.filter((signal)=>{
                return !inUse.includes(signal._id)&&signal.ipServer!="";
            })
        },
        processSignals(data) {
            return data.map((signal)=>{
                    let newSignal = signal;
                    if(signal.logo.indexOf("\\")!=-1) {
                        let logoBits = signal.logo.split("\\");
                        newSignal.logo = logoBits.join("/");
                    }
                    return newSignal;
                });
        },
        sliderChanged(values){
            console.log(values);
        },
        prettify(ts) {
            return moment(ts).format('YYYY-MM-DD HH:mm:ss.SSS');
        },
        onSwipeUp() {
            var that = this;
            that.current = that.current-1>=0?that.current-1:that.signalsCurrent.length-1;
            that.$scrollTo(".signal:nth-of-type("+that.current+")");
            that.$scrollTo("#video"+that.signalsCurrent[that.current].idRating);
        },
        onSwipeDown() {
            var that = this;
            that.current = that.current+1<that.signalsCurrent.length?that.current+1:0;
            that.$scrollTo("#video"+that.signalsCurrent[that.current].idRating);
        }
    },
    computed: {
        user: {
            get() {
                let that = this;
                if (that.$session.exists() && that.$session.get('user') != undefined) {
                    return that.$session.get('user');
                } else {
                    return null;
                }
            }
        },
        signalsLeft: {
            get() {
                let that = this;
                return that.currentSignals.filter((signal,i)=>{
                    return i<2;
                });
            }
        },
        signalsRight: {
            get() {
                let that = this;
                return that.currentSignals.filter((signal,i)=>{
                    return i>=2&&i<4;
                });
            }
        },
        signalsCurrent: {
            get() {
                let that = this;
                return that.signalsLeft.concat(that.signalsRight);
            }
        },
        data: {
            get() {
                let that = this;
                return [(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+30),(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+60),(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+90),(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+90),(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+90)]
            }
        },
        availableSignals: {
            get() {
                return this.$store.state.availableSignals;
            },
            set(value) {
                this.$store.commit('SET_AVAILABLE_SIGNALS', value);
            }
        },
        currentSignals: {
            get() {
                return this.$store.state.currentSignals;
            },
            set(value) {
                this.$store.commit('SET_CURRENT_SIGNALS', value);
            }
        },
        time: {
            get() {
                return this.$store.state.time;
            },
            set(value) {
                this.$store.commit('SET_TIME', value);
            }
        },
        user: {
            get() {
                return this.$store.state.user;
            },
            set(value) {
                this.$store.commit('SET_USER', value);
            }
        },
        views: {
            get() {
                return this.$store.state.views;
            },
            set(value) {
                this.$store.commit('SET_VIEWS', value);
            }
        }
    },
    watch: {
      
    }
}
</script>

<style lang="scss" scoped>
$breakpoint-tablet: 735px;

.app {
    grid-area: app;
    display: grid;
    grid-template-columns: 1fr minmax(150px, 25%);
    grid-template-rows: 1fr;
    grid-template-areas: "col1 middle";
    width:100vw;
    padding: 0px;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling:touch;

    @media only screen and (hover: none) and (pointer: coarse) and (orientation:landscape) {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(min-content, max-content) minmax(min-content, max-content) 1fr;
      grid-template-areas: "col1" 
                        "col2";
      margin-bottom: 0px;
      height: 100vh;
      overflow: hidden;
    }

    @media only screen and (hover: none) and (pointer: coarse) and (orientation:portrait) {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(min-content, max-content);
      grid-template-areas: "col1"
                          "col2";
      margin-bottom: 60px;
    }

    .col
    {
      height: 100%;
      padding: 0px;

      &.single
      {
          width: auto;
          height: 100%;
          grid-area: col1;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          align-content: stretch;
          flex-basis: 90%;

          .signal
          {
              height: 100%;
          }
      }

      &.middle
      {
        grid-area: middle;
        min-height: 80px;
        overflow-x: auto;
        flex:1 1 auto;

        @media only screen and (hover: none) and (pointer: coarse) and (orientation:portrait) {
          position: fixed;
          bottom:0vh;
          width:100vw;
          height: 60px;
          min-height: 60px;
          -webkit-backface-visibility: hidden;
          transform: translate3d(0,0,0);
        }

        @media only screen and (hover: none) and (pointer: coarse) and (orientation:landscape) {
          position: fixed;
          bottom:-60px;
          width:100vw;
          height: 60px;
          min-height: 60px;
          -webkit-backface-visibility: hidden; 
          transform: translate3d(0,0,0);
        }
      }
    }
}
</style>