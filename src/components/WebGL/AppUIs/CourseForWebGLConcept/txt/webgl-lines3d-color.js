//Reference Material
//https://webglfundamentals.org/

window.addEventListener('DOMContentLoaded', function(){
  var canvas = window.document.createElement('canvas');
  canvas.width = 350;
  canvas.height = 350;
  canvas.style.width = '100vmin';
  canvas.style.height = '100vmin';

  document.body.appendChild(canvas);

  // get the webgl context.
  var gl = canvas.getContext('webgl');

  // define shader position
  var vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec3 a_color;

    varying vec3 v_color;
    void main() {
      v_color = a_color;
      gl_Position = vec4(a_position, 1);
    }
  `;
  var fragmentShaderSource = `
    precision highp float;
    varying vec3 v_color;
    void main() {
      gl_FragColor = vec4(v_color, 0.9);
    }
  `;

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


  gl.useProgram(program);

  var lineSegments = {
      a_position_array: new Float32Array([
          //line1 - start x,y
          -0.5,  0.0, 0.0,
          //line1 - end x,y
          0.0,  1.0, 0.0,

          //line2 - start x,y
          0.5,  1.0, 0.0,
          //line2 - end x,y
          0.0, 0.0, 0.0
      ]),
      a_position_numberOfDataPerVectex: 3,
      a_position_numberOfVertex: 2 * 2, //2lines, 2vertex perline,

      a_color_array: new Float32Array([
          //line1 - start x,y
          1.0,  0.0, 0.0,
          //line1 - end x,y
          1.0,  1.0, 0.0,

          //line2 - start x,y
          0.5,  1.0, 1.0,
          //line2 - end x,y
          0.0, 0.0, 1.0
      ]),
      a_color_numberOfDataPerVectex: 3,
      a_color_numberOfVertex: 2 * 2 //2lines, 2vertex perline
  };

  var a_position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, a_position_buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    lineSegments.a_position_array,
    gl.DYNAMIC_DRAW);


  var a_position_location = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(a_position_location);
  gl.vertexAttribPointer(a_position_location, lineSegments.a_position_numberOfDataPerVectex, gl.FLOAT, false, 0, 0);


  var a_color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, a_color_buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    lineSegments.a_color_array,
    gl.DYNAMIC_DRAW);


  var a_color_location = gl.getAttribLocation(program, 'a_color');
  gl.enableVertexAttribArray(a_color_location);
  gl.vertexAttribPointer(a_color_location, lineSegments.a_color_numberOfDataPerVectex, gl.FLOAT, false, 0, 0);


  //draw
  //offset 0, draw 3 vertex
  var rAF = function(){
    window.requestAnimationFrame(rAF);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(1, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // upload a_position_buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, a_position_buffer);
    gl.enableVertexAttribArray(a_position_location);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      lineSegments.a_position_array,
      gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // upload a_color_buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, a_color_buffer);
    gl.enableVertexAttribArray(a_color_location);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      lineSegments.a_color_array,
      gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.drawArrays(gl.LINES, 0, lineSegments.a_position_numberOfVertex);


  };

  window.requestAnimationFrame(rAF);

}, false);