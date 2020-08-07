<template>
  <div class="full">
    <HeaderNav></HeaderNav>

    <LightedCanvas class="w-full banner relative bg-gray-400">
      <O3D layout="overall">
        <GameNPC @ready="syncScroll($event)" :camLock="false" :char="'swat'" :move="move">
          <O3D slot="head" :scale="{ x: 1.5, y: 1.5, z: 1.5 }">
            <SpriteLabel :text="'Welcome to Lok Lok Academy!'"></SpriteLabel>
            <!-- <FastFlame :pz="-50"></FastFlame> -->
          </O3D>
        </GameNPC>

        <!-- <Bloomer :settings="{
          exposure: 1.0,
          bloomStrength: 1.7,
          bloomThreshold: 81.72 / 100.0,
          bloomRadius: 72.99 / 100.0 * 2
        }"></Bloomer> -->

        <ComputeResource :use="['chromaMatCap']">
          <SwatWalk></SwatWalk>
        </ComputeResource>

      </O3D>
      <LoadingGUI></LoadingGUI>
    </LightedCanvas>

    <SectionIntro></SectionIntro>
    <SectionDesc></SectionDesc>

    <!-- <SectionCodeDemo></SectionCodeDemo> -->
    <!-- <SectionTeam></SectionTeam>
    <SectionContactCTA></SectionContactCTA>
    <SectionContact></SectionContact> -->
    <SectionFooter></SectionFooter>
  </div>
</template>

<script>
import { BrowserScroller } from '../../Core/BrowserScroller'
export default {
  mixins: [
    require('../../Core/O3DVue').O3DVue
  ],
  data () {
    return {
      vs: false,
      layouts: {
        overall: {}
      },
      move: 'Asking Question'
    }
  },
  methods: {
    syncScroll (vm) {
      setTimeout(() => {
        this.vs = new BrowserScroller({ onLoop: vm.onLoop, scroller: document.body, init: 0 })
        vm.onLoop(() => {
          this.layouts.overall.sx = (1.0 - this.vs.value)
          this.layouts.overall.sy = (1.0 - this.vs.value)
          this.layouts.overall.sz = (1.0 - this.vs.value)
        })
      }, 500)
    }
  },
  mounted () {
  }
}
</script>

<style lang="postcss">
.banner{
  height: 75vh;
}
</style>