<template>
  <div>
    <slot>
    </slot>
  </div>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
import { DirectionalLight } from 'three'

export default {
  name: 'DirectionalLight',
  mixins: [O3DG2],
  props: {
    intensity: {
      defult: 3
    }
  },
  components: {
  },
  beforeDestroy () {
    this.o3d.children.forEach((item) => {
      this.o3d.remove(item)
    })
  },
  methods: {
    async loadStuff () {
      var light = new DirectionalLight(0xffffff, this.intensity); // soft white light
      this.$watch('intensity', () => {
        light.intensity = this.intensity
      })
      this.o3d.add(light)
    }
  },
  async mounted () {
    await this.loadStuff()
  }
}
</script>

<style>
</style>
