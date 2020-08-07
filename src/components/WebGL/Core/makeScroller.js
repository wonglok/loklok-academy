import { Clock } from 'three'
// can scroll how many pages = limit.y
export const makeScroller = ({ loop, mounter, limit = { direction: 'vertical', initValue: 0, speed: 1, canRun: true, ny: 0, y: 1000 }, onMove = () => {} }) => {
  let state = {
    tsY: 0,
    tdY: 0,
    taY: 0,
    inertiaY: 1
  }
  limit.speed = limit.speed || 1
  if (!limit.direction) {
    limit.direction = 'vertical'
  }

  class ValueDamper {
    constructor (v = 0) {
      // this.minY = limit.ny,
      // this.maxY = limit.y
      this.latestVal = v
      this.dampedVal = v
      this.state = state
      this.limit = limit
      this.diff = 0
      this.clock = new Clock()
      loop(() => {
        this.deltaTime = this.clock.getDelta()
        this.deltaInterval = 0.016667
        this.diff = (this.latestVal - this.dampedVal) * (this.deltaInterval * 1000 / 60 * 0.25)
        this.dampedVal += this.diff
      })
    }

    set value (v) {
      this.latestVal = v
      state.taY = v
    }

    get value () {
      return this.dampedVal
    }
    get progress () {
      return this.dampedVal / limit.y
    }
  }

  let browserScrollBox = document.querySelector('.broswer-scroll-box')
  let scrollAmount = limit.initValue || 0
  let SmoothY = new ValueDamper(limit.initValue || 0)
  SmoothY.value = 0

  if (browserScrollBox) {
    browserScrollBox.addEventListener('scroll', () => {
      let value = (browserScrollBox.scrollTop) / window.innerHeight
      if (value < 0) {
        value = 0
      }
      SmoothY.value = value
    }, true)
  } else {
    mounter.addEventListener('wheel', (evt) => {
      evt.preventDefault()
      if (!limit.canRun) {
        return
      }
      let delta = evt.deltaY * limit.speed
      if (limit.direction === 'horizontal') {
        delta = evt.deltaX
      }
      scrollAmount += delta
      if (scrollAmount < (limit.ny * window.innerHeight)) {
        scrollAmount -= delta
      } else if (scrollAmount > (limit.y * window.innerHeight)) {
        scrollAmount -= delta
      }
      SmoothY.value = scrollAmount / window.innerHeight
      onMove(SmoothY)
    }, { passive: false })

    mounter.addEventListener('touchstart', (evt) => {
      evt.preventDefault()
      let t1 = evt.touches[0]

      let key = 'pageY'
      if (limit.direction === 'horizontal') {
        key = 'pageX'
      }
      // console.log(t1)
      state.tsY = t1[key]
      state.tD = true
    }, { passive: false })
    mounter.addEventListener('touchmove', (evt) => {
      evt.preventDefault()
      if (!limit.canRun) {
        return
      }
      let key = 'pageY'
      if (limit.direction === 'horizontal') {
        key = 'pageX'
      }
      if (state.tD) {
        let t1 = evt.touches[0]
        // console.log(t1)
        state.tdY = t1[key] - state.tsY
        state.tsY = t1[key]
        state.inertiaY = 1.5
      }
      onMove(SmoothY)
    }, { passive: false })
    mounter.addEventListener('touchend', () => {
      state.tsY = 0
      state.tD = false
    }, { passive: false })
    mounter.addEventListener('touchcancel', () => {
      state.tsY = 0
      state.tD = false
    }, { passive: false })

    loop(() => {
      if (!limit.canRun) {
        state.tdY = 0
        state.inertiaY = 0
        return
      }

      state.inertiaY *= 0.75
      let delta = state.inertiaY * state.tdY * 2.11 / 1000 * limit.speed
      state.taY -= delta

      if (state.taY <= limit.ny) {
        state.taY += delta
      } else if (state.taY >= limit.y) {
        state.taY += delta
      }

      if (state.inertiaY > 0.023) {
        SmoothY.value = state.taY
      }
    })
  }

  return SmoothY
}
