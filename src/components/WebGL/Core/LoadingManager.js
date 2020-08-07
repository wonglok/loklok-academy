import { DefaultLoadingManager as DLM, Clock } from 'three'
DLM.stats = { itemsLoaded: 0, itemsTotal: 1 }
DLM.hooks = []

let tasks = []
let add = v => tasks.push(v)
let run = () => {
  requestAnimationFrame(run)
  tasks.forEach(e => e())
}
run()
class ValueDamper {
  constructor (v = 0) {
    // this.minY = limit.ny,
    // this.maxY = limit.y
    this.latestVal = v
    this.dampedVal = v
    this.clock = new Clock()
    add(() => {
      let delta = this.clock.getDelta()
      let diff = (this.latestVal - this.dampedVal) * (delta * 1000 / 60 * 0.25)
      this.dampedVal += diff
      if (this.dampedVal >= 0.998) {
        DLM.hooks.forEach(e => e(1))
      } else {
        DLM.hooks.forEach(e => e(this.dampedVal))
      }
    })
  }

  set value (v) {
    this.latestVal = v
  }

  get value () {
    return this.dampedVal
  }
}

let LoadingProgress = new ValueDamper(0)

DLM.onURL = (url, progress) => {
  let { itemsLoaded, itemsTotal } = DLM.stat
  let overallProgressDetailed = itemsLoaded / itemsTotal + progress / itemsTotal
  LoadingProgress.value = (overallProgressDetailed)
  // DLM.hooks.forEach(e => e(LoadingProgress.value))
}
DLM.onProgress = (url, itemsLoaded, itemsTotal) => {
  LoadingProgress.value = (itemsLoaded / itemsTotal)
  DLM.stat = { itemsLoaded, itemsTotal }
  // DLM.hooks.forEach(e => e(LoadingProgress.value))
}
DLM.onStart = (url, itemsLoaded, itemsTotal) => {
  LoadingProgress.value = (itemsLoaded / itemsTotal)
  DLM.stat = { itemsLoaded, itemsTotal }
  // DLM.hooks.forEach(e => e(LoadingProgress.value))
}
DLM.onEnd = (url, itemsLoaded, itemsTotal) => {
  LoadingProgress.value = (itemsLoaded / itemsTotal)
  DLM.stat = { itemsLoaded, itemsTotal }
  // DLM.hooks.forEach(e => e(LoadingProgress.value))
}

DLM.sustain = () => {
  DLM.stats.itemsLoaded = DLM.stats.itemsLoaded || 0
  DLM.stats.itemsTotal = DLM.stats.itemsTotal || 1
  DLM.stats.itemsLoaded += 1

  let { itemsLoaded, itemsTotal } = DLM.stat
  LoadingProgress.value = (itemsLoaded / itemsTotal)
  // DLM.hooks.forEach(e => e(LoadingProgress.value))
}

export const LoadingManager = DLM
