export class Bloomer {
  constructor ({ renderer, element, scene, camera, onLoop, onClean, onResize, gui, onRefresh = () => {}, settings = false }) {
    this.gui = gui
    this.onLoop = onLoop
    this.onResize = onResize
    this.onClean = onClean
    this.renderer = renderer
    this.element = element
    this.scene = scene
    this.camera = camera

    /* BLOOM START */
    let { Vector2 } = require('three/src/math/Vector2')
    let { EffectComposer } = require('three/examples/jsm/postprocessing/EffectComposer')
    let { RenderPass } = require('three/examples/jsm/postprocessing/RenderPass')
    let { UnrealBloomPass } = require('three/examples/jsm/postprocessing/UnrealBloomPass')
    let copy2clip = require('copy-to-clipboard')

    let Params = {
      exposure: 1.1,
      bloomStrength: 1.5,
      bloomThreshold: 0.1333,
      bloomRadius: 1.3
    }
    if (settings) {
      Params = settings
    }
    // let renderer = this.ctx.renderer
    // let element = this.ctx.renderRootElement

    let rect = element.getBoundingClientRect()
    let renderScene = new RenderPass(scene, camera)
    let dpi = 2 // window.devicePixelRatio || 1.0
    let bloomPass = new UnrealBloomPass(new Vector2(rect.width, rect.height), 1.5, 0.4, 0.85)
    renderScene.setSize(rect.width, rect.height)
    this.Bloom = bloomPass

    bloomPass.threshold = Params.bloomThreshold
    bloomPass.strength = Params.bloomStrength
    bloomPass.radius = Params.bloomRadius

    onRefresh((settings) => {
      bloomPass.threshold = settings.bloomThreshold
      bloomPass.strength = settings.bloomStrength
      bloomPass.radius = settings.bloomRadius
    })

    this.composer = new EffectComposer(renderer)
    this.composer.setPixelRatio(dpi)
    this.composer.addPass(renderScene)
    this.composer.addPass(bloomPass)

    // this.onResize(() => {
    //   let rect = element.getBoundingClientRect()
    //   let dpi = window.devicePixelRatio || 1.0
    //   bloomPass.setSize(rect.width * dpi, rect.height * dpi)
    //   renderScene.setSize(rect.width * dpi, rect.height * dpi)
    //   this.composer.setPixelRatio(dpi)
    // })

    if (this.gui) {
      this.gui.add(this.Bloom, 'threshold')
      this.gui.add(this.Bloom, 'strength')
      this.gui.add(this.Bloom, 'radius')
      let copy = () => {
        copy2clip(`
      exposure: ${Params.exposure},
      bloomStrength: ${Params.bloomStrength},
      bloomThreshold: ${Params.bloomThreshold},
      bloomRadius: ${Params.bloomRadius}
        `)
      }
      this.gui.add({ copy }, 'copy')
    }
    return this.composer
  }
}