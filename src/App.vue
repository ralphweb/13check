<template>
  <div id="app">
    <div id="nav">
      <a class="navbar-brand" href="/home">
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
  grid-template-rows: 80px 1fr;
  height: 100vh;

  #nav {
    padding: 20px 20px;
    background-color: #1c1c1c;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
}
</style>
