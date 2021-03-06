//Reference Material
//https://webglfundamentals.org/
let glsl = v => v[0];

class GLProgram {
  constructor ({ gl, vs, fs }) {
    this.gl = gl
    this.vertexShaderSource = vs
    this.fragmentShaderSource = fs
    this.program = false
    this.setup()
  }

  setup () {
    let { gl, vertexShaderSource, fragmentShaderSource } = this
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var successVertexShader = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    if(!successVertexShader){
      let errorVertex = gl.getShaderInfoLog(vertexShader);
      console.error(errorVertex);
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    var successfragmentShader = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    if(!successfragmentShader){
      let errorVertex = gl.getShaderInfoLog(fragmentShader);
      console.error(errorVertex);
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var successProgram = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!successProgram){
      var errorProgram = gl.getProgramInfoLog(program);
      console.error(errorProgram);
    }

    this.program = program;
  }
}

class BufferAttribute {
  constructor ({
    gl,
    program,
    name = 'a_position',
    array = [
      //line1 - start x,y
      -0.5,  0.0, 0.0,
      //line1 - end x,y
      0.0,  1.0, 0.0,

      //line2 - start x,y
      0.5,  1.0, 0.0,
      //line2 - end x,y
      0.0, 0.0, 0.0
    ],
    memberCount = 3
  }) {
    this.gl = gl
    this.program = program
    this.typedArray = new Float32Array(array)
    this.numberOfDataPerVectex = memberCount
    this.numberOfVertex = array.length / this.numberOfDataPerVectex //2lines, 2vertex perline,
    this.name = name
    this.buffer = false
    this.location = false
    this.uploadType = gl.DYNAMIC_DRAW
    this.setup()
  }

  setDynamicUpload () {
    this.uploadType = this.gl.DYNAMIC_DRAW
  }
  setStaticUpload () {
    this.uploadType = this.gl.STATIC_DRAW
  }

  setup () {
    let { gl, typedArray, program, numberOfDataPerVectex } = this
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      typedArray,
      gl.DYNAMIC_DRAW);

    this.location = gl.getAttribLocation(program, this.name);
    gl.enableVertexAttribArray(this.location);
    gl.vertexAttribPointer(this.location, numberOfDataPerVectex, gl.FLOAT, false, 0, 0);
  }
}

class StateMachine {
  constructor ({ gl, program }) {
    this.gl = gl
    this.program = program
  }
  clearScreen () {
    let { gl } = this
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.15, 0.15, 0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  useProgram () {
    this.gl.useProgram(this.program)
  }
  useBuffer ({ bufferAttribute }) {
    let { gl } = this
    // upload a_position_buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferAttribute.buffer);
    gl.enableVertexAttribArray(bufferAttribute.location);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      bufferAttribute.typedArray,
      bufferAttribute.uploadType);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
  drawObject ({ bufferAttribute }) {
    let { gl } = this
    gl.drawArrays(gl.LINES, 0, bufferAttribute.numberOfVertex);
  }
}

class OrganisedCanvas {
  constructor () {
    this.canRender = true
    this.clock = 0
    this.loops = []

    var canvas = window.document.createElement('canvas');
    canvas.width = 350;
    canvas.height = 350;
    canvas.style.width = '100vmin';
    canvas.style.height = '100vmin';

    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.appendChild(canvas);

    // get the webgl context.
    var gl = canvas.getContext('webgl');
    this.gl = gl

    let vs = glsl`
      attribute vec3 a_position;
      attribute vec3 a_color;

      varying vec3 v_color;
      varying vec3 v_position;
      void main() {
        v_color = a_color;
        v_position = a_position;
        gl_Position = vec4(a_position, 1);
      }
    `
    let fs = glsl`
      precision highp float;
      varying vec3 v_color;
      varying vec3 v_position;
      void main() {
        gl_FragColor = vec4(v_color + v_position, 0.9);
      }
    `

    this.shaderProgram = new GLProgram({ gl: this.gl, vs, fs })
    this.machine = new StateMachine({ gl: this.gl, program: this.shaderProgram.program })

    this.machine.useProgram()

    this.attributes = []

    let numberOfLines = 200

    let a_position_array = new Array(3 * 2 * numberOfLines)
    let a_position = new BufferAttribute({ gl: this.gl, program: this.shaderProgram.program, name: 'a_position', array: a_position_array, memberCount: 3 })
    this.attributes.push(a_position)
    this.loops.push({
      name: 'a_position',
      fn: () => {
        let time = this.clock / 1000

        // 6 data items, 3(xyz) = start of line, 3(xyz) = end of line
        let length = a_position.typedArray.length / 6
        for (let ix = 0; ix < length; ix += 1) {
          var startAngle = ((ix) / length) * Math.PI * 2.0;
          var endAngle = (((ix + 1)) / length) * Math.PI * 2.0;

          var ballRadius = 0.75;

          var numOfWaves = 5;
          var waveHeight = 0.2;
          var wavyRadius = ballRadius + waveHeight * Math.sin((endAngle + time * 0.25) * numOfWaves);

          var x1 = ballRadius * Math.cos(startAngle);
          var y1 = ballRadius * Math.sin(startAngle);

          var x2 = wavyRadius * Math.cos(endAngle + 0.4);
          var y2 = wavyRadius * Math.sin(endAngle + 0.4);

          a_position.typedArray[ix * 6 + 0] = x1
          a_position.typedArray[ix * 6 + 1] = y1
          a_position.typedArray[ix * 6 + 2] = 0

          a_position.typedArray[ix * 6 + 3] = x2
          a_position.typedArray[ix * 6 + 4] = y2
          a_position.typedArray[ix * 6 + 5] = 0
        }
      }
    })

    let a_color_array = new Array(3 * 2 * numberOfLines)
    let a_color = new BufferAttribute({ gl: this.gl, program: this.shaderProgram.program, name: 'a_color', array: a_color_array, memberCount: 3 })
    this.attributes.push(a_color)
    // 6 data items, 3(xyz) = start of line, 3(xyz) = end of line
    let length = a_color.typedArray.length / 6
    for (let ix = 0; ix < length; ix += 1) {
      a_color.typedArray[ix * 6 + 0] = 1
      a_color.typedArray[ix * 6 + 1] = 1
      a_color.typedArray[ix * 6 + 2] = 1

      a_color.typedArray[ix * 6 + 3] = 0.5
      a_color.typedArray[ix * 6 + 4] = 0.5
      a_color.typedArray[ix * 6 + 5] = 0.5
    }

    let rAFID = 0
    let rAF = () => {
      rAFID = requestAnimationFrame(rAF)
      if (!this.canRender) {
        return
      }
      this.run()
    }
    rAFID = requestAnimationFrame(rAF)

    this.clean = () => {
      this.canRender = false
      cancelAnimationFrame(rAFID)
    }
  }

  run () {
    this.clock += 1000 / 60
    this.loops.forEach(e => e.fn())
    this.machine.clearScreen()
    this.machine.useBuffer({ bufferAttribute: this.attributes[0] })
    this.machine.useBuffer({ bufferAttribute: this.attributes[1] })
    this.machine.drawObject({ bufferAttribute: this.attributes[0] })
  }

  init () {

  }
}

window.addEventListener('DOMContentLoaded', function(){
  new OrganisedCanvas()
}, false);