<template>
  <O3D>
    <O3D ref="head" :py="35"><slot name="head"></slot></O3D>
  </O3D>
</template>

<script>
// import { WoozyMaterial } from '../../Core/WoozyMaterial'
import { O3DG2 } from '../../Core/O3DG2'
import { CharNPC } from './CharNPC.js'
import { ShaderCubeChrome } from '../Materials/ShaderCubeChrome'
import { Color } from 'three'
import { CamLock } from './CamLock'
import { CamSync } from './CamSync'
export default {
  mixins: [O3DG2],
  props: {
    matcap: {
      default: false
    },
    opacity: {
      default: 1
    },
    char: {
      default: undefined
    },
    move: {
      default: undefined
    },
    camLock: {
      default: false
    },
    camSync: {
      default: false
    }
  },
  data () {
    return {
      npc: false
    }
  },
  methods: {
    setup () {
      let chroma = this.ctx.chromaCube
      if (this.char === 'swat' && !chroma) {
        chroma = new ShaderCubeChrome({
          renderer: this.ctx.renderer,
          onLoop: this.onLoop,
          res: 16,
          color: new Color('#ffffff')
        })
      }
      this.npc = new CharNPC({ matcap: this.matcap, opacity: this.opacity, char: this.char, onLoop: this.onLoop, readyMoveName: this.move, chroma })

      this.npc.out.done.then(async () => {
        this.$emit('ready', this)
        this.o3d.add(this.npc.out.o3d)
        this.renderRoot.$emit('lookAtGuy', this.npc.skeleton.mixamorigHead)
        if (this.$refs.head) {
          this.npc.skeleton.mixamorigHead.add(this.$refs.head.o3d)
        }
        this.$emit('skeleton', this.npc.skeleton)

        if (this.camLock) {
          new CamLock({
            target: this.npc.skeleton.mixamorigHead,
            onLoop: this.onLoop,
            camera: this.ctx.camera
          })
        }
        if (this.camSync) {
          new CamSync({
            target: this.npc.skeleton.mixamorigHead,
            onLoop: this.onLoop,
            camera: this.ctx.camera,
            element: this.ctx.renderer.domElement,
            onClean: this.onClean
          })
        }
      })

      this.o3d.children.forEach(k => {
        this.o3d.remove(k)
      })

      // this.$root.$on('play-move', ({ name, randomDelay = 135 }) => {
      //   setTimeout(() => {
      //     this.npc.act({ name })
      //   }, randomDelay * Math.random())
      // })

      this.$watch('move', () => {
        this.npc.act({ name: this.move })
      })
      this.$on('act', ({ name }) => {
        this.npc.act({ name })
      })
      this.$watch('opacity', () => {
        this.npc.setOpacity(this.opacity)
      })
      this.$watch('matcap', () => {
        if (this.matcap) {
          this.npc.setMatCap(this.matcap)
        }
      })
    }
  },
  mounted () {
    this.onEnsure(() => {
      return this.ctx.renderer
    })
      .then(() => {
        this.setup()
        this.$watch('char', () => {
          this.setup()
        })
      })
  }
}

/*

Vision 5 Years and 1 Year
Weekly plan 1 3 5 release different content, 2 4 6 release different work
Income within 1year 5 years
Authoratative experiece in the structruing the code base in Front end, Threejs and Vuejs

*/
</script>

<style>

</style>
