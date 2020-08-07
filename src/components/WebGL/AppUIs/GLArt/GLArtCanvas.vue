<template>
  <div class="w-full h-full relative">
    <!-- <DirectionalLight :pz="-100" :py="23" :intensity="0.7"></DirectionalLight>
    <DirectionalLight :pz="100" :py="23" :intensity="0.7"></DirectionalLight>
    <DirectionalLight :px="-100" :py="23" :intensity="0.7"></DirectionalLight>
    <DirectionalLight :px="100" :py="23" :intensity="0.7"></DirectionalLight>
    <GameNPC :char="'david'" :pz="-20">
    </GameNPC>
    <CamControl :py="-13"></CamControl>
    <SwatWalk></SwatWalk> -->

    <!-- <O3DSprite> -->
      <!-- <Portal :width="screen.max" :height="screen.max" :baseResolution="1024"> -->
        <!-- <Flame :pz="-150"></Flame> -->
      <!-- </Portal> -->
    <!-- </O3DSprite> -->
<!--
    <O3DSprite>
      <Portal :width="screen.min" :height="screen.min" :baseResolution="768">
        <Flame :pz="-150"></Flame>
      </Portal>
    </O3DSprite> -->
    <!--
<FastFlame v-if="ctx.renderer"></FastFlame>

    <EnergyArt :pz="30" v-if="ctx.renderer"></EnergyArt>
      -->
    <slot v-if="ctx.renderer"></slot>
    <!-- <Bloomer :settings="{
      exposure: 1.0,
      bloomStrength: 1.7,
      bloomThreshold: 81.72 / 100.0,
      bloomRadius: 72.99 / 100.0 * 2
    }" v-if="ctx.renderer"></Bloomer> -->

    <!-- <Game :nolight="true"></Game> -->
  </div>
</template>

<script>
import { Scene, Color } from 'three'
import { PCamera } from '../../Core/PCamera'
import { getScreen } from '../../Core/O3DG2'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  props: {
    bgcolor: {
      default: false
    },
    rounded: {
      default: '8px 8px 0px 0px'
    }
  },
  mixins: [
    require('../../Core/RenderRoot').RenderRoot
  ],
  data () {
    return {
      screen: false,
      scene: false,
      camera: false
    }
  },
  methods: {
    async setupGraphics () {
      this.scene = new Scene()
      this.camera = new PCamera({ element: this.ctx.element, onResize: this.onResize })
      this.camera.position.z = 180
      this.onResize(() => {
        this.screen = getScreen({ camera: this.camera, depth: this.camera.position.z })
      })
      if (this.bgcolor) {
        this.scene.background = new Color(this.bgcolor)
      }

      // this.controls = new OrbitControls(this.camera, this.element)
      // this.onLoop(() => {
      //   this.controls.update()
      // })
      this.scene.add(this.o3d)

      this.renderer.domElement.style.borderRadius = this.rounded
    }
},
mounted () {
    this.setupGraphics()
  }
}
</script>

<style>
</style>
