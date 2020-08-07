<template>
  <div class="w-full h-full relative">
    <O3D v-if="renderer" class="">
      <slot @camera="$emit('camera', $event)"></slot>
    </O3D>
    <LoadingGUI></LoadingGUI>
  </div>
</template>

<script>
import { RenderRoot } from '../../Core/RenderRoot'
import { PCamera } from '../../Core/PCamera'
// import { OCamera } from '../../Core/OCamera'
import { RayPlay } from '../../Core/RayPlay'
import { Scene } from 'three'
// import { CubeCam } from '../Core/CubeCam'
// import { ShaderCubeChrome } from '../Core/ShaderCubeChrome'
// import { Actions } from '../GLContent/Game/Actions'
// import { CharNPC } from '../GLContent/Game/CharNPC'
// import { getScreen } from '../Core/O3DG2'
// import { makeScroller } from '../Core/makeScroller'
// import { ShaderCubeChromatics } from '../Core/ShaderCubeChromatics'

export default {
  mixins: [RenderRoot],
  components: {
  },
  data () {
    return {
      // screen: false,
      // vs: false,
      // page: {
      //   limitYNeg: 0,
      //   limitY: 1
      // },
      cubeCam: false,
      composer: false,
      useBloom: false,
      // layouts: {
      //   flower: false
      // },
      renderer: false,
      camera: false,
      scene: new Scene(),
      shaderCube: false
    }
  },
  methods: {
    async setup () {
      this.camera = new PCamera({ element: this.renderRootElement, onResize: this.onResize })
      // this.$on('setup-camera', ({ name }) => {
      //   if (name === 'pcam') {
      //     this.camera = new PCamera({ element: this.renderRootElement, onResize: this.onResize })
      //   }
      //   if (name === 'ocam') {
      //     this.camera = new OCamera({ element: this.renderRootElement, onResize: this.onResize })
      //   }
      // })
      // this.$emit('setup-camera', { name: 'pcam' })

      // this.camera.position.y = 13
      // this.camera.position.z = 30
      // this.camera.position.z = 500
      // this.onResize(() => {
      //   let page = this.page
      //   this.screen = getScreen({ camera: this.ctx.camera, depth: 0 })
      //   this.vs = makeScroller({ loop: this.onLoop, mounter: this.ctx.touchdiv, limit: { direction: 'vertical', speed: 15, canRun: true, get ny () { return page.limitYNeg }, get y () { return page.limitY } }, onMove: () => { this.$emit('move') } })
      // })
      // this.scene.background = new Color('#eeeeee')
      this.scene.add(this.o3d)
    },
    setupInteraction () {
      this.rayplay = new RayPlay({ onResize: this.onResize, onClean: this.onClean, mounter: this.ctx.touchdiv, camera: this.ctx.camera, onLoop: this.onLoop })
    }
  },
  mounted () {
    this.setup()
    this.setupInteraction()
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
