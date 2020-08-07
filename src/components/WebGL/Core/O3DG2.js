import { Object3D } from 'three'

export let parent = (vm) => vm.$parent// || vm.getRootNode().host

export const idleSleepFree = () => new Promise((resolve) => { window.requestIdleCallback(resolve) })
export const idleSleep = () => new Promise((resolve) => { window.requestIdleCallback(resolve, { timeout: 1000 / 60 }) })
export const rafSleep = () => new Promise((resolve) => { window.requestAnimationFrame(resolve) })

export const getID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

export const makeBreaker = ({ budget = 10 }) => {
  let timer = window.performance.now()
  return async () => {
    let diff = window.performance.now() - timer
    if (diff >= budget) {
      timer = window.performance.now()
      await idleSleep()
    }
  }
}

let memoMap = new Map()
export const CacheMake = (kn, cb) => {
  if (memoMap.has(kn)) {
    return memoMap.get(kn)
  } else {
    let val = cb()
    memoMap.set(kn, val)
    return val
  }
}

export const CacheMakeAsync = async (kn, cb) => {
  if (memoMap.has(kn)) {
    return memoMap.get(kn)
  } else {
    let val = await cb()
    memoMap.set(kn, val)
    return val
  }
}

// // can try to use traverse algorithm in the future. thank you dear Jesus.
// // mark userData of Mehs with needsUpdate and then scan it every loop
// // if needs update then render that group
// // now.sh grow becase of next.js
// // make a framework similar to next.js but for vue and threejs
// // it's not similar to three fiber react
// // it's one of its kind.
// export const doLayout = ({ group, layouts, page, screen }) => {
//   let lay = group
//   if (!lay) {
//     return
//   }
//   lay.$children.forEach((compo, idx) => {
//     if (compo.height) {
//       layouts[compo.layout] = layouts[compo.layout] || {}
//       page.limitY = 0
//       layouts[compo.layout].py = 0

//       // position the image
//       lay.$children.forEach((cp, ii) => {
//         if (ii < idx) {
//           layouts[compo.layout].py += cp.height
//         }
//       })

//       // set max scroll limit
//       lay.$children.forEach((cp) => {
//         page.limitY += -cp.height
//       })

//       page.limitY = page.limitY - screen.height
//     }
//   })
// }

// export const computeStackLayout = ({ group }) => {
// }

export const traverseDown = (vm, ev, data) => {
  if (vm && vm.$children.length > 0) {
    vm.$emit(ev, data)
    vm.$children.forEach((kid) => {
      traverseDown(kid, ev, data)
    })
  }
}

export let traverseParent = (vm, key) => {
  if (vm[key]) {
    return vm[key]
  } else if (parent(vm) && parent(vm)[key]) {
    return parent(vm)[key]
  } else {
    vm = parent(vm)
    if (!vm) {
      return false
    }
    return traverseParent(vm, key)
  }
}

export const checkNan = (vm, value) => {
  if (typeof value === 'undefined') {
    return true
  } else if (isNaN(Number(value))) {
    console.log('isNan Detected for O3D Layout', vm.name, vm)
    return true
  } else {
    return false
  }
}

export let lookupHolder = (vm, key) => {
  if (parent(vm) && parent(vm)[key]) {
    return parent(vm)
  } else {
    vm = parent(vm)
    if (!vm) {
      return false
    }
    return lookupHolder(vm, key)
  }
}

export const visibleHeightAtZDepth = (depth, camera) => {
  // compensate for cameras not positioned at z = 0
  const cameraOffset = camera.position.z
  if (depth < cameraOffset) depth -= cameraOffset
  else depth += cameraOffset

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth)
}

export const visibleWidthAtZDepth = (depth, camera) => {
  const height = visibleHeightAtZDepth(depth, camera)
  return height * camera.aspect
}

export const getScreen = ({ camera, depth = 0 }) => {
  let width = visibleWidthAtZDepth(depth, camera)
  let height = visibleHeightAtZDepth(depth, camera)
  let min = Math.min(width, height)
  let max = Math.max(width, height)
  return {
    min,
    max,
    isVertical: height > width,
    isLandscape: width > height,
    width,
    height
  }
}

export const onEnsure = (arrsGet) => {
  return new Promise((resolve) => {
    let tout = setInterval(() => {
      let val = arrsGet()
      if (val) {
        clearInterval(tout)
        resolve(val)
      }
    })
  })
}

export const loadDeps = async (depMap) => {
  try {
    let arr = await Promise.all(Object.values(depMap))
    let result = {}
    Object.keys(depMap).forEach((kn, key) => {
      result[kn] = arr[key]
    })
    return result
  } catch (e) {
    throw e
  }
}

export const O3DG2 = {
  mixins: [
    require('./O3DVue').O3DVue
  ],
  props: {
    editor: {
      default: false
    },
    px: {
    },
    py: {
    },
    pz: {
    },
    rx: {
    },
    ry: {
    },
    rz: {
    },
    sx: {
    },
    sy: {
    },
    sz: {
    },
    position: {},
    rotation: {},
    scale: {},
    visible: {
      default: true
    },
    layout: {
      default: false
    }
  },
  created () {
    this.self = this
    this.$on('add', (v) => {
      this.o3d.add(v)
    })
    this.$on('remove', (v) => {
      this.o3d.remove(v)
    })
    let vm = this
    this.proxy = new Proxy({}, {
      get: (obj, prop) => {
        return traverseParent(vm, prop)
      }
    })
  },
  data  () {
    return {
      self: false,
      isDev: process.env.NODE_ENV === 'development',
      pi: Math.PI,
      PI: Math.PI,
      isOff: false,
      isOn: true,
      o3d: new Object3D(),
      executionMapID: getID(),
      localExecutionTasks: [],
      localExecutionTasksPost: [],
      cleanerTasks: []
    }
  },
  async mounted () {
    this.ctx.executionTaskListMap.set(this.executionMapID, this.localExecutionTasks)
    this.onClean(() => {
      this.ctx.executionTaskListMap.set(this.executionMapID, [])
    })
    this.ctx.executionTaskListMapPost.set(this.executionMapID, this.localExecutionTasksPost)
    this.onClean(() => {
      this.ctx.executionTaskListMapPost.set(this.executionMapID, [])
    })

    this.o3d.visible = this.visible
    this.$watch('visible', () => {
      this.o3d.visible = this.visible
    })

    this.onLoop(() => {
      this.syncO3D()
    })
    this.syncO3D()

    this.$watch('px', this.syncO3D)
    this.$watch('py', this.syncO3D)
    this.$watch('pz', this.syncO3D)

    this.$watch('sx', this.syncO3D)
    this.$watch('sy', this.syncO3D)
    this.$watch('sz', this.syncO3D)

    this.$watch('rx', this.syncO3D)
    this.$watch('ry', this.syncO3D)
    this.$watch('rz', this.syncO3D)

    this.$watch('position', this.syncO3D)
    this.$watch('rotation', this.syncO3D)
    this.$watch('scale', this.syncO3D)

    this.setupO3D()
  },
  computed: {
    ctx () {
      return this.proxy
    },
    renderRootComponent () {
      return lookupHolder(this, 'isRenderRoot')
    },
    renderRoot () {
      return lookupHolder(this, 'isRenderRoot')
    },
    renderRootElement () {
      return this.ctx.rootMounterElement
    },
    element () {
      return this.ctx.rootMounterElement
    },
    currentCamera () {
      return this.ctx.camera
    },
    curentScene () {
      return this.ctx.scene
    }
  },
  methods: {
    onLoad (map) {
      return loadDeps(map)
    },
    onEnsure (fn, doer) {
      return onEnsure(fn, doer)
    },
    syncO3D () {
      if (this.layout) {
        let layoutObject = this.ctx.layouts
        if (layoutObject) {
          let settings = layoutObject[this.layout]
          if (settings) {
            this.o3d.position.x = checkNan(this, (settings.px)) ? 0 : Number(settings.px)
            this.o3d.position.y = checkNan(this, (settings.py)) ? 0 : Number(settings.py)
            this.o3d.position.z = checkNan(this, (settings.pz)) ? 0 : Number(settings.pz)

            this.o3d.rotation.x = checkNan(this, (settings.rx)) ? 0 : Number(settings.rx)
            this.o3d.rotation.y = checkNan(this, (settings.ry)) ? 0 : Number(settings.ry)
            this.o3d.rotation.z = checkNan(this, (settings.rz)) ? 0 : Number(settings.rz)

            this.o3d.scale.x = checkNan(this, (settings.sx)) ? 1 : Number(settings.sx)
            this.o3d.scale.y = checkNan(this, (settings.sy)) ? 1 : Number(settings.sy)
            this.o3d.scale.z = checkNan(this, (settings.sz)) ? 1 : Number(settings.sz)
          }
        }
      }

      if (typeof this.px !== 'undefined') {
        this.o3d.position.x = checkNan(this, (this.px)) ? 0 : Number(this.px)
      }
      if (typeof this.py !== 'undefined') {
        this.o3d.position.y = checkNan(this, (this.py)) ? 0 : Number(this.py)
      }
      if (typeof this.pz !== 'undefined') {
        this.o3d.position.z = checkNan(this, (this.pz)) ? 0 : Number(this.pz)
      }

      if (typeof this.sx !== 'undefined') {
        this.o3d.scale.x = checkNan(this, (this.sx)) ? 1 : Number(this.sx)
      }
      if (typeof this.sy !== 'undefined') {
        this.o3d.scale.y = checkNan(this, (this.sy)) ? 1 : Number(this.sy)
      }
      if (typeof this.sz !== 'undefined') {
        this.o3d.scale.z = checkNan(this, (this.sz)) ? 1 : Number(this.sz)
      }

      if (typeof this.rx !== 'undefined') {
        this.o3d.rotation.x = checkNan(this, (this.rx)) ? 0 : Number(this.rx)
      }
      if (typeof this.ry !== 'undefined') {
        this.o3d.rotation.y = checkNan(this, (this.ry)) ? 0 : Number(this.ry)
      }
      if (typeof this.rz !== 'undefined') {
        this.o3d.rotation.z = checkNan(this, (this.rz)) ? 0 : Number(this.rz)
      }

      if (this.position) {
        this.o3d.position.x = this.position.x
        this.o3d.position.y = this.position.y
        this.o3d.position.z = this.position.z
      }
      if (this.rotation) {
        this.o3d.rotation.x = this.rotation.x
        this.o3d.rotation.y = this.rotation.y
        this.o3d.rotation.z = this.rotation.z
      }
      if (this.scale) {
        this.o3d.scale.x = this.scale.x
        this.o3d.scale.y = this.scale.y
        this.o3d.scale.z = this.scale.z
      }
    },
    getScreen,
    setupO3D () {
      if (this.$parent) {
        this.$parent.$emit('add', this.o3d)
        this.$parent.$emit('self', this)
      }
      this.$emit('o3d', this.o3d)
    },
    onLoop (fnc) {
      this.localExecutionTasks.push(fnc)
    },
    onLoopPost (fnc) {
      this.localExecutionTasksPost.push(fnc)
    },
    onResize (fnc) {
      fnc()
      this.ctx.resizeTasks.push(fnc)
    },
    onClean (fnc) {
      this.cleanerTasks.push(fnc)
    }
  },
  beforeDestroy() {
    this.o3d.visible = false
    try {
      if (this.$parent) {
        this.$parent.$emit('remove', this.o3d)
      }
      this.cleanerTasks.forEach(e => e())
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }
}

export default O3DG2
