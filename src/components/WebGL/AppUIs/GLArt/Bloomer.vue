<template>
  <div>
  </div>
</template>

<script>
/*


*/
import { O3DG2 } from '../../Core/O3DG2'
import { Bloomer } from './Bloomer'
export default {
  props: {
    settings: {
      default: false
    }
  },
  mixins: [
    O3DG2
  ],
  async mounted () {
    await this.onEnsure(() => this.ctx.renderer && this.ctx.camera)
    this.onResize(() => {
      if (this.composer) {
        this.cleanerTasks.forEach(e => e())
      }

      let fncs = []
      this.onRefresh = (v) => {
        fncs.push(v)
      }

      this.composer = new Bloomer({
        renderer: this.ctx.renderer,
        element: this.ctx.renderer.domElement,
        scene: this.ctx.scene,
        camera: this.ctx.camera,
        onLoop: this.onLoop,
        onClean: this.onClean,
        onResize: this.onResize,
        settings: this.settings,
        onRefresh: this.onRefresh,
        gui: false
      })

      this.$watch('settings', () => {
        fncs.forEach(e => e(this.settings))
      })

      fncs.forEach(e => e(this.settings))

      this.renderRoot.composer = this.composer
    })

    this.onClean(() => {
      this.renderRoot.composer = false
    })
  }
}
</script>

<style>

</style>