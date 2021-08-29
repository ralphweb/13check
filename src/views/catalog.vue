<template>
<div v-bind:class="{'container-fluid app transition fadeInDown':true}" ref="container">
    <multipane layout="vertical" class="w-100">
        <div :style="{ width: '70vw', minWidth: '30vw', maxWidth: '70vw' }" class="fadeIn catalog">
            <signal :ref="'signal'" :index="0" v-bind:key="i" v-for="(signal,i) in [currentSignals[0]]" header="left"/>
            <slider/>
        </div>
        <multipane-resizer></multipane-resizer>
        <div :style="{ flexGrow: 1 }" class="p-4 overflow-auto">
            <b-form @submit="onSubmit">
                <b-row>
                    <b-col class="dynamic">
                        <b-form-group
                            id="input-group-1"
                            label="Email address:"
                            label-for="input-1"
                            description="We'll never share your email with anyone else."
                        >
                            <b-form-input
                            id="input-1"
                            type="email"
                            placeholder="Enter email"
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
                            <b-form-input
                            id="input-2"
                            placeholder="Enter name"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col class="dynamic">
                        <b-form-group :id="'input-group-crud'+c" :label="crud.name" :label-for="'input-crud'+c" v-for="(crud,c) in cruds" v-bind:key="c">
                            <v-select :name="'input-crud'+c" :id="'input-crud'+c" :filterable="false" :taggable="true" :multiple="crud.multiple" v-model="form[crud.slug.toLowerCase()]" :label="crud.label" :options="crud.data" @search="crud.onSearch">
                                <template slot="no-options">
                                Escribe para buscar {{crud.name}}
                                </template>
                            </v-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="12">
                        <b-form-group id="input-group-4" v-slot="{ ariaDescribedby }">
                            <b-form-checkbox-group
                            v-model="form.checked"
                            id="checkboxes-4"
                            :aria-describedby="ariaDescribedby"
                            >
                            <b-form-checkbox value="me">Check me out</b-form-checkbox>
                            <b-form-checkbox value="that">Check that out</b-form-checkbox>
                            </b-form-checkbox-group>
                        </b-form-group>

                        <b-button type="submit" variant="primary">Submit</b-button>
                        <b-button type="reset" variant="danger">Reset</b-button>
                    </b-col>
                </b-row>
            </b-form>
        </div>
    </multipane>
</div>
</template>

<script>
import store from "@/store";
import moment from 'moment';
import Slider from '@/components/Slider.vue';
import Loader from '@/components/Loader.vue';
import signal from '@/components/Signal.vue';
import { Multipane, MultipaneResizer } from 'vue-multipane';
import {
    searchCountry,
    searchPerson,
    searchShow,
    searchTopic,
    searchAge,
    searchCategory,
    getCatalog,
    createCatalog,
    updateCatalog,
} from '@/helpers/API.js';

export default {
    name: 'Vistaunica',
    components: {
        Loader,
        signal,
        Multipane,
        MultipaneResizer,
        Slider
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
            countries: [],
            minTime: (new Date(today)).setHours(today.getHours()-2).valueOf(),
            maxTime: today.valueOf(),
            currentTime: today.valueOf(),
            isHandlerDragging: false,
            form: {
            },
            options: [],
            API:{
                searchCountry,
                searchPerson,
                searchShow,
                searchTopic,
                searchAge,
                searchCategory,
            },
            cruds: [
                {
                    name:"Países",
                    slug:"Country",
                    label:"country_name",
                    data:[],
                    onSearch(search, loading) {
                        that.onSearch(search,loading,"Country");
                    },
                },
                {
                    name:"Rostros",
                    slug:"Person",
                    label:"name",
                    multiple:true,
                    data:[],
                    onSearch(search, loading) {
                        that.onSearch(search,loading,"Person");
                    },
                },
                {
                    name:"Programas",
                    slug:"Show",
                    label:"name",
                    data:[],
                    onSearch(search, loading) {
                        that.onSearch(search,loading,"Show");
                    },
                },
                {
                    name:"Temas",
                    slug:"Topic",
                    label:"name",
                    data:[],
                    onSearch(search, loading) {
                        that.onSearch(search,loading,"Topic");
                    },
                },
                {
                    name:"Clasificaciones de Edad",
                    slug:"Age",
                    label:"name",
                    data:[],
                    onSearch(search, loading) {
                        that.onSearch(search,loading,"Age");
                    },
                },
                {
                    name:"Categorías",
                    slug:"Category",
                    label:"name",
                    data:[],
                    onSearch: (search, loading) => {
                        that.onSearch(search,loading,"Category");
                    },
                },
            ],
        }
    },
    async created() {
        var that = this;
        if (!that.$session.exists()) {
            window.location = "/login";
        }

        if(that.$route.params.hasOwnProperty("id")&&that.$route.params.id!=undefined) {
            let result = await getCatalog(that.$route.params.id);
            that.form = result.data;
        }
    },
    async mounted() {
        var that = this;
        setTimeout(()=>{
            that.currentSignals = [];
            that.currentSignals.push(that.signals[0]);
        },500)
        setTimeout(()=>{
            that.checkAvailable();
        },750)
        that.form.user = that.user;

        that.$root.$on('checkAvailable', () => {
            that.checkAvailable();
        });
    },
    methods: {
        onSubmit(event) {
            var that = this;
            event.preventDefault()
            if(that.$route.params.id!=undefined) {
                updateCatalog(that.$route.params.id,that.form)
                    .then((result)=>{
                        console.log(result.data);
                        that.$router.push("/catalogo/"+result.data._id);
                    }).catch((err)=>{
                        console.log(err);
                    })
            } else {
                createCatalog(that.form)
                    .then((result)=>{
                        console.log(result.data);
                        that.$router.push("/catalogo/"+result.data._id);
                    }).catch((err)=>{
                        console.log(err);
                    })
            }
        },
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
        async onSearch(search,loading,slug) {
            var that = this;
            if(search.length) {
                loading(true);
                let family = that.cruds.find((crud)=>{
                    return crud.slug == slug;
                })
                that.API["search"+slug](search)
                    .then((res)=>{                                    
                        family.data = res.data;
                        loading(false);
                    }).catch((err)=>{
                        console.log(err);
                    })
            }
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

      .form-group
        {
            color: white;
            text-align: left;
        }

      &.dynamic
      {
        min-width: 16vw;
        margin: 0px 10px;
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