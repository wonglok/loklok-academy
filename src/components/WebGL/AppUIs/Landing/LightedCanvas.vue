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
  props: {
    bgcolor: {
      default: '#bababa'
    }
  },
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
      if (this.bgcolor) {
        if (this.bgcolor !== 'transparent') {
          this.scene.background = new Color(this.bgcolor)
        }
      }

      this.scene.add(this.o3d)

      this.onEnsure(() => this.ctx.renderer)
        .then(() => {
          this.$emit('ready', this)
          this.ctx.renderer.domElement.addEventListener('click', () => {
            this.$emit('click')
          })
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