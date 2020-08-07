<template>
  <div class="o3d-editor full flex flex-col lg:flex-row">
    <div v-if="useEditor" class="half-height w-full lg:w-7/12 lg:h-full  item-left bg-gray-200 border-r border-green-500">
      <ACE
        @save="onSave()"
        :mode="'html'"
        v-model="current.vueCode"
        @input="onChangeTreeCode({ vueCode: $event });"
        @slide="onChangeTreeCode({ vueCode: $event }); needsRunSave = true;"
        theme="chrome"
        width="100%"
        :height="'100%'"
      >
      </ACE>
    </div>
    <div :class="{ 'half-height w-full lg:w-5/12 lg:h-full ': useEditor, 'w-full h-full': !useEditor }" class="item-right bg-blue-200 relative">
      <div v-html="styleHTML"></div>
      <component ref="scene" v-if="makeLIVE && runCanvas" :is="makeLIVE"></component>
    </div>
    <slot v-show="false"></slot>
  </div>
</template>

<script>
import Vue from 'vue'
import * as THREE from 'three'
// import { Actions } from '../../GLContent/Game/Actions'
// import { CharNPC } from '../../GLContent/Game/CharNPC'
import { PCamera } from '../../Core/PCamera'
import { RayPlay } from '../../Core/RayPlay'
import { OCamera } from '../../Core/OCamera'

export default {
  props: {
    globals: {
      default () {
        return {}
      }
    },
    NS: {
      default () {
        return  'O3DG2-EDITOR-CODE-TXT-' + require('raw-loader!./defaultcode-basic.txt').default.length + require('raw-loader!./defaultcode-basic.txt').default.slice(0, 300)
      }
    }
  },
  components: {
    ACE: require('../Editor/ACE.vue').default
  },
  mixins: [
    require('../../Core/O3DVue').O3DVue
  ],
  activated () {
    this.canRun = true
  },
  deactivated () {
    this.canRun = false
  },
  data () {
    return {
      runCanvas: true,
      useEditor: window.innerWidth > 500,
      version: `v0.0.1`,
      needsRunSave: false,
      styleHTML: '',
      rr: Math.random(),
      // NS: 'O3DG2-EDITOR-TREE-CODE-SPACESHIP',
      current: {
        vueCode: ' '
      },
      makeLIVE: false,
      vueCode: false,
      rootSelf: false
    }
  },
  created () {
    this.$on('toggle-editor', () => {
      this.useEditor = !this.useEditor
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'))
      })
    })
    this.$on('load-latest-code', ({ name }) => {
      if (window.confirm('Do you want to replace existing code ?')) {
        let DEFAULT_CODE = require('raw-loader!./defaultcode-beach.txt').default
        if (name === 'beach') {
          DEFAULT_CODE = require('raw-loader!./defaultcode-beach.txt').default
        }
        if (name === 'dancer') {
          DEFAULT_CODE = require('raw-loader!./defaultcode-dance.txt').default
        }
        this.runCanvas = false
        localStorage.setItem(this.NS, DEFAULT_CODE)
        this.current.vueCode = DEFAULT_CODE
        this.$nextTick(() => {
          this.runCanvas = true
          this.onSave()
          this.needsRunSave = true
        })
      }
    })
  },
  mounted () {
    let DEFAULT_CODE = require('raw-loader!./defaultcode-basic.txt').default
    let lsVue = localStorage.getItem(this.NS)
    if (!lsVue) {
      localStorage.setItem(this.NS, DEFAULT_CODE)
      lsVue = localStorage.getItem(this.NS)
      this.current.vueCode = lsVue
    }
    this.onChangeTreeCode({ vueCode: lsVue })
    this.$nextTick(() => {
      this.onSave()
    })
    let raf = () => {
      window.requestAnimationFrame(raf)
      if (this.needsRunSave) {
        this.needsRunSave = false
        this.onSave()
      }
    }
    window.requestAnimationFrame(raf)
  },
  methods: {
    getConfig ({ script }) {
      script = script.replace('export default ', 'return ')
      let otherLibs = this.globals || {}
      let LIBS = {
        THREE,
        OCamera,
        PCamera,
        RayPlay,
        ...otherLibs
      }
      let fnc = new Function(...['LIBS', ...Object.keys(LIBS), script])
      return fnc(LIBS, ...Object.values(LIBS))
    },
    onSave () {
      clearTimeout(this.saveerID)
      this.saveerID = setTimeout(() => {
        localStorage.setItem(this.NS, this.current.vueCode)
      }, 100)

      if (this.busy) {
        this.needsRunSave = true
        return
      }
      this.busy = true

      let templateCode = this.current.vueCode.match(/<template>([\S\s]*?)<\/template>/gi)
      templateCode = templateCode[0]
      templateCode = templateCode.replace(/^<template>/, '')
      templateCode = templateCode.replace(/<\/template>$/, '')

      let styleCode = this.current.vueCode.match(/<style([\S\s]*?)<\/style>/gi)
      let styleHTML = styleCode[0]

      let scriptCode = this.current.vueCode.match(/<script>([\S\s]*?)<\/script>/gi)
      scriptCode = scriptCode[0]
      scriptCode = scriptCode.replace(/^<script>/, '')
      scriptCode = scriptCode.replace(/<\/script>$/, '')

      // run styles
      this.styleHTML = styleHTML

      // this.makeLIVE = this.makeLIVE || {
      //   data () {
      //     return {
      //     }
      //   },
      //   render: this.getRender({ templateCode }),
      //   mounted () {},
      //   methods: {},
      //   beforeDestroy() {
      //   },
      //   mixins: [require('../../Core/O3DG2.js').O3DG2],
      // }

      let i = 0
      let setupNewObj = () => {
        this.lastFnCode = scriptCode
        let config = this.getConfig({ script: scriptCode })
        this.makeLIVE = {
          version: i++,
          ...config,
          mixins: [require('../../Core/RenderRoot.js').RenderRoot],
          render: this.getRender({ templateCode })
        }
      }

      if (!this.makeLIVE) {
        try {
          setupNewObj()
        } catch (e) {
          console.log(e)
        }
      }

      let tout = setInterval(() => {
        if (this.$refs.scene) {
          clearInterval(tout)
          // apply
          if (this.lastFnCode !== scriptCode) {
            try {
              setupNewObj()
            } catch (e) {
              console.log(e)
            }
          } else {
            this.$refs.scene.$options.render = this.getRender({ templateCode })
            this.$refs.scene.$forceUpdate()
          }
          this.busy = false
        }
      })
    },
    getTemplate ({ templateCode = '' }) {
      return `<div class="bg-white w-full h-full">${templateCode}<slot></slot></div>`
    },
    getRender ({ templateCode }) {
      templateCode = this.getTemplate({ templateCode })
      let templateRenderFnc = Vue.compile(templateCode)
      return templateRenderFnc.render
    },
    onChangeTreeCode ({ vueCode }) {
      this.current.vueCode = vueCode
    }
  }
}
</script>

<style lang="postcss">
.o3d-editor{
}
.half-height{
  height: 50%;
}
@screen lg{
  .half-height{
    height: 100%;
  }
}
</style>
