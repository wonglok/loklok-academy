<template>
  <O3D>
  </O3D>
</template>

<script>
import { PCamera } from './PCamera'

export default {
  mixins: [
    require('./O3DG2').O3DG2
  ],
  async mounted () {
    this.renderRoot.camera = new PCamera({ element: this.element, onResize: this.onResize })
    this.renderRoot.camera.position.y = 12
    this.renderRoot.camera.position.z = 25

    this.o3d.add(this.renderRoot.camera)
  }
}
</script>

<style>

</style>