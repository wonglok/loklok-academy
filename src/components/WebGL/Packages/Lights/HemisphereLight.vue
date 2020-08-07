<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
import { BoxBufferGeometry, MeshBasicMaterial, Color, Mesh } from 'three'
export default {
  name: 'HemiSphere',
  mixins: [O3DG2],
  props: {
    intensity: {
      default: 3.6
    },
    color: {
      default: 0xffffff
    },
    floorColor: {
      default: 0xffffff
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
      let HemisphereLight = require('three/src/lights/HemisphereLight').HemisphereLight
      var lightInstance = new HemisphereLight(this.color, this.floorColor, this.intensity)
      let myColor = new Color(this.color)
      this.$watch('color', () => {
        lightInstance.color = myColor.setHex(this.color)
      })
      this.o3d.add(lightInstance)
      this.$watch('intensity', () => {
        lightInstance.intensity = this.intensity
      })

      let rodGeo = new BoxBufferGeometry(1, 700, 1, 2, 2, 2)
      rodGeo.translate(0, -300, 0)
      let rodMat = new MeshBasicMaterial({ color: new Color('#00ffff') })
      var rod = new Mesh(rodGeo, rodMat)
      rod.scale.set(0.05, 0.05, 0.05)
      this.o3d.add(rod)

      let boxgeo = new BoxBufferGeometry(30, 30, 30, 1, 1, 1)
      let boxMat = new MeshBasicMaterial({ wireframe: true, color: new Color('#ff00ff') })
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
