
var path = require('path')
let exporter = {
}

async function importAll (r) {
  r.keys().forEach(key => {
    let filename = path.basename(key).replace('.vue', '')
    exporter[filename] = () => new Promise((resolve) => {
      r(key).then((mod) => {
        resolve(mod.default)
      })
    })
  })
  return exporter
}

importAll(require.context('../AppUIs', true, /\.vue$/, 'lazy'), 'lazy')
importAll(require.context('../Packages', true, /\.vue$/, 'lazy'), 'lazy')
// importAll(require.context('../GLContent', true, /\.vue$/, 'lazy'), 'lazy')
// importAll(require.context('../CanvasLayout', true, /\.vue$/, 'lazy'), 'lazy')
// importAll(require.context('../HTMLContent', true, /\.vue$/, 'lazy'), 'lazy')
// importAll(require.context('./CanvasScene', true, /\.vue$/, 'lazy'), 'lazy')

export default exporter
