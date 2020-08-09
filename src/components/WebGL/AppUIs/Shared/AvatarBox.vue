<template>
  <div>
    <LightedCanvas :dpi="dpi" class="w-full h-full relative" @click="() => $refs.character.$emit('act', { name: getWinMove() })" @touchstart="() => $refs.character.$emit('act', { name: getWinMove() })">
      <O3D layout="overall">
        <GameNPC ref="character" @ready="syncScroll($event)" :camLock="true" :char="'swat'" :move="move">
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
      <!-- <DanceGUI @play="move = $event"></DanceGUI> -->
      <LoadingGUI></LoadingGUI>
    </LightedCanvas>
  </div>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
export default {
  mixins: [
    O3DG2
  ]
}
</script>

<style>

</style>