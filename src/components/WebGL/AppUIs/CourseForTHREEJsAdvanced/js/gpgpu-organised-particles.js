import * as THREE from 'https://unpkg.com/three@0.116.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.116.1/examples/jsm/controls/OrbitControls.js';
import { GPUComputationRenderer } from 'https://unpkg.com/three@0.116.1/examples/jsm/misc/GPUComputationRenderer.js';

import { EffectComposer } from 'https://unpkg.com/three@0.116.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.116.1/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.116.1/examples/jsm/postprocessing/UnrealBloomPass.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let glsl = v => v[0]

let Dimensions = 256

let allocateValues = (dataTexture) => {
  let data = dataTexture.image.data
  let width = dataTexture.image.width
  let height = dataTexture.image.height
  let i = 0;
  for (var h = 0; h < height; h++) {
    for (var w = 0; w < width; w++) {
      data[i * 4 + 0] = w / width - 0.5
      data[i * 4 + 1] = h / height - 0.5
      data[i * 4 + 2] = 0
      data[i * 4 + 3] = 0
      i++
    }
  }
}

let fragmentShaderVel = glsl`
uniform vec3 mousePos;
uniform float time;

float constrain(float val, float min, float max) {
  if (val < min) {
    return min;
  } else if (val > max) {
    return max;
  } else {
    return val;
  }
}

vec3 getDiff (in vec3 lastPos, in vec3 mousePos) {
  vec3 diff = lastPos.xyz / 33.3 - mousePos;
  float distance = constrain(length(diff), 5.0, 100.0);
  float strength = 0.35 / (distance * distance);

  diff = normalize(diff);
  // delta
  diff = diff * strength * -2.0;
  // diff = diff * strength * (-20.83) * (1.0 / delta) * 0.0183;

  return diff;
}

/* NEW GLSL NOISE FBM */
const mat2 m = mat2(0.80,  0.60, -0.60,  0.80);
float noise(in vec2 p) {
  return sin(p.x)*sin(p.y);
}

float fbm4( vec2 p ) {
    float f = 0.0;
    f += 0.5000 * noise( p ); p = m * p * 2.02;
    f += 0.2500 * noise( p ); p = m * p * 2.03;
    f += 0.1250 * noise( p ); p = m * p * 2.01;
    f += 0.0625 * noise( p );
    return f / 0.9375;
}

float fbm6( vec2 p ) {
    float f = 0.0;
    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
    f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
    f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.015625*(0.5+0.5*noise( p ));
    return f/0.96875;
}

float pattern (vec2 p, float time) {
  float vout = fbm4( p + time + fbm6( p + fbm4( p + time )) );
  return (vout);
}
/* NEW GLSL NOISE FBM */

void main (void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 lastPos = texture2D(texturePosition, uv);
  vec4 lastVel = texture2D(textureVelocity, uv);

  vec3 diff = getDiff(lastPos.xyz, vec3(mousePos.xy, sin(time)));
  lastVel.xyz += diff * (1.0 - fbm6(diff.xy + time)) * 4.0;

  gl_FragColor = lastVel;
}
`

let fragmentShaderPos = glsl`
uniform float time;
#include <common>

//  Classic Perlin 3D Noise
//  by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
  vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

#define M_PI 3.1415926535897932384626433832795
float atan2(in float y, in float x) {
  bool xgty = (abs(x) > abs(y));
  return mix(M_PI/2.0 - atan(x,y), atan(y,x), float(xgty));
}
vec3 fromBall(float r, float az, float el) {
  return vec3(
    r * cos(el) * cos(az),
    r * cos(el) * sin(az),
    r * sin(el)
    );
}

void toBall(vec3 pos, out float az, out float el) {
  az = atan2(pos.y, pos.x);
  el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
}
// float az = 0.0;
// float el = 0.0;
// vec3 noiser = vec3(lastVel);
// toBall(noiser, az, el);
// lastVel.xyz = fromBall(1.0, az, el);

/* NEW GLSL NOISE FBM */
const mat2 m = mat2(0.80,  0.60, -0.60,  0.80);
float noise(in vec2 p) {
  return sin(p.x)*sin(p.y);
}

float fbm4( vec2 p ) {
    float f = 0.0;
    f += 0.5000 * noise( p ); p = m * p * 2.02;
    f += 0.2500 * noise( p ); p = m * p * 2.03;
    f += 0.1250 * noise( p ); p = m * p * 2.01;
    f += 0.0625 * noise( p );
    return f / 0.9375;
}

float fbm6( vec2 p ) {
    float f = 0.0;
    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
    f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
    f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.015625*(0.5+0.5*noise( p ));
    return f/0.96875;
}

float pattern (vec2 p, float time) {
  float vout = fbm4( p + time + fbm6( p + fbm4( p + time )) );
  return (vout);
}
/* NEW GLSL NOISE FBM */

void main (void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 lastPos = texture2D(texturePosition, uv);
  vec4 lastVel = texture2D(textureVelocity, uv);

  float az = 0.0;
  float el = 0.0;

  vec3 noiser = vec3(lastPos) + lastVel.xyz + fbm4(lastPos.xy / 50.0) + fbm6(lastVel.xy);
  toBall(noiser, az, el);

  lastPos.xyz = fromBall(50.0, az, el);

  lastPos.xyz += lastVel.xyz;
  gl_FragColor = lastPos;
}
`


let makeGPGPU = ({ onLoop }) => {
  // Initialization...
  // Create computation renderer
  var gpuCompute = new GPUComputationRenderer(Dimensions, Dimensions, renderer );

  // Create initial state float textures
  var pos0 = gpuCompute.createTexture();
  var vel0 = gpuCompute.createTexture();
  // and fill in here the texture data...

  allocateValues(pos0)

  // Add texture variables
  var velVar = gpuCompute.addVariable("textureVelocity", fragmentShaderVel, pos0 );
  var posVar = gpuCompute.addVariable("texturePosition", fragmentShaderPos, vel0 );

  // Add variables dependencies
  gpuCompute.setVariableDependencies(velVar, [velVar, posVar]);
  gpuCompute.setVariableDependencies(posVar, [velVar, posVar]);

  // Add Custom uniforms
  velVar.material.uniforms.time = { value: 0.0 };
  velVar.material.uniforms.mousePos = { value: new THREE.Vector3(0,0,0) };
  // Add Custom uniforms
  posVar.material.uniforms.time = { value: 0.0 };
  posVar.material.uniforms.mousePos = { value: new THREE.Vector3(0,0,0) };

  // Check for completeness
  var error = gpuCompute.init();
  if ( error !== null ) {
    console.error( error );
  }

  let uniforms = {
    time: { value: 0 },
    myPosTexture: { value: null },
    myVelTexture: { value: null }
  }
  var myMaterial = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: glsl`
    uniform float time;
    varying vec2 vUv;
    uniform sampler2D myPosTexture;

    void main (void) {
      vUv = uv;

      vec4 posData = texture2D(myPosTexture, uv);
      vec3 nPos = position + posData.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
      gl_PointSize = 1.0;
    }
    `,
    fragmentShader: glsl`
    uniform sampler2D myVelTexture;
    uniform sampler2D myPosTexture;
    varying vec2 vUv;
    void main (void) {
      vec4 velColor = texture2D(myVelTexture, vUv);
      vec4 posColor = texture2D(myPosTexture, vUv);

      vec4 outputColor = vec4(
          velColor.x + 0.6,
          (velColor.y * velColor.x) + 0.6,
          velColor.y + 0.6,
        1.0
        );

        gl_FragColor = vec4(normalize(outputColor.rgb), 0.075);
      }
      `
  })

  var geometry = new THREE.PlaneBufferGeometry(1.0, 1.0, Dimensions, Dimensions);
  // Update texture uniforms in your visualization materials with the gpu renderer output


  var drawItem = new THREE.Points(geometry, myMaterial);
  drawItem.scale.set(0.5, 0.5, 0.5);

  // Do your rendering
  scene.add(drawItem);

  let setMouse = ({ mX, mY, rect, velVar, posVar }) => {
    var posMouse = velVar.material.uniforms.mousePos.value
    var velMouse = posVar.material.uniforms.mousePos.value
    if (rect && typeof mX !== 'undefined' && typeof mY !== 'undefined') {
      velMouse.x = ((mX - rect.left) / rect.width) * 2 - 1
      velMouse.y = -((mY - rect.top) / rect.height) * 2 + 1

      posMouse.x = ((mX - rect.left) / rect.width) * 2 - 1
      posMouse.y = -((mY - rect.top) / rect.height) * 2 + 1

      velMouse.y *= rect.width / rect.height
      posMouse.y *= rect.width / rect.height
      // console.log(mouse)
    }
  }

  let rect = renderer.domElement.getBoundingClientRect()
  window.addEventListener('resize', () => {
    rect = renderer.domElement.getBoundingClientRect()
  })
  window.dispatchEvent(new Event('resize'))

  window.addEventListener('mousemove', (evt) => {
    setMouse({ mX: evt.pageX, mY: evt.pageY, rect, velVar, posVar })
  })

  onLoop(() => {
    let time = window.performance.now() * 0.001

    velVar.material.uniforms.time.value = time
    posVar.material.uniforms.time.value = time

    gpuCompute.compute()

    myMaterial.uniforms.time.value = time
    myMaterial.uniforms.myPosTexture.value = gpuCompute.getCurrentRenderTarget( posVar ).texture;
    myMaterial.uniforms.myVelTexture.value = gpuCompute.getCurrentRenderTarget( velVar ).texture;
  })
}

let tsks = []
let onLoop = v => tsks.push(v)
makeGPGPU({ onLoop })

camera.position.z = 100;

var settings = {
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0.2,
  bloomRadius: 0
};

var renderScene = new RenderPass( scene, camera );

var bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = settings.bloomThreshold;
bloomPass.strength = settings.bloomStrength;
bloomPass.radius = settings.bloomRadius;

var composer = new EffectComposer(renderer);
composer.addPass( renderScene );
composer.addPass( bloomPass );

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio || 1.5)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  composer.setSize(window.innerWidth, window.innerHeight);
}, false)
window.dispatchEvent(new Event('resize'))

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true

var animate = function () {
  requestAnimationFrame( animate );
  controls.update()

  // drawItem.rotation.x = Math.PI * 0.5 + 0.1
  // renderer.render( scene, camera );
  try {
    tsks.forEach(t => t())
  } catch (e) {
    console.log(e)
  }

  composer.render();
};

animate();
