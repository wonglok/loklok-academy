<template>
  <O3D><slot></slot></O3D>
</template>

<script>
// import { WoozyMaterial } from '../../Core/WoozyMaterial'
import { O3DG2 } from '../../Core/O3DG2'
import { ShaderCube } from '../Materials/ShaderCube'
import { loadFBX } from '../../Core/loadFBX'
import { loadTexture } from '../../Core/loadTexture'
import { MeshMatcapMaterial, DoubleSide } from 'three'

export default {
  mixins: [O3DG2],
  props: {
    opacity: {
      default: 1
    },
  },
  watch: {
    opacity (v) {
      this.setOpacity(v)
    }
  },
  methods: {
    setOpacity (v) {
      this.o3d.traverse(async (item) => {
        if (item.isMesh) {
          item.material.transparent = true
          item.material.opacity = v
        }
      })
    },
    async setup (deps) {
      let walk = deps.walk
      walk.traverse((item) => {
        if (item.isMesh) {
          if (this.ctx.chromaMatCap) {
            item.material =  this.ctx.chromaMatCap.out.material
          } else {
            let shaderCube = new ShaderCube({ renderer: this.ctx.renderer, loop: this.onLoop, res: 32 })
            item.material = shaderCube.out.material
          }

          if (item.name === 'Mesh018' || item.name === 'Mesh013' || item.name === 'Mesh017') {
            // item.material = new MeshMatcapMaterial({ matcap: deps.silver, side: DoubleSide })
            item.material = new MeshMatcapMaterial({ matcap: deps.silver, side: DoubleSide })
          }
          item.material.side = DoubleSide
          item.material.transparent = true
        }
      })

      let scale = 0.5
      this.o3d.position.y = 242.6 * scale
      walk.scale.x = scale
      walk.scale.y = scale
      walk.scale.z = scale
      this.o3d.add(walk)

      this.setOpacity(this.opacity)
    }
  },
  async mounted () {
    let deps = await this.onLoad({
      silver: loadTexture(require('./matcap/silver.png')),
      walk: loadFBX(require('file-loader!./fbx/space-walk.fbx')),
      ensure: this.onEnsure(() => {
        return this.ctx.renderer
      })
    })
    this.setup(deps)
  }
}
</script>

<style>

</style>