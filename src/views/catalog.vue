<template>
<div v-bind:class="{'container-fluid app transition fadeInDown':true}" ref="container" v-hammer:swipe.up="onSwipeUp" v-hammer:swipe.down="onSwipeDown">
    <multipane layout="vertical" class="w-100">
        <div :style="{ width: '70vw', minWidth: '30vw', maxWidth: '70vw' }" class="fadeIn catalog">
            <signal :ref="'signal'" :index="0" v-bind:key="i" v-for="(signal,i) in [currentSignals[0]]" header="left"/>
        </div>
        <multipane-resizer></multipane-resizer>
        <div :style="{ flexGrow: 1 }">
            Formulario
        </div>
    </multipane>
</div>
</template>

<script>
import store from "@/store";
import moment from 'moment';
import Loader from '@/components/Loader.vue';
import signal from '@/components/Signal.vue';
import { Multipane, MultipaneResizer } from 'vue-multipane';
import {
    getSignals
} from '@/helpers/API.js';

export default {
    name: 'Vistaunica',
    components: {
        Loader,
        signal,
        Multipane,
        MultipaneResizer
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
            currentTime: today.valueOf(),
            isHandlerDragging: false
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
    display: flex;
    width:100vw;
    padding: 0px;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling:touch;

    .col
    {
      height: 100%;
      padding: 0px;

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

.catalog
{
    height: 100%;
    grid-area: col1;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    align-content: stretch;
    box-sizing: border-box;
    background-color: black;
    border-right: 2px solid #AAA;
    box-shadow: 1px 0px 15px 0px rgba(0,0,0,0.7);

    .signal
    {
        height: 100%;
    }
}
</style>