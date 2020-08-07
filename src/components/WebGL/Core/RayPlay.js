
import { Raycaster, Vector2 } from 'three'

export class RayPlay {
  constructor ({ mounter, onResize = () => {}, onLoop, camera, onClean = () => {} }) {
    this.skip = true
    this.raycaster = new Raycaster()
    this.camera = camera
    this.activeTargets = []
    this.mouser = new Vector2(0, 0)
    // window.addEventListener('reset-rayplay', () => {
    //   this.mouser.x = 0
    //   this.mouser.y = 0
    // })

    let isDown = false
    let downPT = new Vector2()
    let movement = 0

    let onMouseDown = (ev) => {
      moveAmount = 0
      isDown = true
      downPT.x = ev.pageX
      downPT.y = ev.pageY
      movement = 0
    }
    let onMouseUp = () => {
      isDown = false
    }
    let onMouseMove = (ev) => {
      if (isDown) {
        movement = downPT.distanceTo(new Vector2(ev.pageX, ev.pageY))
      }
    }

    this.add = (v, handler = () => {}) => {
      // v.frustumCulled = false
      v.userData = v.userData || {}
      v.userData.clicker = handler
      this.activeTargets.push(v)
      // console.log(this.activeTargets)
    }

    this.hover = (v, enter = () => {}, leave = () => {}) => {
      // v.frustumCulled = false
      v.userData = v.userData || {}
      v.userData.enterHoverFnc = enter
      v.userData.leaveHoverFnc = leave
      if (!this.activeTargets.includes(v)) {
        this.activeTargets.push(v)
      }
      // console.log(this.activeTargets)
    }

    this.remove = (v) => {
      this.activeTargets.splice(this.activeTargets.indexOf(v), 1)
      // console.log(this.activeTargets)
    }

    // only 1 can be active
    let cancelArr = []

    let onDocumentHover = () => {
      if (this.skip) {
        return
      }

      let rc = this.raycaster
      if (this.camera && this.mouser && rc) {
        rc.setFromCamera(this.mouser, this.camera)

        // var findings = rc.intersectObjects(this.o3dHovers)
        var tryhover = rc.intersectObjects(this.activeTargets)
        // console.log(tryhover)
        if ((tryhover.length) > 0) {
          tryhover.forEach((rayObj) => {
            let sceneObj = rayObj.object
            let userData = sceneObj.userData
            userData.wasHovering = userData.hovering
            if (userData && !userData.wasHovering) {
              if (userData.enterHoverFnc) {
                cancelArr.forEach(e => e())
                cancelArr = []
                cancelArr.push(() => {
                  userData.leaveHoverFnc({
                    type: 'hoverout',
                    object: sceneObj,
                    userData
                  })
                })
                userData.enterHoverFnc({
                  type: 'hoverin',
                  object: sceneObj,
                  userData
                })
                this.activeTargets.forEach((sceneObj) => {
                  let userData = sceneObj.userData
                  userData.hovering = true
                })
              }
            }
          })

          if (tryhover[0]) {
            let first = tryhover[0]
            let userData = first.object.userData
            if (userData && userData.noHover) {
              document.body.style.cursor = ''
            } else {
              document.body.style.cursor = 'pointer'
            }
          }
        } else {
          document.body.style.cursor = ''
          this.activeTargets.forEach((sceneObj) => {
            let userData = sceneObj.userData
            userData.hovering = false
            if (userData && userData.wasHovering && userData.leaveHoverFnc) {
              userData.leaveHoverFnc({
                type: 'hoverout',
                userData
              })
              userData.wasHovering = false
            }
          })
        }
      }
    }
    let rect = mounter.getBoundingClientRect()
    onResize(() => {
      rect = mounter.getBoundingClientRect()
    })
    onLoop(() => {
      rect = mounter.getBoundingClientRect()
    })
    var onDocumentMouseMove = (event) => {
      this.skip = false
      // event.preventDefault()
      this.mouser.x = ((event.pageX - rect.left) / rect.width) * 2 - 1
      this.mouser.y = -((event.pageY - rect.top) / rect.height) * 2 + 1
    }
    let moveAmount = 0
    var onDocumentTouchMove = (event) => {
      this.skip = false
      moveAmount += 1
      let obj = event.touches[0]

      // console.log(obj)
      // this.mouser.x = (obj.pageX / window.innerWidth) * 2 - 1
      // this.mouser.y = -(obj.pageY / window.innerHeight) * 2 + 1

      this.mouser.x = ((obj.pageX - rect.left) / rect.width) * 2 - 1
      this.mouser.y = -((obj.pageY - rect.top) / rect.height) * 2 + 1
    }

    let onDocumentClick = () => {
      this.skip = false
      if (moveAmount > 5) {
        moveAmount = 0
        return
      }
      if (movement > 50) {
        return
      }
      let rc = this.raycaster
      if (this.camera && this.mouser && rc) {
        rc.setFromCamera(this.mouser, this.camera)
        // console.log(this.o3dClickers.children)

        var findings = rc.intersectObjects(this.activeTargets.filter(e => e.visible))
        let event = (findings.length) > 0 ? findings[0] : null
        // console.log(first)
        if (event) {
          let obj = event.object
          let userData = obj.userData
          let handler = userData.clicker
          if (handler) {
            handler({
              type: 'click',
              event,
              userData,
              object: obj
            })
          } else {
            console.error('handler not found')
          }
          // console.log(event)
        }
      }
    }
    let onStart = () => {
      this.skip = false
      moveAmount = 0
    }
    onClean(() => {
      document.body.style.cursor = ''
    })

    mounter.addEventListener('mousedown', onMouseDown)
    mounter.addEventListener('mouseup', onMouseUp)
    mounter.addEventListener('mousemove', onMouseMove)

    mounter.addEventListener('touchstart', (evt) => { onStart(evt); onDocumentTouchMove(evt) }, { passive: false })
    mounter.addEventListener('touchmove', onDocumentTouchMove, { passive: false })
    mounter.addEventListener('mousemove', onDocumentMouseMove, { passive: false })
    mounter.addEventListener('click', onDocumentClick, { passive: false })
    mounter.addEventListener('touchend', onDocumentClick, { passive: false })
    onLoop(onDocumentHover)
  }
}
