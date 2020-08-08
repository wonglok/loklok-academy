<template>
  <div><slot></slot></div>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
import { loadGLTF } from '../../Core/loadGLTF'
// import { ShaderCube } from '../../Core/ShaderCube'
import { MeshMatcapMaterial, DoubleSide } from 'three'
import { loadTexture } from '../../Core/loadTexture'

export default {
  mixins: [O3DG2],
  data () {
    return {
      layouts: {}
    }
  },
  async created () {
  },
  methods: {
    setup () {
      let flowerURL = require('file-loader!./glb/flower-simple.glb')

      loadGLTF(flowerURL)
        .then(async (glb) => {
          this.brown = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: await loadTexture(require('./matcap/brown.png')) })
          this.yellow = new MeshMatcapMaterial({ color: 0xffd743, side: DoubleSide, matcap: await loadTexture(require('./matcap/bright-yellow.png')) })
          this.pink = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: await loadTexture(require('./matcap/pink.jpg')) })

          glb.scene.traverse((item) => {
            if (item.isMesh) {
              // console.log(item.name)
              if (item.name.indexOf('Plane') !== -1) {
                item.material = this.pink
              }
              if (item.name.indexOf('Sphere') !== -1) {
                item.material = this.yellow
              }
              if (item.name.indexOf('Circle') !== -1) {
                item.material = this.brown
              }
            }
          })

          this.o3d.rotation.z = Math.PI * 0.25
          this.o3d.rotation.y = Math.PI * -0.5
          this.o3d.scale.set(45, 45, 45)
          this.o3d.add(glb.scene)
          this.onLoop(() => {
            glb.scene.rotation.x += 0.01
          })
        })

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
  }
}
</script>

<style>

</style>