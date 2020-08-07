<template>
  <div>
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
import { ShaderCubeChrome } from '../Materials/ShaderCubeChrome'
import { WaterMatCap } from '../Materials/WaterMatCap'
import { ChromaMatCap } from '../Materials/ChromaMatCap'
import { CubeCam } from '../../Core/CubeCam'
import { Color } from 'three'
export default {
  props: {
    use: {
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      ready: {},
      waterMatCap: false,
      chromaMatCap: false,
      chromaCube: false,
      cubeCam: false,
      water: false,
    }
  },
  mixins: [
    require('../../Core/O3DG2').O3DG2
  ],
  mounted () {
    let tout = setInterval(() => {
      if (this.ctx.renderer) {
        clearInterval(tout)
        this.init()
      }
    })
  },
  methods: {
    init () {
      if (this.use.includes('chromaCube')) {
        this.chromaCube = new ShaderCubeChrome({
          renderer: this.ctx.renderer,
          loop: this.onLoop,
          res: 32,
          color: new Color('#ffffff')
        })
      }
      if (this.use.includes('cubeCam')) {
        this.cubeCam = new CubeCam({
          renderer: this.ctx.renderer,
          loop: this.ctx.onLoop,
          res: 128,
          clean: this.onClean,
          camera: this.ctx.camera
        })
      }

      if (this.use.includes('waterMatCap')) {
        this.waterMatCap = {
          out: {
            material: new WaterMatCap({
              scale: 2,
              onLoop: this.ctx.onLoop
            })
          }
        }
      }

      if (this.use.includes('chromaMatCap')) {
        this.chromaMatCap = {
          out: {
            material: new ChromaMatCap({
              scale: 1,
              onLoop: this.ctx.onLoop
            })
          }
        }
      }
      this.$forceUpdate()
      this.ready = true
    }
  }
}
</script>

<style>

</style>