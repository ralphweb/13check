<template>
  <div id="app">
    <div id="nav">
      <a class="navbar-brand" href="/">
          <img src="/img/icons/13.png" class="legalRecLogo"><h1>Check</h1>
      </a>
      <div class="navbar-container" v-if="$session.exists()">
        <router-link to="/">Inicio</router-link>
        <router-link to="/logout">Cerrar Sesión</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
$imperial-red: #F86423;
$amaranth-red: #F86423;

html,
body
{
  margin:0;
  padding: 0;
  background-color: #303030;
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
  height: 100vh;

  #nav {
    padding: 10px 20px 10px 10px;
    background-color: #1c1c1c;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;

    a {
      font-weight: bold;
      color: white;
      text-decoration: none;
      margin-left: 20px;

      &.router-link-exact-active {
        color: #F86423;
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
</style>
