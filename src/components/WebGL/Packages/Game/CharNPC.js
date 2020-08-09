import { loadFBX } from '../../Core/loadFBX'
import { loadGLTF } from '../../Core/loadGLTF'
// import { makeBreaker } from '../../Core/O3DG2'
import { Object3D, MeshPhysicalMaterial } from 'three'
// import { Patch } from './Patch'
import { Actions } from './Actions'
import { RGBFormat, LinearEncoding } from 'three'

let SharedCache = new Map()

export class CharNPC {
  static characters = [
    // { name: 'mann-high-poly', url: require('file-loader!./model/mann-high-poly.glb') },
    { name: 'glassman', url: require('file-loader!./model/glassman.glb') },
    // { name: 'mann-low-poly', url: require('file-loader!./model/mann-low-poly.glb') },
    { name: 'peter', url: require('file-loader!./model/peter.glb') },
    { name: 'alex', url: require('file-loader!./model/alex.glb') },
    { name: 'steve', url: require('file-loader!./model/steve.glb') },
    { name: 'joe', url: require('file-loader!./model/joe.glb') },
    { name: 'suzie', url: require('file-loader!./model/suzie.glb') },
    { name: 'swat', url: require('file-loader!./model/swat.glb') },
    { name: 'girl', url: require('file-loader!./model/girl.glb') },
    { name: 'frank', url: require('file-loader!./model/frank.glb') },
    { name: 'david', url: require('file-loader!./model/david.glb') },
    { name: 'janice', url: require('file-loader!./model/janice.glb') },
    { name: 'ricky', url: require('file-loader!./model/ricky.glb') }
  ]

  constructor ({ matcap = false, opacity, onLoop, char = 'peter', readyMoveName = 'Gangnam Style', chroma }) {
    this.readyMoveName = readyMoveName
    this.char = char
    this.onLoop = onLoop
    this.chroma = chroma
    this.opacity = opacity
    this.matcap = matcap

    // default
    this.url = require('file-loader!./model/peter.glb')
    let characters = CharNPC.characters
    let charObj = characters.find(e => e.name === char)
    if (charObj) {
      this.url = charObj.url
    }

    this.skeleton = {}
    this.out = {}
    this.o3d = new Object3D()
    this.out.o3d = this.o3d
    if (this.url.indexOf('.fbx') !== -1) {
      this.out.done = CharNPC.loadModel({ url: this.url })
        .then(async (scene) => {
          scene.scale.set(0.105, 0.105, 0.105)
          return this.postSetup({ scene })
        })
    } else if (this.url.indexOf('.glb') !== -1) {
      this.out.done = CharNPC.loadModel({ url: this.url })
        .then(async (gltf) => {
          gltf.scene.scale.set(10.5, 10.5, 10.5)
          gltf.scene.rotation.x = -0.5 * Math.PI
          return this.postSetup({ scene: gltf.scene })
        })
    }
  }

  act ({ name }) {
    if (this.actions) {
      this.actions.act({ name })
    }
  }

  actOnce ({ act, resting }) {
    if (this.actions) {
      this.actions.actOnce({ act, resting })
    }
  }

  setOpacity (v) {
    this.out.o3d.traverse(async (item) => {
      if (item.isMesh) {
        item.material.transparent = true
        item.material.opacity = v
      }
    })
  }
  setMatCap (v) {
    this.out.o3d.traverse(async (item) => {
      if (item.isMesh) {
        let old = item.material
        if (item.name !== 'Mesh_0') {
          item.material = v
        }
        v.skinning = true

        if (this.char === 'glassman') {
          v.flatShading = true
        }

        v.transparent = true
        v.opacity = old.opacity
        // if (this.chroma) {
        //   v.envMap = this.chroma.out.envMap
        // }
      }
    })
  }

  static async preloadByName ({ name }) {
    let char = CharNPC.characters.find(e => e.name === name)
    if (char) {
      return await CharNPC.loadModel({ url: char.url })
    }
  }

  static async loadModel ({ url }) {
    // if (SharedCache.has(url)) {
    //   return SharedCache.get(url).clone()
    // }
    if (url.indexOf('.fbx') !== -1) {
      let fbx = await loadFBX(url)
      // SharedCache.set(url, fbx)
      return fbx
    } else if (url.indexOf('.glb') !== -1) {
      let gltf = await loadGLTF(url)
      // SharedCache.set(url, gltf)
      return gltf
    }
  }

  static async loadModelShared ({ url }) {
    if (SharedCache.has(url)) {
      return SharedCache.get(url).clone()
    }
    if (url.indexOf('.fbx') !== -1) {
      let fbx = await loadFBX(url)
      SharedCache.set(url, fbx)
      return fbx
    } else if (url.indexOf('.glb') !== -1) {
      let gltf = await loadGLTF(url)
      SharedCache.set(url, gltf)
      return gltf
    }
  }

  runFixObject ({ scene }) {
    let replaceNumber = (name) => {
      name = name.replace('mixamorig1', 'mixamorig')
      name = name.replace('mixamorig2', 'mixamorig')
      name = name.replace('mixamorig3', 'mixamorig')
      name = name.replace('mixamorig4', 'mixamorig')
      name = name.replace('mixamorig5', 'mixamorig')
      name = name.replace('mixamorig6', 'mixamorig')
      name = name.replace('mixamorig7', 'mixamorig')
      name = name.replace('mixamorig8', 'mixamorig')
      name = name.replace('mixamorig9', 'mixamorig')
      name = name.replace('mixamorig', 'mixamorig')
      return name
    }

    let fixName = (item) => {
      item.name = replaceNumber(item.name)
      if (item.type === 'Bone') {
        this.skeleton[item.name] = item
      }
    }

    scene.traverse((item) => {
      fixName(item)
      if (item.isMesh) {
        if (item.material.map) {
          item.material.map.encoding = LinearEncoding
        }
        if (item.material.alphaMap) {
          item.material.alphaMap.encoding = LinearEncoding
        }
        if (item.material.metalnessMap) {
          item.material.metalnessMap.encoding = LinearEncoding
        }
        if (item.material.normalMap) {
          item.material.normalMap.encoding = LinearEncoding
        }
        if (item.material.roughnessMap) {
          item.material.roughnessMap.encoding = LinearEncoding
        }
        // item.material.toneMapped = true
        item.material.transparent = true
        item.frustumCulled = false
      }
    })
  }

  async postSetup ({ scene }) {
    this.runFixObject({ scene })
    scene.traverse(async (item) => {
      if (item.isMesh) {
        let o = item.material

        if (item.name === 'Hair') {
          if (o.map) {
            o.map.format = RGBFormat
          }
          item.material = new MeshPhysicalMaterial({
            map: o.map,
            normalMap: o.normalMap,
            alphaMap: o.alphaMap,
            roughnessMap: o.roughnessMap,
            reflectivity: 0,
            skinning: true,
            transparent: true
          })
        } else {
          item.material = new MeshPhysicalMaterial({
            map: o.map,
            normalMap: o.normalMap,
            alphaMap: o.alphaMap,
            // roughnessMap: o.roughnessMap,
            reflectivity: 0,
            skinning: true,
            transparent: true
          })
        }

        if (item.name === 'Mesh_1' && this.chroma) {
          item.material = o
          item.material.envMap = this.chroma.out.envMap
        }
        if (item.name === 'Mesh_0' && this.chroma) {
          item.material = o
          item.material.envMap = this.chroma.out.envMap
        }

        if (this.chroma && this.char === 'glassman') {
          // item.material.flatShading = true
          this.chroma.out.material.flatShading = true
          this.chroma.out.material.skinning = true
          item.material = this.chroma.out.material
        }
        if (this.matcap) {
          this.matcap.transparent = true
          this.matcap.opacity = item.material.opacity
          item.material = this.matcap
        }
        item.material.opacity = this.opacity
      }
    })

    this.actions = new Actions({ actor: scene, defaultAction: this.readyMoveName, onLoop: this.onLoop })
    return this.actions.out.done.then(() => {
      this.o3d.add(scene)
      this.isReady = true
    })
  }
}