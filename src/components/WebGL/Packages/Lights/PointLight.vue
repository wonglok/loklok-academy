<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { O3DG2 } from '../../Core/O3DG2'
import { PointLight, BoxBufferGeometry, MeshBasicMaterial, Color, Mesh } from 'three'

export default {
  name: 'PointLight',
  mixins: [O3DG2],
  props: {
    helper: {
      default: false
    },
    color: {
      defult: 0xffffff
    },
    intensity: {
      defult: 1
    },
    distance: {
      defult: 0
    },
    decay: {
      default: 2
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
      var ptLight = new PointLight(this.color, this.intensity, this.distance, this.decay); // soft white light

      let rodGeo = new BoxBufferGeometry(1, 700, 1, 2, 2, 2)
      rodGeo.translate(0, -300, 0)
      let rodMat = new MeshBasicMaterial({ color: new Color('#ffff00') })
      var rod = new Mesh(rodGeo, rodMat)
      rod.scale.set(0.05, 0.05, 0.05)
      this.o3d.add(rod)

      let boxgeo = new BoxBufferGeometry(30, 30, 30, 1, 1, 1)
      let boxMat = new MeshBasicMaterial({ wireframe: true, color: new Color('#ff0000') })
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

      this.$watch('intensity', () => {
        ptLight.intensity = this.intensity
      })
      this.$watch('distance', () => {
        ptLight.distance = this.distance
      })
      this.$watch('decay', () => {
        ptLight.decay = this.decay
      })
      let myColor = new Color(this.color)
      this.$watch('color', () => {
        ptLight.color = myColor.setHex(this.color)
      })
      this.o3d.add(ptLight)
    }
  },
  async mounted () {
    await this.loadStuff()
  }
}
</script>

<style>

</style>
