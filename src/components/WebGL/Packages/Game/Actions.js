import { loadFBX } from '../../Core/loadFBX'
import { Moves } from './Moves'
import { Mixer } from './Mixer'

export class Actions {
  static SharedCache = new Map()
  static moves = new Moves()

  constructor ({ actor, defaultAction, onLoop }) {
    this.onLoop = onLoop
    this.defaultAction = defaultAction
    this.mixer = new Mixer({ loop: this.onLoop, actor })
    this.activeAction = false

    this.out = {}
    if (defaultAction) {
      this.out.done = this.act({ name: this.defaultAction })
    }
  }

  async act ({ name }) {
    this.mixer.stopAllAction()
    let action = await this.getActionByName({ name, inPlace: false })
    action.reset().fadeIn(0.1).play()
  }

  async actOnce ({ act, resting }) {
    this.mixer.stopAllAction()
    let action = await this.getActionByName({ name: act, inPlace: false })
    action.reset()
    action.repetitions = 1
    action.fadeIn(0.1).play()
    clearTimeout(this.toutActOnce)
    this.toutActOnce = setTimeout(async () => {
      this.mixer.stopAllAction()
      let restore = await this.getActionByName({ name: resting, inPlace: false })
      restore.reset().fadeIn(0.1).play()
    }, action.duration * 1000 * 1.1)
  }

  setInPlaceClip ({ clip }) {
    if (clip.tracks[0] && clip.tracks[0].name === 'mixamorigHips.position') {
      let values = clip.tracks[0].values
      for (var i = 0; i < values.length; i += 3) {
        values[i + 0] = 0
        // values[i + 1] = 0
        values[i + 2] = 0
      }
      clip.isProcessed = true
    }
    return clip
  }

  static async preloadByName ({ name }) {
    let move = Actions.moves.find(e => e.displayName === name)
    if (move) {
      return Actions.loadFBX({ url: move.url })
    }
  }

  static async loadFBX ({ url }) {
    if (Actions.SharedCache.has(url)) {
      return Actions.SharedCache.get(url)
    }
    let actionFBX = await loadFBX(url)
    Actions.SharedCache.set(url, actionFBX)
    return actionFBX
  }

  async getActionByName ({ name, inPlace = false }) {
    let move = Actions.moves.find(e => e.displayName === name)
    if (!move) {
      throw new Error('move name not found ' + name)
    }
    let actionFBX = await Actions.loadFBX({ url: move.url })
    if (actionFBX && actionFBX.animations && actionFBX.animations[0]) {
      let clip = actionFBX.animations[0]
      if (inPlace && !clip.isProcessed) {
        clip = this.setInPlaceClip({ clip })
      }
      let action = this.mixer.clipAction(clip)
      action.duration = clip.duration
      return action
    } else {
      throw new Error('no animation ' + name)
    }
  }
}