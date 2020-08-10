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

var geometry = new THREE.DodecahedronBufferGeometry(2, 1);
var material = new THREE.MeshStandardMaterial({ flatShading: true, color: 0x00ff00, wireframe: false });
var cube = new THREE.Mesh( geometry, material );
scene.add(cube);

let o3d = new THREE.Object3D()
cube.add(o3d)

var geometry2 = new THREE.BoxBufferGeometry();
var material2 = new THREE.MeshStandardMaterial({ flatShading: false, color: 0x00ffff, wireframe: false });
var cube2 = new THREE.Mesh( geometry2, material2 );
cube2.position.x = 3
o3d.add(cube2)

var geometry3 = new THREE.SphereGeometry(1, 15, 15);
var material3 = new THREE.MeshStandardMaterial({ flatShading: true, color: 0xffff00, wireframe: false });
var cube3 = new THREE.Mesh( geometry3, material3 );
cube3.position.x = -4
o3d.add(cube3)

camera.position.z = 20;

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
  cube.rotation.y += 0.03;
  cube.rotation.z += 0.01;

  cube2.rotation.x += 0.03;
  cube2.rotation.y += 0.01;
  cube2.rotation.z += 0.11;

  cube3.rotation.x += 0.01;
  cube3.rotation.y += 0.01;
  cube3.rotation.z += 0.03;

  renderer.render( scene, camera );
};

animate();