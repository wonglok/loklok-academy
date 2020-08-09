import * as THREE from 'https://unpkg.com/three@0.116.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.116.1/examples/jsm/controls/OrbitControls.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.PlaneBufferGeometry(50, 50, 100, 100);
var loader = new THREE.TextureLoader()
let glsl = v => v[0]
let updateGeoSize = (texture) => {
  let image = texture.image
  drawItem.geometry = new THREE.PlaneBufferGeometry(60, 60 * (image.height / image.width), 100, 100)
  drawItem.geometry.rotateZ(Math.PI * 0.5)
}
let uniforms = {
  /* global SPIRAL_IMG_URL */
  spiral: { value: loader.load(SPIRAL_IMG_URL, updateGeoSize) },
  time: { value: 0 }
}
var material = new THREE.ShaderMaterial({
  uniforms,
  transparent: true,
  wireframe: true,
  vertexShader: glsl`
    uniform float time;
    varying vec2 v_uv;

    const mat2 m = mat2(0.80,  0.60, -0.60,  0.80);

    /* NEW GLSL NOISE FBM */
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

    void main(void) {
      vec3 nPos = position;
      v_uv = uv;
      // nPos.z += sin(nPos.y * 0.1 + time * 10.0) * 10.0;

      // nPos.x += (1.0 - pattern(uv + nPos.y * 0.1, time * 0.1)) * 10.0;

      float dynamo = 200.0 * (-0.25 + pattern(uv.xy + cos(0.1 + time * 0.2), time * 0.2));
      float dynamo2 = 200.0 * (-0.25 + pattern(uv.yx + cos(0.1 + time * 0.2), time * 0.2));
      nPos.x = 3.5 * mix(position.x, dynamo, 0.0);
      nPos.y = mix(position.y, dynamo, 1.0);
      nPos.z = mix(position.z, dynamo2, 0.5) * -1.0;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
      gl_PointSize = 5.0;
    }
  `,
  fragmentShader: glsl`
    varying vec2 v_uv;
    uniform sampler2D spiral;
    void main (void) {
      vec4 imageColor = texture2D(spiral, v_uv);
      gl_FragColor = vec4(imageColor.rgb, 1.0);
    }
  `
});
var drawItem = new THREE.Mesh( geometry, material );
scene.add(drawItem);

camera.position.z = 100;

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio || 1.5)
}, false)
window.dispatchEvent(new Event('resize'))

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
var animate = function () {
  requestAnimationFrame( animate );
  controls.update()
  let time = window.performance.now() * 0.001

  uniforms.time.value = time
  // drawItem.rotation.x = Math.PI * 0.5 + 0.1
  renderer.render( scene, camera );
};

animate();