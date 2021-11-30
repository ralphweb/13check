<template>
<div v-bind:class="{'container-fluid app transition fadeInDown':true}">
    <div class="rows fadeIn first main">
        <signal :ref="'signal'" :index="i" v-bind:key="i" v-for="(signal,i) in signalsLeft" header="left"/>
        <slider :rating="true"/>
    </div>
    <div class="rows fadeIn second signals">
      <signal :ref="'signal'" :index="i+1" v-bind:key="i" v-for="(signal,i) in signalsRight" header="left"/>
    </div>
</div>
</template>

<script>
import store from "@/store";
import moment from 'moment';
import Loader from '@/components/Loader.vue';
import Slider from '@/components/Slider.vue';
import signal from '@/components/Signal.vue';
import IOdometer from 'vue-odometer';
import 'odometer/themes/odometer-theme-default.css';

export default {
    name: 'Todas',
    components: {
        Loader,
        Slider,
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
        setTimeout(()=>{   
            that.currentSignals = [];
            for(let i=0;i<that.signals.length;i++) {
                that.currentSignals.push(that.signals[i]);
            }
        },500)
        setTimeout(()=>{            
            that.checkAvailable();
        },750)

        that.$root.$on('checkAvailable', () => {
            that.checkAvailable();
        });
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
        signals: {
            get() {
                return this.$store.state.signals;
            }
        },
        signalsLeft: {
            get() {
                let that = this;
                return that.currentSignals.filter((signal,i)=>{
                    return i<1;
                });
            }
        },
        signalsRight: {
            get() {
                let that = this;
                return that.currentSignals.filter((signal,i)=>{
                    return i>=1;
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
    flex-direction: column;
    width:100vw;
    padding: 0px;
    overflow-y: auto !important;
    overflow-x: hidden;
    -webkit-overflow-scrolling:touch;

    .rows
    {
        width: 100%;
        position: relative;
        --bs-gutter-x: 0rem;

        &.main
        {
            flex-basis: auto;
            flex-grow: 1;
            flex-shrink: 1;
            overflow-x: hidden;
            overflow-y: auto;
            display: flex;

            .signal
            {
                height: 100%;
                width: auto;
                aspect-ratio: 16/10.15;
            }
        }

        &.signals
        {

            width: 100vw;
            height: 300px;
            max-height: 300px;
            display:flex;
            overflow-x: auto;
            overflow-y: hidden;
            flex-wrap: nowrap;
            background-color: black;
            flex-basis: 300px;
            flex-grow: 1;
            flex-shrink: 0;

            .signal
            {
                height: 100% !important;
                min-width: 20%;
                width: auto;
                margin: 0px;
                padding-left: 0px;
                padding-right: 0px;
            }
        }
    }
}
</style>