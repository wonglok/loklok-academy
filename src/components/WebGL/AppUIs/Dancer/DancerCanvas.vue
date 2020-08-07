<template>
  <div class="full">
    <slot></slot>
    <PCamera></PCamera>
    <StandardLights></StandardLights>
  </div>
</template>

<script>
import { Scene, Color } from 'three'
export default {
  mixins: [
    require('../../Core/RenderRoot').RenderRoot
  ],
  data () {
    return {
      scene: false,
      camera: false
    }
  },
  methods: {
    async run () {
      this.scene = new Scene()
      this.scene.background = new Color('#bababa')
      this.scene.add(this.o3d)
    }
  },
  mounted () {
    this.run()
  }
}
</script>

<style>
</style>