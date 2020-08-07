<template>
  <div class="full">
    <slot></slot>
  </div>
</template>

<script>
import { Scene, WebGLRenderTarget, PerspectiveCamera } from 'three'
import { O3DG2 } from '../Core/O3DG2'
export default {
  mixins: [O3DG2],
  props: {
    width: {
      default: 20,
    },
    height: {
      default: 20
    },
    baseResolution: {
      default: 320
    }
  },
  data () {
    return {
      scene: false,
      camera: false,
      composer: false
    }
  },
  methods: {
    setupScene () {
      this.scene = new Scene()
      // this.scene.background = new Color('#ffffff')
      this.scene.add(this.o3d)
    },
    setupCamera () {
      this.camera = new PerspectiveCamera(90, this.width / this.height, 0.01, 10000000)
      this.camera.position.z = 100
      this.camera.lookAt(this.scene.position)
      this.onResize(() => {
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
      })
    }
  },
  mounted () {
    this.setupScene()
    this.setupCamera()

    let syncConfig = () => {
      if (this.rtt) {
        this.rtt.dispose()
      }
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
      this.rtt = new WebGLRenderTarget(this.baseResolution * this.width / this.height, this.baseResolution)
      this.$parent.$emit('config', {
        width: this.width,
        height: this.height,
        map: this.rtt.texture
      })
    }
    syncConfig()
    this.$watch('baseResolution', () => {
      syncConfig()
    })
    this.$watch('width', () => {
      syncConfig()
    })
    this.$watch('height', () => {
      syncConfig()
    })

    this.onLoop(() => {
      let { camera, scene, rtt } = this
      let { renderer } = this.ctx
      if (renderer && camera && scene && rtt) {
        renderer.setRenderTarget(rtt)
        renderer.render(scene, camera)
        renderer.setRenderTarget(null)
      }
    })
  }
}
</script>

<style>

</style>