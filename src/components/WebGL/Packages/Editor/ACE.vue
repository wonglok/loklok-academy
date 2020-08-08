<template>
  <div :style="{height: height ? px(height) : '100%',width: width ? px(width) : '100%'}">
    <div ref="mounter" class="full">
    </div>
    <div class=" absolute" :style="{ zIndex: 30, left: widget.pageX + 'px', top: widget.pageY + 25 + 'px' }" ref="widget" v-show="widget.display">
      <Chrome v-if="widget.type === 'color'" v-model="current.color" @input="onChangeColor($event)"></Chrome>
      <input v-if="widget.type === 'number'" v-model="current.number" style="width: 350px" min="-100" max="100" step="0.001" @input="onChangeNumber($event.target.value)" type="range" />
    </div>
  </div>
</template>

<script>
var ace = require('brace')
var Chrome = require('vue-color/dist/vue-color').Chrome
// npm install --save vue2-ace-editor

// require(['emmet/emmet'], function (data) {
//   window.emmet = data.emmet
// })

/*
<ACE
  v-if="currentFile"
  @save="() => {}"
  :path="currentFile.path"
  v-model="currentFile.src"
  @input="() => { isDirty = true; }"
  theme="chrome"
  width="100%"
  :height="'1024'"
>
</ACE>
*/

export default {
  template: '',
  components: {
    Chrome
  },
  props: {
    colorPrefix: {
      default: '0x'
    },
    value: {},
    mode: {
      type: String,
      default: 'html'
    },
    theme: String,
    height: {
      default: true
    },
    width: {
      default: true
    }
  },
  data () {
    return {
      rect: {
        left: 285,
        top: 56
      },
      widget: {
        type: 'color',
        pageX: 0,
        pageY: 0,
        display: false
      },
      current: {
        number: 0,
        color: {
          hex: '#194d33',
          hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
          hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
          rgba: { r: 25, g: 77, b: 51, a: 1 },
          a: 1
        }
      },
      onChangeColor () {},
      onChangeNumber () {},
      pickerType: 'color',

      editor: null,
      contentBackup: ''
    }
  },
  methods: {
    px (n) {
      if (/^\d*$/.test(n)) {
        return n + 'px'
      }
      return n
    },
    getLangFromPath (path) {
      var ans = 'html'
      try {
        var ext = path.split('.').pop()

        if (ext === 'js') {
          ans = 'javascript'
        }
        if (ext === 'vue') {
          ans = 'html'
        }
        if (ext === 'html') {
          ans = 'html'
        }
        if (ext === 'css') {
          ans = 'css'
        }
        if (ext === 'vert') {
          ans = 'glsl'
        }
        if (ext === 'frag') {
          ans = 'glsl'
        }
      } catch (e) {
        console.log(e)
      }

      return ans
    },
    setup () {
      this.rect = this.$el.getBoundingClientRect()
      window.addEventListener('resize', () => {
        this.rect = this.$el.getBoundingClientRect()
      })

      var vm = this
      var theme = this.theme || 'chrome'

      // require('brace/ext/emmet')

      var editor = vm.editor = ace.edit(this.$refs.mounter)

      this.$el.addEventListener('wheel', (evt) => {
        evt.preventDefault()
        evt.stopImmediatePropagation()
      })

      function live (root, eventType, className, cb) {
        root.addEventListener(eventType, function (event) {
          if (event.target.classList.contains(className)) {
            cb.call(event.target, event);
          }
        });
        editor.selection.on('changeCursor', () => {
          cb()
        })
      }

      live(this.$refs.mounter, 'mouseup', 'ace_content', () => {
        let text = editor.getSelectedText()
        let range = editor.selection.getAllRanges()[0]

        let trialRange = editor.selection.getRange()
        trialRange.start.column -= 1
        let trailColor = editor.getSession().doc.getTextRange(trialRange);

        if ((trailColor.indexOf('#') === 0 && trailColor.length === 7)) {
          editor.selection.setRange(trialRange)
          range = trialRange
          text = trailColor
        }

        let coord = editor.renderer.textToScreenCoordinates(range.start.row, range.start.column)
        let { pageX, pageY } = coord
        this.widget.pageX = pageX
        this.widget.pageY = pageY
        if (text.indexOf('#') === 0 && text.length === 7) {
          console.log('isHexColorString', range)
          this.widget.display = true
          this.widget.type = 'color'
          let { start, end } = range
          this.current.color = text.replace('#', '#')
          this.onChangeColor = () => {
            this.editor.session.replace({ start, end }, this.current.color.hex.replace('#', '#').toLowerCase())
            this.$emit('slide', editor.getValue())
          }
        } else if (text.indexOf('0x') === 0 && text.length === 8) {
          console.log('isHexColorNumber', range)
          this.widget.display = true
          this.widget.type = 'color'
          let { start, end } = range
          this.current.color = text.replace('0x', '#')
          this.onChangeColor = () => {
            this.editor.session.replace({ start, end }, this.current.color.hex.replace('#', '0x').toLowerCase())
            this.$emit('slide', editor.getValue())
          }
          // this.widget.display = true
          // this.widget.type = 'color'
          // let { start, end } = range
          // this.onChangeColor = () => {
          //   this.editor.session.replace({ start, end }, this.current.color.hex.replace('#', '0x').toLowerCase())
          //   this.$emit('slide', editor.getValue())
          // }
        } else if ( text && text.trim() && !isNaN(Number(text))) {
          console.log('isNum', range)
          this.widget.display = true
          this.widget.type = 'number'

          this.current.number = Number(text)

          let range = editor.selection.getRange()
          let { start, end } = range
          let lastText = text
          this.onChangeNumber = () => {
            let newText = Number(this.current.number).toFixed(2)
            end.column = start.column + lastText.length
            this.editor.session.replace({ start, end }, newText)
            lastText = newText
            this.$emit('slide', editor.getValue())
          }
        } else {
          this.widget.display = false
          this.onChangeColor = () => {}
          this.onChangeNumber = () => {}
          // console.log('isBad', range)
        }
      });

      var commands = [
        {
          name: 'open-files',
          bindKey: {win: 'Ctrl-O', mac: 'Command-O'},
          exec: () => {
            // var val = editor.getValue()
            this.$emit('open')
          },
          readOnly: true // false if this command should not apply in readOnly mode
        },
        {
          name: 'save',
          bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
          exec: (editor) => {
            var val = editor.getValue()
            this.$emit('save', val)
          },
          readOnly: true // false if this command should not apply in readOnly mode
        },
        {
          name: 'multicursor',
          bindKey: {win: 'Ctrl-D', mac: 'Command-D'},
          exec: (editor) => {
            editor.selectMore(1)
          },
          // multiSelectAction: 'forEach',
          scrollIntoView: 'cursor',
          readOnly: true // false if this command should not apply in readOnly mode
        }
      ]
      if (Array.isArray(commands)) {
        commands.forEach((command) => {
          vm.editor.commands.addCommand(command)
        })
      }

      // this.$emit('init', editor)

      require('brace/mode/html')
      require('brace/mode/javascript')
      require('brace/mode/css')
      require('brace/mode/glsl')
      // require('brace/mode/sass')
      require('brace/theme/chrome')
      // require('brace/theme/monokai')
      require('brace/ext/searchbox')

      editor.$blockScrolling = Infinity
      // editor.setOption('enableEmmet', true)
      editor.getSession().setMode('ace/mode/' + this.mode)
      editor.setTheme('ace/theme/' + theme)
      editor.session.setValue(this.value, 1)
      editor.session.setOptions({ tabSize: 2, useSoftTabs: true })
      editor.setOptions({ fontSize: '12px' })
      editor.session.setOption('useWorker', false)

      editor.on('change', function () {
        var content = editor.getValue()
        vm.$emit('input', content)
        vm.contentBackup = content
      })
    }
  },
  watch: {
    value (val) {
      if (this.contentBackup !== val) {
        this.editor.setValue(val, 1)
      }
    },
    filepath () {
      this.editor.getSession().setMode('ace/mode/' + this.mode)
    }
  },
  mounted () {
    this.setup()
  }
}
</script>

<style>

</style>
