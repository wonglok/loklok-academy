<template>
  <O3D>
    <slot></slot>
  </O3D>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
import { FastFlame } from './FastFlame'
export default {
  mixins: [O3DG2],
  props: {
    lowres: {
      default: false,
    },
    opacity: {
      default: 1
    },
  },
  methods: {
    main () {
      let resX = 128
      let resY = 64

      if (this.lowres) {
        resX = 64
        resY = 32
      }

      this.fastflame = new FastFlame({
        camera: this.ctx.camera,
        renderer: this.ctx.renderer,
        onLoop: this.onLoop,
        onResize: this.onResize,
        onClean: this.onClean,
        resX,
        resY
      })

      this.fastflame.setOpacity(this.opacity)
      this.$watch('opacity', () => {
        this.fastflame.setOpacity(this.opacity)
      })
      this.onResize(() => {
        if (window.innerWidth < window.innerHeight) {
          // this.o3d.rotation.z = this.pi * 0.5
          this.o3d.position.z = 0
          this.o3d.scale.set(1.5, 1.5, 1.5)
        } else {
          this.o3d.position.z = 0
          this.o3d.scale.set(1.5, 1.5, 1.5)
        }
        if (this.lowres) {
          this.o3d.scale.set(3.5, 1.5, 1.5)
        }
      })

      this.o3d.add(this.fastflame.out.mesh)
    }
  },
  mounted () {
    this.onEnsure(() => this.ctx.renderer)
      .then(() => {
        this.main()
      })
  }
}
</script>

<style>
</style>