<template>
  <div v-bind:class="{'loader':true,'show':loading}"></div>
</template>

<script>
import store from "@/store";

export default {
  name: 'Loader',
  props: {
  },
  computed: {
    loading: {
      get() {
        return this.$store.state.loading;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$gradient-right: linear-gradient(90deg, #7400b8ff, #6930c3ff, #5e60ceff, #5390d9ff, #4ea8deff, #48bfe3ff, #56cfe1ff, #64dfdfff, #72efddff, #80ffdbff, #72efddff, #64dfdfff, #56cfe1ff, #48bfe3ff, #4ea8deff, #5390d9ff, #5e60ceff, #6930c3ff, #7400b8ff);
.loader {
  background: $gradient-right;
  background-size: 400% 400%;
  height: 0px;
  width: 100vw;
  flex-shrink: 1;
  flex-grow: 0;
  -webkit-animation: loader 5s ease infinite;
  -moz-animation: loader 5s ease infinite;
  animation: loader 5s ease infinite;
  transition: all 100ms ease-in-out;
  position: fixed;
  top: 0px;
  left: 0px;

  &.show {
    height: 4px;
  }
}
</style>
