<template>
  <div :id="rid" @click="$emit('click')">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
import { O3DG2, getID } from '../../Core/O3DG2'
import { Scene, Color } from 'three'
import { PCamera } from '../../Core/PCamera'
export default {
  mixins:  [
    O3DG2
  ],
  data () {
    return {
      rid: getID(),
      scene: new Scene(),
      camera: false,
      ready: false,
      area: {
        rid: this.rid,
        el: this.$el,
        rect: false,
        camera: this.camera,
        scene: this.scene
      }
    }
  },
  methods: {
    async run () {
      this.camera = new PCamera({ element: this.$el, onResize: this.onResize })
      this.scene.add(this.o3d)

      this.camera.position.z = 23
      this.camera.position.y = 13

      this.area.rid = this.rid
      this.area.el = this.$el
      this.area.camera = this.camera
      this.area.scene = this.scene

      this.scene.background = new Color(0xffffff * Math.random())

      this.renderRoot.$emit('add-area', this.area)
      this.ready = true
    }
  },
  mounted () {
    this.run()
  },
  beforeDestroy () {
    this.renderRoot.$emit('remove-area', this.area)
  }
}
</script>

<style>

</style>