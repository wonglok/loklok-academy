<template>
  <div class="o3d-editor full flex flex-col lg:flex-row">
    <div v-if="useEditor" class="half-height w-full lg:w-7/12 lg:h-full  item-left bg-gray-200 border-r border-green-500">
      <ACE
        @save="onSave()"
        :mode="'javascript'"
        v-model="current.vueCode"
        @input="onChangeTreeCode({ vueCode: $event });"
        @slide="onChangeTreeCode({ vueCode: $event }); needsRunSave = true;"
        theme="chrome"
        width="100%"
        :height="'calc(100% - 0px)'"
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
      useEditor: true,
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
  },
  mounted () {
    this.onChangeTreeCode({ vueCode: this.code })
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

            this.$root.$emit('update-avatar-move-inc')
          } catch (e) {
            this.logs.push({ text: e, type: 'err' })
            console.error(e)
            this.$root.$emit('update-avatar-bad-move-inc')
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
  height: 100%;
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
