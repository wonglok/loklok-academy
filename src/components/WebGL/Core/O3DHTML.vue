<template>
  <div @click="$emit('click')" class=""><slot></slot></div>
</template>

<script>
import { O3DG2 } from './O3DG2'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

export default {
  mixins: [O3DG2],
  mounted () {
    this.htmlLabel = new CSS3DObject(this.$el)
    this.o3d.add(this.htmlLabel)
    this.o3d.scale.set(0.015, 0.015, 0.015)
  },
  beforeDestroy () {
    this.o3d.remove(this.htmlLabel)
  }
}
</script>

<style>
</style>