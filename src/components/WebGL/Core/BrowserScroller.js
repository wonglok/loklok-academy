export class BrowserScroller {
  constructor ({ onLoop, scroller, init = 0 }) {
    class ValueDamper {
      constructor (v = 0) {
        // this.minY = limit.ny,
        // this.maxY = limit.y
        this.latestVal = v
        this.dampedVal = v
        this.diff = 0
        onLoop(() => {
          this.deltaInterval = 0.016667
          this.diff = (this.latestVal - this.dampedVal) * (this.deltaInterval * 1000 / 60 * 0.25)
          this.dampedVal += this.diff
        })
      }

      set value (v) {
        this.latestVal = v
      }

      get value () {
        return this.dampedVal
      }
      get now () {
        return this.latestVal
      }
    }

    let SmoothY = new ValueDamper(init)
    SmoothY.value = init

    scroller.addEventListener('scroll', () => {
      let value = (scroller.scrollTop) / window.innerHeight
      if (value < 0) {
        value = 0
      }
      SmoothY.value = value
    }, true)

    return SmoothY
  }
}