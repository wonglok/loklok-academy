<template>
  <div><slot v-if="mesh"></slot></div>
</template>

<script>
import { Mesh, MeshBasicMaterial, PlaneBufferGeometry } from 'three'
import { O3DG2 } from '../Core/O3DG2.js'
export default {
  mixins: [O3DG2],
  props: {
  },
  data () {
    return {
      mesh: false,
      scene: false,
      camera: false,
      composer: false
    }
  },
  mounted () {
    let mat = new MeshBasicMaterial({ map: null })
    let geo = new PlaneBufferGeometry(1, 1)
    let mesh = new Mesh(geo, mat)

    this.o3d.add(mesh)
    this.mesh = mesh

    this.$on('config', ({ width, height, map }) => {
      mesh.scale.set(width, height, 1)
      mat.map = map
      mat.needsUpdate = true
    })
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.o3d)
  }
}
</script>

<style>

</style>