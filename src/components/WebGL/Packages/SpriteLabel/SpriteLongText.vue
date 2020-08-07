<template>
  <div class="hidden">
    <div ref="content" class="my-text-area">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
// import rasterizehtml from 'rasterizehtml/dist/rasterizeHTML.allinone'
import TextCanvas from  'text-canvas'
import { CanvasTexture, Sprite, SpriteMaterial, DoubleSide, Object3D } from 'three'
// import { BoxBufferGeometry, MeshBasicMaterial, Mesh } from 'three'

export default {
  mixins: [O3DG2],
  props: {
    text: {
      default: 'Diamond Heart'
    }
  },
  methods: {
    async setup () {
      // let rid = getID().replace('_', '')
      // let cssText = `
      //   * {
      //     box-sizing: border-box;
      //   }
      //   .my-text-area-${rid}{
      //     background-color: rgba(255,255,255,0.9);
      //     color: black;
      //     font-famiily: Arial;
      //     font-size: 122px;
      //     padding: 50px;
      //   }
      // `
      // let res = await rasterizehtml.drawHTML(`<div class="my-text-area-${rid}"><style>${cssText}</style>${this.$refs['content'].innerHTML}</div>`)

      let fontSize = 15
      let textCanvas = new TextCanvas(this.text || '  ', {
        fontFamily: `Arial`,
        fontStyle: `normal`,
        fontWeight: `normal`,
        fontVariant: `normal`,
        fontSize: `${fontSize}`,
        textAlign: 'left',
        textBaseline: 'bottom',
        textColor: `black`,
        wordWrap: 300
      })

      textCanvas.resolution = 5.0
      let render = (v) => {
        textCanvas.text = v
        textCanvas.style.padding = '60px'
        let image = textCanvas.render()
        let highres = 1
        let scale = image.width / 600
        let padX = fontSize * scale * highres * textCanvas.resolution
        let padY = fontSize * scale * highres * textCanvas.resolution

        let canvas = document.createElement('canvas')
        canvas.width = image.width * highres + padX
        canvas.height = image.height * highres + padY

        let ctx = canvas.getContext('2d')

        let sx = 0
        let sy = 0
        let sWidth = image.width
        let sHeight = image.height
        let dx = padX * 0.5
        let dy = padY * 0.5
        let dWidth = image.width * highres
        let dHeight = image.height * highres
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.fillRect(0, 0, dWidth + padX, dHeight + padY)
        ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

        let canvasTexture = new CanvasTexture(canvas)
        canvasTexture.needsUpdate = true

        let spriteMat = new SpriteMaterial({ map: canvasTexture, transparent: true, side: DoubleSide })
        let sprite = new Sprite(spriteMat)
        sprite.scale.y *= canvas.height / canvas.width

        this.o3d.children.forEach(k => {
          this.o3d.remove(k)
        })
        // sprite.position.y += scale * 0.2

        let so3d = new Object3D()
        so3d.add(sprite)
        so3d.scale.x = scale
        so3d.scale.y = scale
        so3d.scale.z = scale

        this.o3d.add(so3d)
      }
      this.$watch('text', render)
      render(this.text)
    }
  },
  computed: {
  },
  mounted () {
    this.setup()
  }
}
</script>

<style>

</style>