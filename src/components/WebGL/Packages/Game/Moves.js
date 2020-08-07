import { getID } from '../../Core/O3DG2'

export class Moves {
  constructor () {
    let controlMapper = require('./actions/controls/fbx').default
    let gestureMapper = require('./actions/gesture/fbx').default
    let locomotionMapper = require('./actions/locomotion/fbx').default
    let thrillerMapper = require('./actions/thriller/fbx').default
    let breakdancesMapper = require('./actions/breakdance/fbx').default
    let danceingMapper = require('./actions/dancing/fbx').default
    let capoeiraMapper = require('./actions/capoeira/fbx').default
    let rifleMapper = require('./actions/rifle/fbx').default
    let mmaMapper = require('./actions/mma/fbx').default
    let kickMapper = require('./actions/kick/fbx').default
    let hurtMapper = require('./actions/hurt/fbx').default
    let boxingMapper = require('./actions/boxing/fbx').default
    let boxinghitMapper = require('./actions/boxinghit/fbx').default
    let idleMapper = require('./actions/idle/fbx').default
    let kneeMapper = require('./actions/knee/fbx').default
    let superheroMapper = require('./actions/superhero/fbx').default
    let prayerMapper = require('./actions/prayer/fbx').default
    let footballMapper = require('./actions/football/fbx').default
    let rifleLocomotionMapper = require('./actions/rifle-locomotion/fbx').default
    let rifleProMapper = require('./actions/rifle-pro/fbx').default
    let posterMapper = require('./actions/posture/fbx').default
    let posterFixedMapper = require('./actions/posture-fixed/fbx').default
    let drunkMapper = require('./actions/drunk/fbx').default
    // kneeMapper

    let movesOrig = []
    let addToList = ({ mapper, type }) => {
      let arr = []
      for (let kn in mapper) {
        arr.push({
          type,
          _id: getID(),
          displayName: kn,
          actionFBX: false,
          fbx: false,
          url: mapper[kn]
        })
      }
      arr.sort((a, b) => {
        if (a.displayName > b.displayName) {
            return 1
        } else if (b.displayName > a.displayName) {
            return -1
        } else {
          return 0
        }
      })
      movesOrig = [
        ...movesOrig,
        ...arr
      ]

      return arr
    }

    addToList({ mapper: prayerMapper, type: 'church' })
    addToList({ mapper: idleMapper, type: 'ready' })
    addToList({ mapper: gestureMapper, type: 'ready' })
    addToList({ mapper: posterMapper, type: 'posture' })
    addToList({ mapper: posterFixedMapper, type: 'posture' })
    addToList({ mapper: drunkMapper, type: 'posture' })

    addToList({ mapper: thrillerMapper, type: 'dance' })
    addToList({ mapper: breakdancesMapper, type: 'dance' })
    addToList({ mapper: danceingMapper, type: 'dance' })
    addToList({ mapper: capoeiraMapper, type: 'dance' })

    addToList({ mapper: footballMapper, type: 'football' })

    addToList({ mapper: superheroMapper, type: 'action' })

    addToList({ mapper: kneeMapper, type: 'combat' })
    addToList({ mapper: kickMapper, type: 'combat' })
    addToList({ mapper: boxingMapper, type: 'combat' })
    addToList({ mapper: mmaMapper, type: 'combat' })
    addToList({ mapper: boxinghitMapper, type: 'combat' })
    addToList({ mapper: hurtMapper, type: 'combat' })

    addToList({ mapper: rifleLocomotionMapper, type: 'gun' })
    addToList({ mapper: rifleProMapper, type: 'gun' })
    addToList({ mapper: rifleMapper, type: 'gun' })

    addToList({ mapper: locomotionMapper, type: 'control' })
    addToList({ mapper: controlMapper, type: 'control' })

    return movesOrig
  }
}

