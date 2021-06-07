<template>
  <div id="app" v-bind:class="{'admin':true}">
    <div id="nav">
      <a class="navbar-brand" href="/">
          <img src="/img/icons/13.png" class="legalRecLogo"><h1>Check</h1>
      </a>
      <div class="navbar-container" v-if="$session.exists()">
        <router-link to="/">Inicio</router-link>
        <router-link :to="view.path" v-for="(view,v) in views" v-bind:key="v" v-bind:class="{'admin':view.isAdmin}"><small v-if="view.isAdmin">Admin</small>{{view.name}}</router-link>
        <router-link to="/logout" class="session">Cerrar Sesión</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import {
    getViews
} from '@/helpers/API.js';

export default {
  name: 'App',
  data() {
    return {
      views: [],
      firstAdmin: false
    }
  },
  created() {
    var that = this;
    getViews()
      .then((result)=>{
        that.views = result.data;
      }).catch((e)=>{
        console.log(e);
      })
  }
}
</script>

<style lang="scss">
$imperial-red: #F86423;
$amaranth-red: #F86423;

html,
body
{
  margin:0;
  padding: 0;
  background-color: #303030;
  overflow: hidden;
}

#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin:0;
  padding: 0;
  text-align: center;
  color: #2c3e50;
  display: grid;
  grid-template-rows: minmax(min-content, max-content) 1fr;
  grid-template-areas: "navigation" 
                      "app";
  height: 100vh;
  overflow: hidden;
  width:100vw;
  position: fixed;
  top:0;
  lefT:0;

  &.admin
  {
    overflow: auto;
  }

  @media only screen and (hover: none) and (pointer: coarse) and (orientation:landscape) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "app";
    margin-bottom: 60px;
  }

  #nav {
    padding: 0px 20px 0px 10px;
    background-color: #1c1c1c;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    grid-area: navigation;

    a {
      font-weight: bold;
      color: white;
      text-decoration: none;
      padding: 15px 15px;
      display: flex;
      flex-direction: column;

      &:hover
      {
        background-color: #555;
      }

      &.router-link-exact-active {
        color: #F86423;
      }
    }

    .navbar-container
    {
      display: flex;
      align-items: center;

      small
      {
        font-size: 10pt;
        margin-bottom: -5px;
      }

      & > .admin,
      & > .session
      {
        border-left: 1px solid white;
      }

      & > .admin ~ .admin,
      & > .session ~ .session
      {
        border-left: none;
      }
    }

    .navbar-brand {
        display: flex;
        align-items: center;
        flex-direction: row;
        color: #ffffff;
        text-transform: uppercase;
        text-decoration: none;

        img
        {
          max-height: 35px;
        }

        h1 {
            font-size: 16pt;
            font-weight: 200;
            margin: 0px;
            padding: 0px;
        }
    }
  }

  /* ANIMATIONS */

  /* Simple CSS3 Fade-in-down Animation */
  .fadeInDown {
    -webkit-animation-name: fadeInDown;
    animation-name: fadeInDown;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  @-webkit-keyframes fadeInDown {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadeInDown {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  /* Simple CSS3 Fade-in Animation */
  @-webkit-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @-moz-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

  .fadeIn {
    opacity:0;
    -webkit-animation:fadeIn ease-in 1;
    -moz-animation:fadeIn ease-in 1;
    animation:fadeIn ease-in 1;

    -webkit-animation-fill-mode:forwards;
    -moz-animation-fill-mode:forwards;
    animation-fill-mode:forwards;

    -webkit-animation-duration:1s;
    -moz-animation-duration:1s;
    animation-duration:1s;
  }

  .fadeIn.first {
    -webkit-animation-delay: 0.4s;
    -moz-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }

  .fadeIn.second {
    -webkit-animation-delay: 0.6s;
    -moz-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }

  .fadeIn.third {
    -webkit-animation-delay: 0.8s;
    -moz-animation-delay: 0.8s;
    animation-delay: 0.8s;
  }

  .fadeIn.fourth {
    -webkit-animation-delay: 1s;
    -moz-animation-delay: 1s;
    animation-delay: 1s;
  }

  .fadeIn.fifth {
    -webkit-animation-delay: 1.2s;
    -moz-animation-delay: 1.2s;
    animation-delay: 1.2s;
  }

  .fadeIn.sixth {
    -webkit-animation-delay: 1.4s;
    -moz-animation-delay: 1.4s;
    animation-delay: 1.4s;
  }

  /* Simple CSS3 Fade-in Animation */
  .underlineHover:after {
    display: block;
    left: 0;
    bottom: -10px;
    width: 0;
    height: 2px;
    background-color: $imperial-red;
    content: "";
    transition: width 0.2s;
  }

  .underlineHover:hover {
    color: #fff;
  }

  .underlineHover:hover:after{
    width: 100%;
  }



  /* OTHERS */

  *:focus {
      outline: none;
  } 

  #icon {
    width:50%;
    margin-top: 30px;
    margin-bottom: 30px;
  }
}

.player
{
  &__controls
  {
    /*display: none !important;*/
  }
}

/* ADMIN */
.admin
{
    h1
    {
        color: white;
    }
}
</style>
