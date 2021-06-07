<template>
  <div v-bind:class="['signal',header]">
    <div class="signal-header">
      <div class="signal-header-logo">
          <div class="signal-header-logo-img" :style="'background-image:url(\'http://13check.ingenieriac13.cl:3000/'+signal.logo.replace(/\\/g, '/')+'\');'"></div>
      </div>
      <div class="signal-header-rating">
          <h5>Rating</h5>
          <h2 :style="'color:'+signal.colorBorde">N/A</h2>
      </div>
      <div class="signal-header-share">
          <h5>Share</h5>
          <h2 :style="'color:'+signal.colorBorde">N/A</h2>
      </div>
    </div>
    <div class="signal-player">
      <svg viewBox="0 0 16 9"></svg>
      <div> 
        <video :id="'video'+signal.idRating"></video>     
      </div>
    </div>
  </div>
</template>

<script>
import flvjs from 'flv.js';
window.flvjs = flvjs;

export default {
  name: 'signal',
  data() {
    return {
      flvPlayer: null
    }
  },
  props: {
    msg: String,
    header: String,
    signal: Object,
    time: Number
  },
  mounted() {
    var that = this;
    if (flvjs.isSupported()) {
        var videoElement = document.getElementById('video'+that.signal.idRating);
        that.flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: 'http://13check.ingenieriac13.cl/stream/'+that.signal.ipServer
        });
        that.flvPlayer.attachMediaElement(videoElement);
        that.flvPlayer.load();
        setTimeout(()=>{
          that.flvPlayer.play();
        },500);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.signal
{
  display: flex;
  flex-direction: column;

  @media only screen and (hover: none) and (pointer: coarse) and (orientation:landscape) {
    display: grid;
    grid-template-rows: minmax(min-content, max-content);
    padding: 0px;
    overflow-y: auto;

    &.left
    {
      grid-template-columns: 1fr;
      height: 100vh;
    }

    &.right
    {
      grid-template-columns: 1fr 12%;
      grid-template-areas: "player head";
    }
  }

  @media only screen and (hover: none) and (pointer: coarse) and (orientation:portrait) {
    display: grid;
    grid-template-rows: minmax(min-content, max-content);
    padding: 0px;
    overflow-y: auto;

    &.left
    {
      grid-template-columns: 12% 1fr;
      grid-template-areas: "head player";
    }

    &.right
    {
      grid-template-columns: 1fr 12%;
      grid-template-areas: "player head";
    }
  }

  &-header {
    grid-area: head;
    flex: 1 1 100%;
    min-height: 80px;
    max-height: 20%;
    display:grid;
    grid-template-rows: 1fr;
    grid-template-columns: 34% 33% 33%;
    background: #050505;

    @media only screen and (hover: none) and (pointer: coarse) {
      min-height: 30px;
      max-height: unset;
      height: 100%;
      flex: 0 0 12%;
      overflow: hidden;      
      grid-template-columns: 1fr;
      grid-template-rows: 34% 33% 33%;
    }

    &-logo
    {
      &-img
      {
        background-size: 40px;
        background-position: center center;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
      }
    }

    &-rating,
    &-share
    {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      h5
      {
        margin: 0;
        font-size: 8pt;
        font-weight: 200;
        color: white;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      h2
      {
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
    grid-area:player;
    flex: 0 0 auto;
    display: grid;
    color: white;

    @media only screen and (hover: none) and (pointer: coarse) and (orientation:landscape) {
        flex: 0 0 auto;
        height: 100vh;
      }


    @media only screen and (hover: none) and (pointer: coarse) and (orientation:portrait) {
      flex: 1 1 100%;
    }
  }
  &-player > * {
    grid-area: 1/1;

    @media only screen and (hover: none) and (pointer: coarse) and (orientation:landscape) {
      height: 100vh;
    }
  }

  &-player div {
    display: flex;
    align-items: center;
    justify-content: center;

    video
    {
      width:100%;
      height: 100%;
    }
  }
}
</style>
