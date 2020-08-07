import { Object3D, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class CamSync {
  constructor ({ target, onLoop, camera, element }) {
    this.onLoop = onLoop
    this.camera = camera
    this.element = element
    this.target = target

    this.run({ target })
  }
  async run ({ target }) {
    let lookTarget = new Object3D()
    target.add(lookTarget)

    let charLookAtTargetLast = new Vector3()
    let charLookAtTargetTemp = new Vector3()
    let charLookAtTarget = new Vector3(0, 13, 20)
    this.camera.position.z = 20
    this.camera.position.y = 0
    lookTarget.position.y = -13
    lookTarget.position.z = 23
    this.controls = new OrbitControls(this.camera, this.element)

    this.onLoop(() => {
      this.controls.update()
      lookTarget.updateMatrix()
      lookTarget.updateMatrixWorld()
      lookTarget.updateWorldMatrix()
      charLookAtTarget.setFromMatrixPosition(lookTarget.matrixWorld)

      let diff = charLookAtTargetTemp.copy(charLookAtTargetLast).sub(charLookAtTarget)
      this.camera.position.sub(diff)
      charLookAtTargetLast.copy(charLookAtTarget)

      this.controls.target0.lerp(charLookAtTarget, 0.15)
      this.controls.target.lerp(charLookAtTarget, 0.15)
      this.controls.saveState()
    })
  }
}