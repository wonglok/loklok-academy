<template>
  <div class="o3d-editor full flex flex-col lg:flex-row">
    <div v-if="useEditor" class="half-height w-full lg:w-6/12 lg:h-full  item-left bg-gray-200 border-r border-green-500">
      <ACE
        :colorPrefix="'#'"
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
    <div :class="{ 'half-height w-full lg:w-6/12 lg:h-full ': useEditor, 'w-full h-full': !useEditor }" class="item-right bg-white relative">
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
        return  'O3DG2-EDITOR-DOM-TXT-' + require('raw-loader!./defaultcode-js.txt').default.length + require('raw-loader!./defaultcode-js.txt').default.slice(0, 300)
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
  },
  mounted () {
    this.onChangeTreeCode({ vueCode: this.code })
    this.$nextTick(() => {
      this.onSave()
    })

    this.$on('run', () => {
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
        let vm = this
        this.makeLIVE = {
          template: `<div class="h-full w-full">
            <iframe v-if="url" :src="url" :width="ww" :height="hh" style="width: 100%; height: 100%;" frameborder="0"></iframe>
          </div>`,
          data () {
            return {
              ww: 350,
              hh: 350,
              url: false
            }
          },
          mounted () {
            try {
              let jsurl = URL.createObjectURL(new Blob([vm.current.vueCode], { type: 'text/javascript' }))
              let html = `<!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <title>DOM Editor</title>
                    <base href="${location.origin}"/>
                    <meta name="description" content="by Lok lok Academy">
                    <style>
                      body{
                        margin: 0px;
                      }
                      .full, html, body{
                        width: 100%;
                        height: 100%;
                      }
                    </style>
                  </head>
                  <body>
                      <script type="module" src="${jsurl}" ${'>'}
                      ${'<'}/script>
                  </body>
                </html>
              `
              let rect = this.$el.getBoundingClientRect()
              this.ww = rect.width
              this.hh = rect.height

              window.addEventListener('resize', () => {
                let rect = this.$el.getBoundingClientRect()
                this.ww = rect.width
                this.hh = rect.height
              })

              let blobURL = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
              this.url = blobURL
              this.$root.$emit('update-avatar-move-inc')
            } catch (e) {
              console.error(e)
              this.$root.$emit('update-avatar-bad-move-inc')
            }
          }
        }
      }, 10)
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
