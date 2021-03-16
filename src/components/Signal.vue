<template>
  <div v-bind:class="['signal',header]">
    <div class="signal-header bg-success">Header</div>
    <div class="signal-player bg-warning">
      <svg viewBox="0 0 16 9"></svg>
      <div>
        {{msg}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'signal',
  props: {
    msg: String,
    header: String
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
    flex-direction: column;

    
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
    min-height: 60px;
    max-height: 20%;

    @media only screen and (hover: none) and (pointer: coarse) and (orientation:landscape) {
      min-height: 30px;
      height: 30px;
    }
    @media only screen and (hover: none) and (pointer: coarse) and (orientation:portrait) {
      min-height: 30px;
      max-height: unset;
      height: 100%;
      flex: 0 0 18%;
      overflow: hidden;
    }
  }
  &-player {
    grid-area:player;
    flex: 0 0 auto;
    display: grid;
    @media only screen and (hover: none) and (pointer: coarse) and (orientation:landscape) {
        flex: 0 0 auto;
      }
    @media only screen and (hover: none) and (pointer: coarse) and (orientation:portrait) {
      flex: 1 1 100%;
    }
  }
  &-player > * {
    grid-area: 1/1;
  }

  &-player div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
