<template>
  <div v-bind:class="{'container pt-4 mt-4 px-4':true,'d-flex flex-column':range}" @keydown.left="sliderKeyLeft" @keydown.right="sliderKeyRight"  @keyup.space="play!=play">
    <div class="row">
      <div class="rating transition" v-if="user.role.allowRating&&rating!=false">
          <div class="ratingChartEnclosure transition">
              <canvas id="ratingChart"></canvas>
          </div>
          <div id="chartjs-legend" class="noselect"></div>
          <div class="ratingControl transition p-4">
              <div class="form-group transition">Mostrar: 
                  <select id="ratingRange">
                      <option value="15@minutes" selected="selected">Los últimos 15 minutos</option>
                      <option value="1@hours">La última hora</option>
                      <option value="24@hours">Las últimas 24 horas</option>
                      <option value="7@days">Los últimos 7 días</option>
                      <option value="30@days">Los últimos 30 días</option>
                  </select>
              </div>
              <div class="form-group transition">Por: 
                  <select id="ratingUnit">
                      <option value="minute" selected="selected">Minuto</option>
                      <option value="hour">Hora</option>
                      <option value="day">Día</option>
                  </select>
              </div>
          </div>
      </div>
    </div>
    <div class="row">
      <div v-bind:class="{'transition text-light overflow-hidden text-nowrap datetime':true,'p-0 col-0':!range,'col-2':range}" @click="openStartDatepicker=true">
        <div class="date">
          <p>{{prettifyTooltip(startTime,'DD-MM-YYYY')}}</p>
        </div>
        <div class="time">
          <strong>{{prettifyTooltip(startTime,'HH:mm:ss')}}</strong><small>.{{prettifyTooltip(startTime,'SSS')}}</small>
        </div>
        <date-picker 
          class="invisible h-0" 
          v-model="startDate" 
          type="datetime" 
          format="DD-MM-YYYY HH:mm:ss.SSS" 
          time-title-format="DD-MM-YYYY HH:mm:ss"
          :open.sync="openStartDatepicker"
          :show-time-header="true"
          :disabled-date="(date) => date > new Date(endDate)"
          :confirm="true"
        ></date-picker>
      </div>
      <div v-bind:class="{'transition d-flex align-items-center':true,'col-10':!range,'col-8':range}">
        <vue-slider 
          v-model="sliderValue" 
          contained="true" 
          width="100%"
          :min="0" 
          :max="100" 
          :interval="0.001"
          :enable-cross="false" 
          :tooltip="'hover'" 
          :tooltip-formatter="prettifyTooltip" 
          :silent="true" 
          :dragOnClick="true"
          @change="sliderChanged" 
          @dragging="sliderDragging" 
          @drag-start="sliderDragStart" 
        >
          <template v-slot:dot="{ focus }">
            <div :class="['custom-dot', { focus }]"></div>
          </template>
        </vue-slider>
      </div>
      <div v-bind:class="{'transition text-light overflow-hidden text-nowrap col-2 datetime':true}" @click="openEndDatepicker=true">
        <div class="date">
          <p>{{prettifyTooltip(endTime,'DD-MM-YYYY')}}</p>
        </div>
        <div class="time">
          <strong>{{prettifyTooltip(endTime,'HH:mm:ss')}}</strong><small>.{{prettifyTooltip(endTime,'SSS')}}</small>
        </div>
        <date-picker 
          class="invisible h-0" 
          popup-class="popup"
          v-model="endDate" 
          type="datetime" 
          format="DD-MM-YYYY HH:mm:ss.SSS" 
          time-title-format="DD-MM-YYYY HH:mm:ss"
          :open.sync="openEndDatepicker"
          :show-time-header="true"
          :disabled-date="(date) => date >= new Date()"
          :confirm="true"
        ></date-picker>
      </div>
    </div>
    <div class="row d-flex flex-row justify-content-around">
      <div class="btn-group col-12 mt-2" role="group" aria-label="toolbar">
        <button type="button" v-bind:class="{'btn d-flex flex-column align-items-center justify-content-center':true,'btn-secondary':!range,'btn-primary':range}" @click="range=!range" v-if="!range&&crop!=false"><i class="fa fa-2x fa-cut"></i><small>Cortar clip</small></button>
        <button type="button" v-bind:class="{'btn d-flex flex-column align-items-center justify-content-center':true,'btn-secondary':!range,'btn-info':range}" @click="zoomOut" v-if="range"><i class="fas fa-2x fa-search-minus"></i><small>Alejar</small></button>
        <button type="button" v-bind:class="{'btn d-flex flex-column align-items-center justify-content-center':true,'btn-secondary':!range,'btn-info':range}" @click="zoomIn" v-if="range"><i class="fas fa-2x fa-search-plus"></i><small>Acercar</small></button>
        <button type="button" v-bind:class="{'btn d-flex flex-column align-items-center justify-content-center':true,'btn-secondary':!play,'btn-primary':play}" @click="play=!play"><i class="fa fa-2x fa-play" v-if="!play"></i><small v-if="!play">Play</small><i class="fa fa-2x fa-pause" v-if="play"></i><small v-if="play">Pausar</small></button>
        <button type="button" v-bind:class="{'btn d-flex flex-column align-items-center justify-content-center':true,'btn-secondary':!live,'btn-primary disabled':live}" @click="goLive"><i class="fas fa-2x fa-broadcast-tower"></i><small>En vivo</small></button>
      </div>
      <div class="btn-group col-12 mt-2" role="group" aria-label="toolbar" v-if="range">
        <button type="button" v-bind:class="{'btn d-flex flex-column align-items-center justify-content-center':true,'btn-secondary':!range,'btn-danger':range}" @click="range=!range"><i class="fa fa-2x fa-times"></i><small>Cancelar</small></button>
        <button type="button" v-bind:class="{'btn d-flex flex-column align-items-center justify-content-center disabled':true}" disabled></button>
        <button type="button" v-bind:class="{'btn d-flex flex-column align-items-center justify-content-center btn-secondary':true}" @click="exportCrop" :style="'background-color:'+currentSignal.colorBorde+';border-color:'+currentSignal.colorBorde" v-if="currentSignal"><i class="fa fa-2x fa-cut"></i><small>Cortar clip</small></button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/es';
import { sendCrop } from '@/helpers/API.js';

export default {
  name: 'slider',
  components: { DatePicker },
  data() {
    return {
        minTime: 0,
        maxTime: 100,
        startTime: 0,
        playTime: 0,
        endTime: 100,
        range: false,
        openStartDatepicker: false,
        openEndDatepicker: false,
        tick: 1000, 
    }
  },
  props: {
    header: String,
    index: Number,
    rating: Boolean,
    crop: Boolean
  },
  mounted() {
    let that = this;
    clearInterval(that.timeInterval);
    that.timeInterval = null;
    that.timeInterval = setInterval(that.updateTime,1000);
    that.updateTime();
  },
  computed: {
    live: {
        get() {
            return this.$store.state.live;
        },
        set(value) {
            this.$store.commit('SET_LIVE', value);
        }
    },
    play: {
        get() {
            return this.$store.state.play;
        },
        set(value) {
            this.$store.commit('SET_PLAY', value);
        }
    },
    currentTime: {
        get() {
            return this.$store.state.currentTime;
        },
        set(value) {
            this.$store.commit('SET_CURRENT_TIME', value);
        }
    },
    startDate: {
        get() {
            return this.$store.state.startDate;
        },
        set(value) {
            this.$store.commit('SET_START_DATE', value);
        }
    },
    endDate: {
        get() {
            return this.$store.state.endDate;
        },
        set(value) {
            this.$store.commit('SET_END_DATE', value);
        }
    },
    timeInterval: {
        get() {
            return this.$store.state.timeInterval;
        },
        set(value) {
            this.$store.commit('SET_TIME_INTERVAL', value);
        }
    },
    sliderValue: {
      get() {
        let that = this;
        if(that.range) {
          if(that.play)
            return [that.startTime,that.playTime,that.endTime];
          else
            return [that.startTime,that.endTime];
        } else
          return that.endTime;
      },
      set(value) {
        let that = this;
        if(that.range) {
          if(that.play)
            [that.startTime,that.playTime,that.endTime] = value;
          else
            [that.startTime,that.endTime] = value;
        } else
          that.endTime = value;
      }
    },
    timelineLength: {
      get() {
        return (this.maxTime-this.minTime)/this.tick;
      }
    },
    user: {
        get() {
            return this.$store.state.user;
        }
    },
    currentSignalId: {
        get() {
            return this.$store.state.currentSignalId;
        }
    },
    signals: {
        get() {
            return this.$store.state.signals;
        }
    },
    currentSignal: {
      get() {
        let that = this;
        if(!that.currentSignalId) {
          return null;
        } else {
          return that.signals.find((signal)=>{
            return signal._id == that.currentSignalId;
          })
        }
      }
    }
  },
  methods: {
    sliderChanged(values,index){
        var that = this;
        that.live = false;
        if(that.range) 
          that.currentTime = that.minTime+(that.maxTime-that.minTime)*values[index]/100;
        else
          that.currentTime = that.minTime+(that.maxTime-that.minTime)*values/100;
    },
    sliderDragging(value,index){
        var that = this;
        that.play = false;
        if(that.range&&index==0) {
          //dragging left
          if(that.startTime==0) {
            that.minTime -= 10000;
            that.maxTime -= 10000;
          }
        }
        if(that.range&&index==(that.sliderValue.length-1)) {
          //dragging right
          if(that.endTime==100&&that.maxTime<new Date(Date.now()).valueOf()) {
            that.minTime += 10000;
            that.maxTime += 10000;
          }
        }
        if(!that.range&&index==0) {
          //dragging left
          if(that.endTime==0) {
            that.minTime -= 10000;
            that.maxTime -= 10000;
          }
          //dragging right
          if(that.endTime==100&&that.maxTime<new Date(Date.now()).valueOf()) {
            that.minTime += 10000;
            that.maxTime += 10000;
          } else if(that.endTime==100&&that.maxTime>=new Date(Date.now()).valueOf()) {
            that.live = true;
          }
        }

        if(that.range) 
          that.currentTime = that.minTime+(that.maxTime-that.minTime)*value[index]/100;
        else
          that.currentTime = that.minTime+(that.maxTime-that.minTime)*value/100;
    },
    sliderDragStart(index){
        var that = this;
        that.play = false;
        if(that.range) 
          that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue[index]/100;
        else
          that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue/100;
    },
    sliderKeyLeft(e) {
      let that = this;
      console.log('key-left',e.target.nextElementSibling,that.range);
    },
    sliderKeyRight(e) {
      let that = this;
      console.log('key-right',e.target.nextElementSibling,that.range);
    },
    prettify(ts) {
        return moment(ts).format('HH:mm:ss.SSS');
    },
    prettifyTooltip(value,format = 'HH:mm:ss.SSS') {
      let that = this;
      return moment(that.minTime+(that.maxTime-that.minTime)*value/100).format(format);
    },
    updateTime() {
      let that = this;
      if(that.live) {
        that.maxTime = new Date(Date.now()).valueOf();
        if(that.endDate==null) that.endDate = moment(that.maxTime).format("DD-MM-YYYY HH:mm:ss.SSS");
        that.minTime = (new Date(Date.now())).setHours(new Date(Date.now()).getHours()-2).valueOf();
        if(that.startDate==null) that.startDate = moment(that.minTime).format("DD-MM-YYYY HH:mm:ss.SSS");
        if(that.range) 
          that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue[that.sliderValue.length-1]/100;
        else
          that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue/100;
      }
    },
    zoomIn() {
      let that = this;
      if(that.range) {
        that.minTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue[0]/100;
        that.maxTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue[that.sliderValue.length-1]/100;
        that.startTime = 0;
        that.endTime = 100;
      }
    },
    zoomOut() {
      let that = this;
      if(that.range) {
        let delta = 360000;
        let percent = delta/(that.maxTime-that.minTime);
        that.minTime = that.minTime-delta;
        that.maxTime = that.maxTime+delta;
        that.startTime = 0+percent*100;
        that.endTime = 100-percent*100;
      }
    },
    exportCrop() {
      let that = this;
      alert(that.currentSignal.name);
      var body = {
          "author_id": that.user._id,
          "author":that.user.email,
          "signal":that.currentSignal._id,
          "ipServer":that.currentSignal.ipServer,
          "dateini": that.prettifyTooltip(that.startTime,'YYYY-MM-DD_HH-mm-ss'),
          "dateend": that.prettifyTooltip(that.endTime,'YYYY-MM-DD_HH-mm-ss'),
      }
      console.log(body);
      sendCrop(body)
        .then((result)=>{
          console.log(result);
          store.commit('SET_IS_LOADING', false);
        }).catch((err)=>{
          console.log(err);
          alert("Error en crop");
          store.commit('SET_IS_LOADING', false);
        })
    },
    goLive() {
      let that = this;
      that.live=true;
      that.$router.go();
    }
  },
  watch: {
    live: {
      immediate: true,
      handler(newVal) {
        var that = this;
        if(newVal&&that.timeInterval==null) {
          that.range = false;
          that.sliderValue = 100;
          that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue/100;
          that.updateTime();
          that.timeInterval = setInterval(that.updateTime,1000);
        } else if(!newVal) {
          clearInterval(that.timeInterval);
          that.timeInterval = null;
        }
      }
    },
    range: {
      immediate: true,
      handler(newVal) {
        var that = this;
        if(newVal) {
          that.live = false;
          that.play = false;
        }
      }
    },
    play: {
      immediate: true,
      handler(newVal) {
        var that = this;
        if(!newVal) {
          that.live = false;
          if(that.timeInterval!=null) {
            clearInterval(that.timeInterval);
            that.timeInterval = null;
          }
        } else {
          if(!that.range&&that.endTime==100) {
            that.live = true;
          }
          if(that.range) {
            that.timeInterval = setInterval(()=>{
              let deltaOneSecond = 100/that.timelineLength;
              that.playTime = that.playTime + deltaOneSecond;
              that.$set(that.sliderValue,1,that.playTime);
              if(that.playTime>=that.endTime) {
                that.play = false;
              }
              that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue[1]/100;
            },that.tick)
          } else if(!that.live) {
            that.timeInterval = setInterval(()=>{
              let deltaOneSecond = 100/that.timelineLength;
              that.endTime = that.endTime + deltaOneSecond;
              /*
              if(that.endTime>=100&&that.maxTime<=(new Date()).valueOf()-10000) {
                that.maxTime = that.maxTime+10000;
                that.endTime = 90;
              } else if(that.endTime>=100&&that.maxTime>=(new Date()).valueOf()) {
                that.play = false;
                that.endTime = 100;
              }
              */
              if(that.endTime>=100) {
                that.play = false;
                that.endTime = 100;
              }
              that.sliderValue = that.endTime>100?100:that.endTime;
              that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue/100;
            },that.tick)
          }
        }
      }
    },
    endDate: {
        handler(value) {
            let that = this;
            that.live = false;
            if(that.range) {
              that.endTime = 100;
              that.maxTime = (new Date(value)).valueOf();
              that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue[that.sliderValue.length-1]/100;
            } else {
              that.endTime = 0;
              that.minTime = (new Date(value)).valueOf();
              that.maxTime = (new Date(value)).setHours(new Date(value).getHours()+2).valueOf();
              that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue/100;
            }

            if(that.range&&(new Date(value)).valueOf()<=that.minTime+(that.maxTime-that.minTime)*that.sliderValue[0]/100) that.startDate = moment(new Date(value)).subtract({ hours: 1 });
        }
    },
    startDate: {
        handler(value) {
            let that = this;
            that.live = false;
            if(that.range) {
              that.startTime = 0;
              that.minTime = (new Date(value)).valueOf();
              that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue[that.sliderValue.length-1]/100;
            } else {
              that.currentTime = that.minTime+(that.maxTime-that.minTime)*that.sliderValue/100;
            }

            if(that.range&&(new Date(value)).valueOf()>that.minTime+(that.maxTime-that.minTime)*that.sliderValue[that.sliderValue.length-1]/100) that.endDate = moment(new Date(value)).add({ hours: 1 });
        }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.custom-dot {
  width: 100%;
  height: 100%;
  border-radius: 0;
  background-color: pink;
  transition: all .3s;
}
.custom-dot:hover {
  transform: rotateZ(45deg);
}
.custom-dot.focus {
  border-radius: 50%;
}

.vue-slider-dot:first-of-type .vue-slider-dot-tooltip-inner
{
  background-color: #F86423 !important;
}

.vue-slider-dot:last-of-type .vue-slider-dot-tooltip-inner
{
  background-color: #F86423 !important;
}

.btn-primary
{
  background-color: #F86423 !important;
  border-color: #F86423 !important;
}

.col-0
{
  width: 0% !important;
  flex-basis: 0% !important;
  max-width: 0% !important;
}

.transition
{
  transition: all 500ms ease-in-out;
}

.datetime
{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover
  {
    color: #F86423 !important;
  }

  .date
  {
    p
    {
      padding: 0px;
      margin: 0px;
      font-size: 11pt;
    }
  }

  .time
  {
    strong
    {
      font-size: 14pt;
    }
    small
    {
      font-size: 10pt;
    }
  }
}

.h-0
{
  height: 0px !important;
}

.popup {
    margin-left: -100px;
}

.disabled
{
  opacity: 0.3;
}

$color-dark: #050505;
$color-darker: #101010;
$color-middark: #151515;

.rating
    {
        width: 100%;
        height: 45vh;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: flex-end;
        justify-content: center;
        background-color: $color-darker;
        order: 0;

        @media (max-width: 769px) {
            max-width: 100vw;
            width: 100vw;
            height: 49vh;
        } 

        .ratingChartEnclosure {
            width: 80%;
            max-height: 49vh;
            flex-grow: 1;
            display: flex;
            align-items: center;
            padding: 10px;
            position: relative;
        }

        #chartjs-legend {
            position:relative;
            width:20%;
            padding: 10px;
            display: flex;
            align-items: center;
            max-height: 40vh;
            flex-grow: 1;

            @media (max-width: 769px) {
                align-items: flex-start;
                max-height: 39vh;
                overflow-y: auto;
            }

            tr:first-of-type
            {
                position: absolute;
                top: 2vh;

                @media (max-width: 769px) {
                    position: relative;
                    border-bottom: 20px solid #101010;
                }
            }

            .chart-legend {
                width: 20px;
                height: 20px;
                background-size: contain;
                background-position: center center;
                background-repeat: no-repeat;

                tr
                {
                    cursor: pointer;

                    &.deactivated
                    {
                        opacity: 0.3;
                    }

                    &.active td
                    {
                        font-weight: 900;
                    }
                }
            }
        }

        .ratingControl
        {
            max-height: 80px;
            height: max-content;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-evenly;

            .form-group
            {
                margin-bottom: 0px;
                display: flex;
                justify-content: center;
                flex-direction: row;
                align-items: flex-start;
                color: white;
            }

            select
            {
                background: rgba(0,0,0,0.6);
                border-color: rgba(0,0,0,0.8);
                color: white;
                margin-left: 1rem;
            }
        }
    }
</style>
