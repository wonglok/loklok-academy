// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;

// attribute vec3 position;

// attribute vec2 uv;
varying vec3 vPos;
uniform float time;
void main (void) {
  vPos = position;
  vec3 nPos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
}
