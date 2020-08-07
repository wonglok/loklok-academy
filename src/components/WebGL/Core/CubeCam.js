import { CubeCamera, MeshBasicMaterial, Vector3 } from "three";

/*
*/
export class CubeCam {
  constructor ({ renderer, scene, loop, res = 32, clean, camera }) {
    // this.cubeRenderTarget = new WebGLCubeRenderTarget(256, {
    //   encoding: sRGBEncoding, // since gamma is applied during rendering, the cubeCamera renderTarget texture encoding must be sRGBEncoding
    //   format: RGBAFormat
    // })
    this.renderer = renderer
    this.scene = scene
    this.skipRenderO3D = []
    this.camera = camera
    this.loop = loop
    let cubeCamera = new CubeCamera(1, 1000, res)
    this.cubeCamera = cubeCamera
    this.chromeMaterial = new MeshBasicMaterial({ color: 0xffffff, envMap: this.cubeCamera.renderTarget.texture })

    // this.cubeCamera.renderTarget.texture.mapping = CubeRefractionMapping
    // this.cubeCamera.renderTarget.texture.mapping = CubeReflectionMapping
    let skip = false
    let worldPos = new Vector3()
    this.update = () => {
      if (skip) {
        return
      }
      if (!this.skipRenderO3D) {
        return
      }

      this.skipRenderO3D.map(e => {
        e.visible = false
      })
      worldPos.setFromMatrixPosition(this.camera.matrixWorld)
      this.cubeCamera.position.copy(worldPos)
      this.cubeCamera.update(this.renderer, this.scene)
      this.skipRenderO3D.map(e => {
        e.visible = true
      })
    }
    loop(() => {
      this.update()
    })
    clean(() => {
      skip = true
    })

    this.out = {
      material: this.chromeMaterial,
      envMap: this.cubeCamera.renderTarget.texture
    }

    this.add = (v) => {
      this.skipRenderO3D.push(v)
    }
  }
}