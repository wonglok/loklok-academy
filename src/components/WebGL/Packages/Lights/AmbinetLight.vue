<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
import { AmbientLight, BoxBufferGeometry, Color, MeshBasicMaterial, Mesh } from 'three'

export default {
  name: 'AmbientLight',
  mixins: [O3DG2],
  props: {
    intensity: {
      default: 3
    },
    color: {
      default: '#ffffff'
    },
    helper: {
      default: false
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
      var ambient = new AmbientLight(this.color, this.intensity); // soft white light
      let myColor = new Color(this.color)
      this.$watch('color', () => {
        ambient.color = myColor.setHex(this.color)
      })
      this.$watch('intensity', () => {
        ambient.intensity = this.intensity
      })
      this.o3d.add(ambient)

      let rodGeo = new BoxBufferGeometry(1, 700, 1, 2, 2, 2)
      rodGeo.translate(0, -300, 0)
      let rodMat = new MeshBasicMaterial({ color: new Color('#00ff00') })
      var rod = new Mesh(rodGeo, rodMat)
      rod.scale.set(0.05, 0.05, 0.05)
      this.o3d.add(rod)

      let boxgeo = new BoxBufferGeometry(30, 30, 30, 1, 1, 1)
      let boxMat = new MeshBasicMaterial({ wireframe: true, color: new Color('#0000ff') })
      var box = new Mesh(boxgeo, boxMat)
      box.scale.set(0.05, 0.05, 0.05)
      this.o3d.add(box)

      let syncHelper = () => {
        if (this.helper) {
          this.o3d.add(box)
          this.o3d.add(rod)
        } else {
          this.o3d.remove(box)
          this.o3d.remove(rod)
        }
      }

      syncHelper()
      this.$watch('helper', () => {
        syncHelper()
      })
    }
  },
  async mounted () {
    await this.loadStuff()
  }
}
</script>

<style>

</style>
