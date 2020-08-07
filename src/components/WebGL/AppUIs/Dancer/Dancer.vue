<template>
  <div class="full flex">
    <DancerCanvas ref="canvas" class="full w-full relative">
      <GameNPC :char="'swat'" :camSync="true" :move="move"></GameNPC>
      <SwatWalk></SwatWalk>
      <!-- <LoadingGUI></LoadingGUI> -->
    </DancerCanvas>
    <DanceGUI @play="move = $event"></DanceGUI>
  </div>
</template>

<script>
export default {
  mixins: [
    require('../../Core/O3DVue').O3DVue
  ],
  data () {
    return {
      move: 'House Dancing (1)'
    }
  },
  methods: {
  }
}
</script>

<style>
</style>