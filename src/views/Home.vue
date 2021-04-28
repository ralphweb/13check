<template>
<div v-bind:class="{'container-fluid app transition fadeInDown':true}" v-hammer:swipe.up="onSwipeUp" v-hammer:swipe.down="onSwipeDown">
    <div class="col fadeIn first signals">
      <signal :msg="signal.name" :class="'signal'+signal.idRating" :signal="signal" header="left" v-for="(signal,i) in signalsLeft" v-bind:key="i"/>
    </div>
    <div class="col fadeIn first signals">
      <signal :msg="signal.name" :signal="signal" header="left" v-for="(signal,j) in signalsRight" v-bind:key="j"/>
    </div>    
    <div class="col middle bg-danger fadeIn second">
      <a href="#" v-scroll-to="'#video'+signal.idRating" v-for="(signal,k) in signalsLeft" v-bind:key="k">{{signal.name}}</a>
      <a href="#" v-scroll-to="'#video'+signal.idRating" v-for="(signal,l) in signalsRight" v-bind:key="l+2">{{signal.name}}</a>
      <HistogramSlider
        style="margin: 200px auto"
        :width="400"
        :bar-height="100"
        :data="data"
        :prettify="prettify"
        :drag-interval="true"
        :force-edges="true"
        :primaryColor="'#FFFFFF'"
        :holderColor="'rgba(255,255,255,0.3)'"
        :handleColor="'#00FF00'"
        :min="minTime"
        :max="maxTime"
        :step="0.1"
        @change="sliderChanged"
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
    name: 'Home',
    components: {
        Loader,
        IOdometer,
        signal
    },
    data() {
        var today = new Date(Date.now());
        return {
            loaded: false,
            signals: [],
            current: 0,
            minTime: (new Date(today)).setHours(today.getHours()-2).valueOf(),
            maxTime: today.valueOf()
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
                that.signals = result.data;
            }).catch((err)=>{
                console.log(err);
            })
    },
    methods: {
        sliderChanged(values){
            console.log(values);
        },
        prettify(ts) {
            return moment(ts).format('HH:mm:ss:SSS')
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
                var that = this;
                if (that.$session.exists() && that.$session.get('user') != undefined) {
                    return that.$session.get('user');
                } else {
                    return null;
                }
            }
        },
        signalsLeft: {
            get() {
                var that = this;
                return that.signals.filter((signal,i)=>{
                    return i<2;
                });
            }
        },
        signalsRight: {
            get() {
                var that = this;
                return that.signals.filter((signal,i)=>{
                    return i>=2&&i<4;
                });
            }
        },
        signalsCurrent: {
            get() {
                var that = this;
                return that.signalsLeft.concat(that.signalsRight);
            }
        },
        data: {
            get() {
                var that = this;
                return [(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+30),(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+60),(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+90),(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+90),(new Date(that.minTime)).setMinutes((new Date(that.minTime)).getMinutes()+90)]
            }
        }
    },
    watch: {
      
    }
}
</script>

<style lang="scss" scoped>
$space-cadet: #2b2d42ff;
$manatee: #8d99aeff;
$manatee-light: rgb(218, 213, 213);
$alice-blue: #edf2f4ff;
$alice-blue-mid: rgb(230, 230, 230);
$imperial-red: #ef233cff;
$amaranth-red: #d90429ff;
$lablab-red: #d90429ff;
$lablab-blue: #19AAF9;
$lablab-purple: #AF56D0;
$lablab-green: #1EAF4B;

$breakpoint-tablet: 735px;

.app {
    grid-area: app;
    display: grid;
    width:100vw;
    grid-template-columns: 37% 26% 37%;
    grid-template-rows: minmax(min-content, max-content);
    grid-template-areas: "col1 middle col2";
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

      &.signals
      {
        display: flex;
        flex-direction: column;

        &:first-of-type
        {
          grid-area: col1;
        }
        &:last-of-type
        {
          grid-area: col2;
        }
      }

      &.middle
      {
        grid-area: middle;
        min-height: 80px;

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

/* UTIL */
.transition {
    transition: all 500ms ease-in-out;
}

.disabled {
    pointer-events: none;
}

textarea,
textarea:active,
select,
select:active,
input,
input:active,
button,
button:active,
button:focus {
    outline: none !important;
    box-shadow: none !important;
    resize: none;
}

.btn {
    transition: 500ms all ease-in-out;
}

.img {
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    &.rounded {
        width: 50px;
        height: 50px;
        border-radius: 70px !important;
    }

    &.big {
        width: 200px;
        height: 200px;
        border-radius: 200px !important;
    }
}

.pointer {
    cursor: pointer;
}

.lablab {
    &-bg {
        &-light {
            background: $alice-blue;
        }

        &-midlight {
            background: $alice-blue-mid;
        }

        &-mid {
            background: $manatee-light;
        }

        &-dark {
            background: $manatee;
        }

        &-darker {
            background: $space-cadet;
        }

        &-primary {
            background: $amaranth-red;
        }
    }

    &-primary {
        color: $amaranth-red;
    }

}

@-webkit-keyframes loader {
    0% {
        background-position: 0% 50%
    }

    50% {
        background-position: 100% 50%
    }

    100% {
        background-position: 0% 50%
    }
}

@-moz-keyframes loader {
    0% {
        background-position: 0% 50%
    }

    50% {
        background-position: 100% 50%
    }

    100% {
        background-position: 0% 50%
    }
}

@keyframes loader {
    0% {
        background-position: 0% 50%
    }

    50% {
        background-position: 100% 50%
    }

    100% {
        background-position: 0% 50%
    }
}
</style>