<template>
  <div class="full">
    <HeaderNav></HeaderNav>

    <LightedCanvas class="w-full banner relative">
      <GameNPC :char="'swat'" :camLock="true" :move="move">
        <O3D slot="head" :scale="{ x: 1.5, y: 1.5, z: 1.5 }">
          <SpriteLabel :text="'Welcome to Lok Lok Academy!'"></SpriteLabel>
        </O3D>
      </GameNPC>
      <ComputeResource :use="['chromaMatCap']">
        <SwatWalk></SwatWalk>
      </ComputeResource>
      <LoadingGUI></LoadingGUI>
    </LightedCanvas>

    <SectionIntro></SectionIntro>
  </div>
</template>

<script>
export default {
  mixins: [
    require('../../Core/O3DVue').O3DVue
  ],
  data () {
    return {
      move: 'Asking Question'
    }
  },
  methods: {
  }
}
</script>

<style lang="postcss">
.banner{
  height: 100vmin;
  max-height: 600px;
}
</style>