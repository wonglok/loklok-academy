import { O3DG2 } from './O3DG2'
import { WebGLRenderer } from 'three'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

import 'requestidlecallback'
export const RenderRootGrid = {
  name: 'RenderRootGrid',
  mixins: [O3DG2],
  components: {
    O3D: require('../Core/O3D.vue').default
  },
  data () {
    return {
      renderAreas: [],
      preserveDrawingBuffer: false,
      canRun: true,
      touchdiv: false,
      use2DLabel: false,
      use3DLabel: false,
      isRenderRoot: true,
      camera: false,
      composer: false,
      renderer: false,
      rootMounterElement: false,
      executionTaskListMap: new Map(),
      executionTaskListMapPost: new Map(),
      computeTasks: [],
      resizeTasks: [],
      cleanTasks: [],
      lazyTasks: []
    }
  },
  created () {
    this.$on('add-area', (area) => {
      this.renderAreas.push(area)
    })
    this.$on('remove-area', (area) => {
      this.renderAreas.splice(this.renderAreas.find(e => e.rid === area.rid), 1)
    })
  },
  methods: {
    handleLoop () {
      let rAFID = 0
      let runTasks = async () => {
        rAFID = window.requestAnimationFrame(runTasks)
        if (!this.canRun) {
          return
        }

        for (let entries of this.executionTaskListMap) {
          let taskList = entries[1]
          for (let task of taskList) {
            task()
          }
        }
        if (this.renderer) {
          this.renderer.domElement.style.position = 'absolute'
          this.renderer.domElement.style.top = '0px'
          this.renderer.domElement.style.left = '0px'
          this.renderer.domElement.classList.add('w-full')
          this.renderer.domElement.classList.add('h-full')
          // this.renderer.domElement.style.transform = `translateY(${window.scrollY}px)`

          this.renderer.setClearColor(0xffffff);
          this.renderer.setScissorTest(false);
          this.renderer.clear();

          this.renderer.setClearColor(0xe0e0e0);
          this.renderer.setScissorTest(true);

          this.renderAreas.forEach(({ el, scene, camera }) => {
            if (!el) {
              return
            }

            let rect = el.getBoundingClientRect()
            if (rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
              rect.right < 0 || rect.left > this.renderer.domElement.clientWidth ) {
              return; // it's off screen
            }

            if (rect) {
              // set the viewport
              var width = rect.right - rect.left;
              var height = rect.bottom - rect.top;
              var left = rect.left;
              var bottom = this.renderer.domElement.clientHeight - rect.bottom;

              this.renderer.setViewport(left, bottom, width, height);
              this.renderer.setScissor(left, bottom, width, height);

              if (scene && camera) {
                this.renderer.render(scene, camera)
              }
            }
          })
        }

        // if (this.composer) {
        //   this.composer.render()
        // } else if (this.scene && this.camera) {
        //   this.renderer.render(this.scene, this.camera)
        // }

        if (this.use3DLabel && this.label3DRenderer && this.scene && this.camera) {
          this.label3DRenderer.render(this.scene, this.camera)
        }
        if (this.use2DLabel && this.label2DRenderer && this.scene && this.camera) {
          this.label2DRenderer.render(this.scene, this.camera)
        }

        for (let entries of this.executionTaskListMapPost) {
          let taskList = entries[1]
          for (let task of taskList) {
            task()
          }
        }
      }
      rAFID = window.requestAnimationFrame(runTasks)
      this.onClean(() => {
        window.cancelAnimationFrame(rAFID)
      })
    },
    handleResize () {
      let runResize = async () => {
        for (let resizer of this.resizeTasks) {
          await resizer()
        }
      }

      let reqID = 0
      let resize = () => {
        cancelIdleCallback(reqID)
        reqID = requestIdleCallback(() => {
          runResize()
        }, { timeout: 1000 })
      }
      window.addEventListener('resize', resize, false)
      this.onClean(() => {
        window.removeEventListener('resize', resize, false)
      })
    },
    handleRootRef () {
      this.rootMounterElement = this.$refs['canvas-root'] || this.$el
    },
    setupLabel3D () {
      this.use3DLabel = true
      this.label3DRenderer = new CSS3DRenderer();
      this.onResize(() => {
        let rect = this.rootMounterElement.getBoundingClientRect()
        this.label3DRenderer.setSize(rect.width, rect.height)
      })
      this.label3DRenderer.domElement.style.position = 'absolute'
      this.label3DRenderer.domElement.style.top = '0px'
      this.label3DRenderer.domElement.style.left = '0px'
      // this.label3DRenderer.domElement.style.zIndex = '0'
      this.touchdiv = this.label3DRenderer.domElement
      this.rootMounterElement.append(this.label3DRenderer.domElement)
    },
    setupLabel2D () {
      this.use2DLabel = true
      this.label2DRenderer = new CSS2DRenderer();
      this.onResize(() => {
        let rect = this.rootMounterElement.getBoundingClientRect()
        this.label2DRenderer.setSize(rect.width, rect.height)
      })
      this.label2DRenderer.domElement.style.position = 'absolute'
      this.label2DRenderer.domElement.style.top = '0px'
      this.label2DRenderer.domElement.style.left = '0px'
      // this.label2DRenderer.domElement.style.zIndex = '0'
      this.touchdiv = this.label2DRenderer.domElement
      this.rootMounterElement.append(this.label2DRenderer.domElement)
    },
    setupGL () {
      let renderer = this.renderer = new WebGLRenderer({
        preserveDrawingBuffer: this.preserveDrawingBuffer,
        antialias: true,
        alpha: true
      })
      this.rootMounterElement.append(renderer.domElement)
      this.touchdiv = renderer.domElement
      // this.renderer.domElement.style.position = 'absolute'
      // this.renderer.domElement.style.top = '0px'
      // this.renderer.domElement.style.left = '0px'
      this.onResize(() => {
        let dpi = window.devicePixelRatio || 1.0
        // if (dpi > 2) {
        //   dpi = 2
        // }
        let rect = this.rootMounterElement.getBoundingClientRect()
        renderer.setSize(rect.width, rect.height)
        renderer.setPixelRatio(dpi)
      })

      this.$on('composer', (v) => {
        this.composer = v
      })
      this.$on('scene', (v) => {
        this.scene = v
      })
      this.$on('camera', (v) => {
        this.camera = v
      })
      this.$emit('renderer', this.renderer)
    }
  },
  beforeDestroy() {
    this.canRun = false
    this.renderer.dispose()
    this.scene && this.scene.traverse((item) => {
      if (item.isMesh) {
        if (item.geometry && item.geometry.dispose) {
          item.geometry.dispose()
        }
      }
    })
  },
  mounted() {
    this.handleRootRef()
    this.handleLoop()
    this.handleResize()
    // this.setupLabel2D()
    // this.setupLabel3D()
    this.setupGL()
  }
}