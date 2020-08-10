import * as THREE from 'https://unpkg.com/three@0.116.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.116.1/examples/jsm/controls/OrbitControls.js';
import { GPUComputationRenderer } from 'https://unpkg.com/three@0.116.1/examples/jsm/misc/GPUComputationRenderer.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let Dimension = 280
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

	void main (void) {
		vec2 uv = gl_FragCoord.xy / resolution.xy;
		vec4 lastPos = texture2D(texturePosition, uv);
		vec4 lastVel = texture2D(textureVelocity, uv);

		float noisiness = 9.0;

    float az = 0.0;
    float el = 0.0;

    vec3 noiser = vec3(lastPos) + cnoise(vec2(lastVel * noisiness)) * noisiness * 0.5;
    toBall(noiser, az, el);
    if (rand(lastVel.xy) > 0.133333) {
      lastPos.xyz = fromBall(50.0, az, el);
    } else {
      lastPos.xyz += fromBall(-5.5, az, el);
    }

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
	myTexture: { value: null },
	myVelTexture: { value: null }
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
			gl_PointSize = 1.0;
    }
  `,
	fragmentShader: glsl`
    uniform sampler2D myVelTexture;
    varying vec2 vUv;
    void main (void) {
      vec4 rainbow = texture2D(myVelTexture, vUv);
      vec4 outputColor = vec4(
        rainbow.x + 0.6,
        (rainbow.y * rainbow.x) + 0.6,
        rainbow.y + 0.6,
        1.0
      );

      gl_FragColor = vec4(normalize(outputColor.rgb), 0.235);
    }
  `
})

var geometry = new THREE.PlaneBufferGeometry(1.0, 1.0, Dimension, Dimension);
// Update texture uniforms in your visualization materials with the gpu renderer output

var drawItem = new THREE.Points(geometry, myMaterial);
drawItem.scale.set(0.5, 0.5, 0.5);

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
	myMaterial.uniforms.myVelTexture.value = gpuCompute.getCurrentRenderTarget( velVar ).texture;

  // drawItem.rotation.x = Math.PI * 0.5 + 0.1
  renderer.render( scene, camera );
};

animate();