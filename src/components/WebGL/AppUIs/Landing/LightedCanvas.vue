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
      // this.scene.background = new Color('#bababa')
      this.scene.background = new Color('#000000')
      this.scene.add(this.o3d)

      this.onEnsure(() => this.ctx.renderer)
        .then(() => {
          this.$emit('ready', this)
        })
    }
  },
  mounted () {
    this.run()
  }
}
</script>

<style>
</style>