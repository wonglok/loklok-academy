import { OrthographicCamera } from 'three'

export class OCamera {
  constructor ({ element, onResize }) {
    let rect = false
    if (!element) {
      throw new Error('require element')
    }
    if (!onResize) {
      throw new Error('require onResize Hook')
    }
    let { width, height } = rect
    rect = element.getBoundingClientRect()
    let camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -height * 20.0 * 0, height * 20.0)
    let syncSize = () => {
      rect = element.getBoundingClientRect()
      let { width, height } = rect
      let [left, right, top, bottom, near, far] = [width / -2, width / 2, height / 2, height / -2, -height * 20.0, height * 20.0]
      camera.top = top
      camera.bottom = bottom
      camera.left = left
      camera.right = right
      camera.near = near * 0
      camera.far = far
      camera.updateProjectionMatrix()
    }
    syncSize()

    onResize(() => {
      syncSize()
    })

    return camera
  }
}

/*

*/
