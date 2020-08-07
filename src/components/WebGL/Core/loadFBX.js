import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { FileLoader } from 'three'
import { LoadingManager } from './LoadingManager'

export const rafSleep = () => new Promise((resolve) => { window.requestAnimationFrame(resolve) })

let localforage = require('localforage')
let loadArrayBuffer = async (url) => {
  return new Promise((resolve) => {
    let loaderFile = new FileLoader(LoadingManager)
    loaderFile.setResponseType('arraybuffer')
    loaderFile.load(url, (arrbuff) => {
      resolve(arrbuff)
    }, (v) => {
      let manager = LoadingManager
      if (manager.onURL) {
        manager.onURL(url, v.loaded / v.total)
      }
    })
  })
}

let provideArrayBuffer = async (url, store) => {
  let NS = 'array-buffer-@' + url
  try {
    var value = await store.getItem(NS);
    if (!value) {
      let arrayBuffer = await loadArrayBuffer(url)
      value = arrayBuffer
      await store.setItem(NS, arrayBuffer)
    }
    // console.log(value)
    return value
  } catch (err) {
    console.log(err)
    await store.removeItem(NS)
  }
}

let loaderModel = new FBXLoader(LoadingManager)

let modelParser = (blobURL) => {
  return new Promise((resolve) => {
    loaderModel.load(blobURL, (stuff) => {
      resolve(stuff)
    })
  })
}

let getBlobFromArrayBuffer = async (arrBuff) => {
  let blob = new Blob([arrBuff], { type: 'application/octet-stream' })
  let url = URL.createObjectURL(blob)
  return url
}

var store = localforage.createInstance({
  name: 'localFBX'
});

export const loadFBX = async (url) => {
  let arrayBuffer = await provideArrayBuffer(url, store)
  // await rafSleep()
  let bloblURL = await getBlobFromArrayBuffer(arrayBuffer)
  // await rafSleep()
  let gltfobj = await modelParser(bloblURL)
  // await rafSleep()

  return gltfobj
}

export class StoreFBXLoader {
  load (url, resolve) {
    loadFBX(url)
      .then((gltf) => {
        resolve(gltf)
      })
  }
}
