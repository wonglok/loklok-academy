<template>
  <div></div>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
import SpriteText from 'three-spritetext'
// import { BoxBufferGeometry, MeshBasicMaterial, Mesh } from 'three'

export default {
  mixins: [O3DG2],
  props: {
    text: {
      default: 'God is Love.'
    }
  },
  methods: {
    setup () {
      var myText = new SpriteText(this.text)
      // myText.material.blending = AdditiveBlending
      myText.material.transparent = true
      myText.material.opacity = 0.75
      // myText.position.y = 18

      myText.textHeight = 3
      myText.color = 'black'
      myText.backgroundColor = 'white'
      myText.padding = '3'

      // this.o3d.scale.x = 0.05
      // this.o3d.scale.y = 0.05
      // this.o3d.scale.z = 0.05

      this.o3d.children.forEach(s => {
        this.o3d.remove(s)
      })
      if (!this.ctx.rayplay) {
        throw new Error('No RayPlay Class Setup')
      }
      this.ctx.rayplay.add(myText, () => {
        this.$emit('clicker')
      })
      this.onClean(() => {
        this.ctx.rayplay.remove(myText)
      })

      this.o3d.add(myText)

      // let geo = new BoxBufferGeometry(30, 30, 30, 30, 30, 30)
      // let mat = new MeshBasicMaterial({ wireframe: true, color: 0xff00ff })
      // let mesh = new Mesh(geo, mat)
      // this.onLoop(() => {
      //   mesh.rotation.x += 0.01
      // })

      // this.o3d.add(mesh)
    }
  },
  mounted () {
    this.setup()
    this.$watch('text', () => {
      this.setup()
    })
  }
}
</script>

<style>

</style>