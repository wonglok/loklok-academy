import * as THREE from 'https://unpkg.com/three@0.116.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.116.1/examples/jsm/controls/OrbitControls.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var lightFront = new THREE.DirectionalLight(0xffffff, 0.4);
lightFront.position.z = 100
scene.add(lightFront)

var pointLightFront = new THREE.PointLight(0xffffff, 0.4);
pointLightFront.position.z = 100
scene.add(pointLightFront)

var lightTop = new THREE.DirectionalLight(0xffffff, 0.4, 0);
lightTop.position.y = 100
scene.add(lightTop)

var geometry = new THREE.TorusKnotBufferGeometry(10, 2.5, 181, 20);
geometry.scale(0.1, 0.1, 0.1);
/* global YELLOW_MAT_CAP */
let texture = new THREE.TextureLoader().load(YELLOW_MAT_CAP);
var material = new THREE.MeshMatcapMaterial({ matcap: texture, color: 0xffffff });
var cube = new THREE.Mesh( geometry, material );
scene.add(cube);

camera.position.z = 5;

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

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
};

animate();