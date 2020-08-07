import { CubeTexture, CanvasTexture } from "three"

const easeOutSine = (t, b, c, d) => {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b
}

const easeOutQuad = (t, b, c, d) => {
  t /= d
  return -c * t * (t - 2) + b
}

export class TouchTexture {
  constructor () {
    this.size = 32
    this.width = 32
    this.height = 32
    this.width = this.height = this.size

    this.maxAge = 350
    this.radius = 0.1 * this.size
    // this.radius = 0.15 * 1000

    this.speed = 1.33 / this.maxAge
    // this.speed = 0.01

    this.trail = []
    this.last = null

    this.initTexture()

    // this.primaryColorObj = new Color('#101777')
  }

  initTexture () {
    this.canvas = document.createElement('canvas')

    // document.body.appendChild(this.canvas)
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.canvas.id = 'touchTexture'
    // this.canvas.style.width = this.canvas.style.height = `${
    //   this.canvas.width
    // }px`

    // var gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height)
    // var gradient = this.ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.width / 2)

    // Add three color stops
    // gradient.addColorStop(0, 'rgba(255,255,255,1.0)')
    // gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)')
    // gradient.addColorStop(1, 'rgba(255,255,255,1.0)')
    // this.gradient = gradient
  }

  update () {
    this.clear()
    let speed = this.speed
    this.trail.forEach((point, i) => {
      let f = point.force * speed * (1 - point.age / this.maxAge)
      // let x = point.x
      // let y = point.y

      point.x += point.vx * f
      point.y += point.vy * f
      point.age++
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1)
      }
    })

    this.trail.forEach((point) => {
      this.drawPoint(point)
    })

    // this.drawPoints()

    // this.ctx.fillStyle = "rgba(255,0,0,0.5)"
    // this.ctx.fillRect(0, 0, 200, 200)
    // this.ctx.fillStyle = "rgba(0,255,0,0.5)"
    // this.ctx.fillRect(50, 0, 200, 200)
    // this.test()
  }

  clear () {
    // this.ctx.fillStyle = 'hsl(61, 100%, 100%)'
    // this.ctx.fillStyle = 'white'

    // this.ctx.fillStyle = '#' + this.primaryColorObj.getHexString()

    this.ctx.fillStyle = 'transparent'

    // this.ctx.fillStyle = this.gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
  addTouch (point) {
    let force = 0
    let vx = 0
    let vy = 0
    const last = this.last
    if (last) {
      const dx = point.x - last.x
      const dy = point.y - last.y
      if (dx === 0 && dy === 0) return
      const dd = dx * dx + dy * dy
      let d = Math.sqrt(dd)
      vx = dx / d
      vy = dy / d

      force = Math.min(dd * 10000, 1)
      // force = Math.sqrt(dd)* 50.
      // force = 1
    }
    this.last = {
      x: point.x,
      y: point.y
    }
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy })
  }
  drawPoint (point) {
    const ctx = this.ctx
    const pos = {
      x: point.x * this.width,
      y: (1 - point.y) * this.height
    }

    let intensity = 1

    if (point.age < this.maxAge * 0.3) {
      intensity = easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1)
    } else {
      intensity = easeOutQuad(
        1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7),
        0,
        1,
        1
      )
    }
    intensity *= point.force

    const radius = this.radius
    let color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) *
      255}, ${intensity * 255}`

    color = `${(intensity * 255).toFixed(0)}, 65%, 55%`
    // color = `${(this.primaryColorObj.getHSL(this.primaryColorObj).h * 360).toFixed(0)}, 100%, 87%`

    let offset = this.size * 5
    ctx.shadowOffsetX = offset // (default 0)
    ctx.shadowOffsetY = offset // (default 0)
    ctx.shadowBlur = radius // (default 0)
    ctx.shadowColor = `hsla(${color},${0.35 * intensity})` // (default transparent black)

    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(255,0,0,1)'
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2)
    this.ctx.fill()
  }
}
// let mouse = new Vector2()
// let on = {
//   onTouchMove (ev) {
//     ev.preventDefault()

//     const touch = ev.targetTouches[0]

//     mouse = {
//       x: touch.clientX / window.innerWidth,
//       y: 1 - touch.clientY / window.innerHeight
//     }

//     touchTextures.forEach(e => e.addTouch(mouse))
//     // t.addTouch(mouse)
//     // onMouseMove({ clientX: touch.clientX, clientY: touch.clientY })
//   },
//   onMouseMove (ev) {
//     mouse = {
//       x: ev.clientX / window.innerWidth,
//       y: 1 - ev.clientY / window.innerHeight
//     }

//     touchTextures.forEach(e => e.addTouch(mouse))
//   }
// }

// window.addEventListener('d-mousemove', on.onMouseMove, { passive: false })
// window.addEventListener('d-touchmove', on.onTouchMove, { passive: false })

export class CanvasPaintTexture {
  constructor ({ onLoop }) {
    this.out = {}
    this.onLoop = onLoop
    let touchy = new TouchTexture()
    let cubeTexture = new CubeTexture([
      touchy.canvas,
      touchy.canvas,
      touchy.canvas,
      touchy.canvas,
      touchy.canvas,
      touchy.canvas
    ])
    let texture = new CanvasTexture(touchy.canvas)
    for (var i = 0; i < 60; i++) {
      touchy.addTouch({
        x: Math.random(),
        y: Math.random()
      })
    }
    this.onLoop(() => {
      if (Math.random() < 1) {
        touchy.addTouch({
          x: Math.random(),
          y: Math.random()
        })
        touchy.addTouch({
          x: Math.random(),
          y: Math.random()
        })
      }
      texture.needsUpdate = true
      cubeTexture.needsUpdate = true
      touchy.update()
    })

    this.out.canvas = touchy.canvas
    this.out.envMap = cubeTexture
    this.out.texture = texture
  }
}


export class CanvasPaintTexture2D {
  constructor ({ onLoop }) {
    this.out = {}
    this.onLoop = onLoop
    let touchy = new TouchTexture()
    let texture = new CanvasTexture(touchy.canvas)
    for (var i = 0; i < 60; i++) {
      touchy.addTouch({
        x: Math.random(),
        y: Math.random()
      })
    }
    this.onLoop(() => {
      if (Math.random() < 1) {
        touchy.addTouch({
          x: Math.random(),
          y: Math.random()
        })
        touchy.addTouch({
          x: Math.random(),
          y: Math.random()
        })
      }
      texture.needsUpdate = true
      touchy.update()
    })

    this.out.canvas = touchy.canvas
    this.out.texture = texture
  }
}