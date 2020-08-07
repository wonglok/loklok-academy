import { PerspectiveCamera } from 'three'

export class PCamera {
  constructor ({ element, onResize }) {
    let rect = false
    if (!element) {
      throw new Error('require element')
    }
    if (!onResize) {
      throw new Error('require onResize Hook')
    }
    rect = element.getBoundingClientRect()
    let camera = new PerspectiveCamera(75, rect.width / rect.height, 0.1, 10000000000)
    onResize(() => {
      rect = element.getBoundingClientRect()
      camera.aspect = rect.width / rect.height
      camera.updateProjectionMatrix()
    })

    return camera
  }
}
