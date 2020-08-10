import * as THREE from 'https://unpkg.com/three@0.116.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.116.1/examples/jsm/controls/OrbitControls.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxBufferGeometry(50, 50, 50, 25, 25, 25);

let glsl = v => v[0]
let uniforms = {
  time: { value: 0 }
}
var material = new THREE.ShaderMaterial({
  uniforms,
  transparent: true,
  vertexShader: glsl`
    uniform float time;
    varying vec3 v_pos;
    void main(void) {
      vec3 nPos = position;
      nPos.x += sin(nPos.y * 0.1 + time * 10.0) * 10.0;

      v_pos = vec3(nPos.x, nPos.y, nPos.z);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
    }
  `,
  fragmentShader: glsl`
    varying vec3 v_pos;

    void main (void) {
      gl_FragColor = vec4(normalize(v_pos.xyz) + 0.3, 1.0);
    }
  `
});
var cube = new THREE.LineSegments( geometry, material );
scene.add(cube);

camera.position.z = 100;

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio || 1.5)
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
}, false)
window.dispatchEvent(new Event('resize'))

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
var animate = function () {
  requestAnimationFrame( animate );
  controls.update()
  let time = window.performance.now() * 0.001

  cube.rotation.y += 0.01 * 0.3;

  uniforms.time.value = time

  renderer.render( scene, camera );
};

animate();