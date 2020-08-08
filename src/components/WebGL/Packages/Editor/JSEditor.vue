<template>
  <div class="o3d-editor full flex flex-col lg:flex-row">
    <div v-if="useEditor" class="half-height w-full lg:w-7/12 lg:h-full  item-left bg-gray-200 border-r border-green-500">
      <div class="flex flex-wrap justify-start items-center" style="height: 37px;">
        <button class="p-1 m-1 text-xs border" @click="$emit('reset')">Reset</button>
      </div>
      <ACE
        @save="onSave()"
        :mode="'javascript'"
        v-model="current.vueCode"
        @input="onChangeTreeCode({ vueCode: $event });"
        @slide="onChangeTreeCode({ vueCode: $event }); needsRunSave = true;"
        theme="chrome"
        width="100%"
        :height="'calc(100% - 37px)'"
      >
      </ACE>
    </div>
    <div :class="{ 'half-height w-full lg:w-5/12 lg:h-full ': useEditor, 'w-full h-full': !useEditor }" class="item-right bg-white relative">
      <div v-html="styleHTML"></div>
      <component ref="scene" v-if="makeLIVE && runCanvas" :is="makeLIVE"></component>
    </div>
    <slot v-show="false"></slot>
  </div>
</template>

<script>
// import Vue from 'vue'
// import * as THREE from 'three'
// import { Actions } from '../../GLContent/Game/Actions'
// import { CharNPC } from '../../GLContent/Game/CharNPC'
// import { PCamera } from '../../Core/PCamera'
// import { RayPlay } from '../../Core/RayPlay'
// import { OCamera } from '../../Core/OCamera'

export default {
  props: {
    globals: {
      default () {
        return {}
      }
    },
    code: {
      default () {
        return require('raw-loader!./defaultcode-js.txt').default
      }
    },
    NS: {
      default () {
        return  'O3DG2-EDITOR-JS-TXT-' + require('raw-loader!./defaultcode-js.txt').default.length + require('raw-loader!./defaultcode-js.txt').default.slice(0, 300)
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
    this.$on('load-latest-code', ({ code }) => {
      if (window.confirm('Do you want to replace existing code ?')) {
        let DEFAULT_CODE = code
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
    this.$on('reset', () => {
      if (window.confirm('Do you want to reset existing code ?')) {
        let DEFAULT_CODE = this.code
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
    let DEFAULT_CODE = this.code
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
    onSave () {
      clearTimeout(this.saveerID)
      this.saveerID = setTimeout(() => {
        localStorage.setItem(this.NS, this.current.vueCode)
      }, 100)

      let vm = this
      this.makeLIVE = {
        template: `<div class="p-3">
          <pre v-for="(log, ii) in logs" class="text-sm font-mono" :class="{ 'text-red-500': log.type === 'err' }" :key="ii">{{ log.text }}</pre>
        </div>`,
        data () {
          return {
            logs: [],
            errs: [],
          }
        },
        mounted () {
          try {
            let fnc = new Function('console', vm.current.vueCode)
            let fakeConsole = {
              log: (...args) => {
                this.logs.push({ text: args.map(e => JSON.stringify(e, null, '  ')).join(' '), type: 'log' })
                console.log(...args)
              }
            }
            fnc(fakeConsole)
          } catch (e) {
            this.logs.push({ text: e, type: 'err' })
            console.error(e)
          }
        }
      }
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
