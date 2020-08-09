<template>
  <div>
    <LightedCanvas :bgcolor="'transparent'" :dpi="1" class="w-full h-full relative">
      <O3D layout="overall">

        <GameNPC ref="character" :camLock="true" :char="'janice'" :move="move">
          <!-- <O3D slot="head" :scale="{ x: 1.5, y: 1.5, z: 1.5 }">
            <SpriteLabel :text="'Welcome to Lok Lok Academy!'"></SpriteLabel>
          </O3D> -->
        </GameNPC>

        <!-- <Bloomer :settings="{
          exposure: 1.0,
          bloomStrength: 1.7,
          bloomThreshold: 81.72 / 100.0,
          bloomRadius: 72.99 / 100.0 * 2
        }"></Bloomer> -->

        <!-- <ComputeResource :use="['chromaMatCap']">
          <SwatWalk></SwatWalk>
        </ComputeResource> -->

      </O3D>
      <!-- <DanceGUI @play="move = $event"></DanceGUI> -->
      <!-- <LoadingGUI></LoadingGUI> -->
    </LightedCanvas>
  </div>
</template>

<script>
import { O3DVue } from '../../Core/O3DVue'
export default {
  mixins: [
    O3DVue
  ],
  data () {
    return {
      resting: 'Sitting Idle (2)',
      move: 'Sitting Idle (2)'
    }
  },
  mounted () {
    let moves = [
      'Cheering While Sitting',
      'Sitting Victory',
      'Sitting Thumbs Up',
      'Sitting Clap (4)',
      'Fist Pump (1)',
      'Sitting Yell (3)'
    ]
    let bugs = [
      'Sitting',
      'Sitting Disapproval',
      'Sitting Disbelief',
      'Sitting Disbelief (1)',
      'Sitting Disbelief (2)'
    ]

    this.imove = this.imove || 0
    this.ibadmove = this.ibadmove || 0
    // this.$root.$on('update-avatar-move', ({ name }) => {
    //   this.move = name
    // })

    this.$root.$on('update-avatar-move-inc', () => {
      let act = moves[this.imove % moves.length]
      this.imove++
      if (this.$refs['character']) {
        this.$refs['character'].$emit('act-once', { act, resting: this.resting })
      }
    })

    this.$root.$on('update-avatar-bad-move-inc', () => {
      let act = bugs[this.ibadmove % moves.length]
      this.ibadmove++
      if (this.$refs['character']) {
        this.$refs['character'].$emit('act-once', { act, resting: this.resting })
      }
    })
  }
}
</script>

<style>

</style>