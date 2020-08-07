<template>
  <O3D>
    <slot></slot>
  </O3D>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
import { EnergyArt } from './EnergyArt'
export default {
  props: {
    lowres: {
      default: false
    }
  },
  mixins: [O3DG2],
  methods: {
    main () {
      let resX = 256
      let resY = 256
      if (this.lowres) {
        resX = 128
        resY = 128
      }
      this.mesh = new EnergyArt({ renderer: this.ctx.renderer, onLoop: this.onLoop, onResize: this.onResize, onClean: this.onClean, resX, resY })
      this.o3d.add(this.mesh.out.o3d)

      this.o3d.rotation.x = Math.PI * 0.25
      this.o3d.rotation.z = Math.PI * -0.15

      // this.o3d.rotation.z = Math.PI * 0.5
    }
  },
  mounted () {
    this.main()
  }
}
</script>

<style>
</style>
