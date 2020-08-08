<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
import { PlaneBufferGeometry, Vector2, Mesh, RawShaderMaterial, CanvasTexture } from 'three'
// import { Refractor } from 'three/examples/jsm/objects/Refractor'
// import { FastBlurShader } from './FastBlurShader'
export default {
  name: 'GradientBG',
  mixins: [O3DG2],
  props: {
    image: {}
  },
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
    let link = require('./media/mb-lines-svg-2.svg')

    this.$on('init', async () => {
      // let camera = this.lookup('camera')
      let screen = await this.getScreen({ camera: this.ctx.camera, depth: 0 })
      let getTex = async () => {
        return new Promise((resolve) => {
          let canvas = document.createElement('canvas')
          let tex = new CanvasTexture(canvas)
          let ctx = canvas.getContext('2d')
          let image = new Image()
          image.src = link
          image.onload = () => {
            let element = this.ctx.element
            let elRect = element.getBoundingClientRect()
            let dpi = elRect.width / image.width * window.devicePixelRatio
            ctx.canvas.width = dpi * image.width
            ctx.canvas.height = dpi * image.height
            ctx.fillStyle = 'transparent'
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
            tex.needsUpdate = true
            resolve(tex)
          }
        })
      }

      let geo = new PlaneBufferGeometry(screen.max, screen.max, 2, 2)
      let uniforms = {
        time: { value: 0 },
        tex: { value: await getTex() },
        sceneRect: { value: new Vector2(1.0, 1.0) }
      }
      let mat = new RawShaderMaterial({
        // eslint-disable-next-line
        vertexShader: require('raw-loader!./glsl/fbm.vs.glsl').default,
        // eslint-disable-next-line
        fragmentShader: require('raw-loader!./glsl/fbm.fs.glsl').default,
        uniforms,
        transparent: true
      })

      let mesh = new Mesh(geo, mat)

      this.onResize(async () => {
        let element = this.ctx.element
        let elRect = element.getBoundingClientRect()
        let iHeight = uniforms.tex.value.image.height
        let iWidth = uniforms.tex.value.image.width
        let iAspect = iWidth / iHeight

        console.log(iWidth, iHeight)

        let maxVP = Math.max(elRect.width, elRect.height)
        uniforms.sceneRect.value = new Vector2(maxVP, maxVP)
        let screen = await this.getScreen({ camera: this.ctx.camera, depth: 0 })
        if (elRect.width > elRect.height) {
          let geo = new PlaneBufferGeometry(screen.height * iAspect, screen.height, 2, 2)
          mesh.geometry = geo
        } else {
          let geo = new PlaneBufferGeometry(screen.height * iAspect, screen.height, 2, 2)
          mesh.geometry = geo
        }
      })

      // mesh.scale.x = 1.65
      // mesh.scale.y = 1.65
      // mesh.scale.z = 1.65

      mesh.rotation.z = Math.PI

      this.o3d.children.forEach((v) => {
        this.o3d.remove(v)
      })
      this.o3d.add(mesh)

      this.onLoop(() => {
        // mesh.rotation.x += 1.0
        // mesh.rotation.y += 1.0
        // mesh.rotation.z += 1.0

        mesh.material.uniforms['time'].value = window.performance.now() * 0.001
      })
    })
    this.onEnsure(() => {
      return this.ctx.camera
    }).then(() => {
      this.$emit('init')
    })
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
