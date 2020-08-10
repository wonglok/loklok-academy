import * as THREE from 'https://unpkg.com/three@0.116.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.116.1/examples/jsm/controls/OrbitControls.js';
import { GPUComputationRenderer } from 'https://unpkg.com/three@0.116.1/examples/jsm/misc/GPUComputationRenderer.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let Dimension = 80
// Initialization...
// Create computation renderer
var gpuCompute = new GPUComputationRenderer(Dimension, Dimension, renderer );

// Create initial state float textures
var pos0 = gpuCompute.createTexture();
var vel0 = gpuCompute.createTexture();
// and fill in here the texture data...

let makeGeo = (pos0) => {
	console.log(pos0)
	let data = pos0.image.data
	let width = pos0.image.width
	let height = pos0.image.height
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
makeGeo(pos0)


let glsl = v => v[0]
let fragmentShaderVel = glsl`


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

	void main (void) {
		vec2 uv = gl_FragCoord.xy / resolution.xy;
		vec4 lastPos = texture2D(texturePosition, uv);
		vec4 lastVel = texture2D(textureVelocity, uv);

		vec3 diff = getDiff(lastPos.xyz, vec3(0.0, 0.0, 0.1) );
		lastVel.xyz += diff;

		gl_FragColor = lastVel;
	}
`

let fragmentShaderPos = glsl`
	void main (void) {
		vec2 uv = gl_FragCoord.xy / resolution.xy;
		vec4 lastPos = texture2D(texturePosition, uv);
		vec4 lastVel = texture2D(textureVelocity, uv);
		lastPos.xyz += lastVel.xyz;
		gl_FragColor = lastPos;
	}
`

// Add texture variables
var velVar = gpuCompute.addVariable("textureVelocity", fragmentShaderVel, pos0 );
var posVar = gpuCompute.addVariable("texturePosition", fragmentShaderPos, vel0 );

// Add variable dependencies
gpuCompute.setVariableDependencies(velVar, [velVar, posVar]);
gpuCompute.setVariableDependencies(posVar, [velVar, posVar]);

// Add custom uniforms
velVar.material.uniforms.time = { value: 0.0 };

// Check for completeness
var error = gpuCompute.init();
if ( error !== null ) {
	console.error( error );
}

let uniforms = {
	time: { value: 0 },
	myTexture: { value: null }
}
var myMaterial = new THREE.ShaderMaterial({
	uniforms,
  transparent: true,
  vertexShader: glsl`
		uniform float time;
		varying vec2 vUv;
		uniform sampler2D myTexture;

    void main (void) {
			vUv = uv;

			vec4 myData = texture2D(myTexture, uv);
      vec3 nPos = position + myData.xyz;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
			gl_PointSize = 3.0;
    }
  `,
	fragmentShader: glsl`
    void main (void) {
      gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
    }
  `
})

var geometry = new THREE.PlaneBufferGeometry(100, 100, Dimension, Dimension);
// Update texture uniforms in your visualization materials with the gpu renderer output

var drawItem = new THREE.Points(geometry, myMaterial);

// Do your rendering
scene.add(drawItem);

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
	gpuCompute.compute()

	let time = window.performance.now() * 0.001
	myMaterial.uniforms.time.value = time
	myMaterial.uniforms.myTexture.value = gpuCompute.getCurrentRenderTarget( posVar ).texture;

  // drawItem.rotation.x = Math.PI * 0.5 + 0.1
  renderer.render( scene, camera );
};

animate();