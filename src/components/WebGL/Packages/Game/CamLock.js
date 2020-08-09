import { Object3D, Vector3 } from 'three'

export class CamLock {
  constructor ({ target, onLoop, camera}) {
    this.onLoop = onLoop
    this.camera = camera
    this.target = target

    this.run({ target })
  }
  async run ({ target }) {
    let lookTarget = new Object3D()
    target.add(lookTarget)
    lookTarget.position.y = -10

    let TempVec3 = new Vector3()
    let TempVec3Lerp = TempVec3.clone()
    this.onLoop(() => {
      lookTarget.updateMatrixWorld()
      TempVec3.setFromMatrixPosition(lookTarget.matrixWorld)
      TempVec3Lerp.lerp(TempVec3, 0.1)

      this.camera.position.x = TempVec3.x
      this.camera.position.y = TempVec3.y
      this.camera.position.z = TempVec3.z + 17
      TempVec3Lerp.y += -0.1
      this.camera.lookAt(TempVec3Lerp)
    })
  }
}