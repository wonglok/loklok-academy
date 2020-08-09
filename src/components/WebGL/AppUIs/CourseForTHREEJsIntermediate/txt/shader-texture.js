import * as THREE from 'https://unpkg.com/three@0.116.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.116.1/examples/jsm/controls/OrbitControls.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.PlaneBufferGeometry(50, 50, 50, 50);
var loader = new THREE.TextureLoader()
let glsl = v => v[0]
let updateGeoSize = (texture) => {
  let image = texture.image
  drawItem.geometry = new THREE.PlaneBufferGeometry(60, 60 * (image.height / image.width), 50, 50)
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
  vertexShader: glsl`
    uniform float time;
    varying vec2 v_uv;
    void main(void) {
      vec3 nPos = position;
      v_uv = uv;
      nPos.z += sin(nPos.y * 0.1 + time * 10.0) * 10.0;
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
var drawItem = new THREE.Points( geometry, material );
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

  renderer.render( scene, camera );
};

animate();