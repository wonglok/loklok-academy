<template>
  <LightedCanvas class="w-full h-full relative">
    <O3D layout="overall">
      <GameNPC ref="character" :camLock="true" :char="'swat'" :move="move">
        <O3D slot="head" :scale="{ x: 1.5, y: 1.5, z: 1.5 }">
          <!-- <SpriteLabel :text="'Welcome to Lok Lok Academy!'"></SpriteLabel> -->
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
    <DanceGUI class="absolute top-0 left-0 full" @play="move = $event"></DanceGUI>
    <!-- <LoadingGUI></LoadingGUI> -->
  </LightedCanvas>
</template>

<script>
import { O3DVue } from '../../Core/O3DVue'
export default {
  mixins: [
    O3DVue
  ],
  data () {
    return {
      move: 'Back Flip To Uppercut'
    }
  }
}
</script>

<style>

</style>