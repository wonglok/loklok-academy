// import { PlaneBufferGeometry } from 'three'
import { ShaderMaterial, PlaneBufferGeometry, Points, LineSegments } from 'three'
import { Vector2 } from 'three'

let glsl = v => v[0]
export class FastFlame {
  constructor ({ renderer, onLoop, camera, onResize, onClean, resX = 128, resY = 128 }) {
    this.renderer = renderer
    this.onLoop = onLoop
    this.onClean = onClean
    this.onResize = onResize
    this.camera = camera
    this.resX = resX
    this.resY = resY
    this.out = {}
    this.works = []
    this.addWork = v => this.works.push(v)

    let material = new ShaderMaterial({
      transparent: true,
      wireframe: true,
      defines: {
        'isPoint': 'true',
        'pi': Math.PI
      },
      uniforms: {
        opacity: { value: 1 },
        aspect: { value: 1 },
        offset: { value: Math.random() * 1.0 },
        time: { value: null }
      },
      vertexShader: this.getDisplayVert({ height: resY }),
      fragmentShader: this.getDisplayFrag()
    })
    let size = new Vector2(1, 1)
    this.onResize(() => {
      renderer.getSize(size)
      material.uniforms.aspect.value = size.x / size.y
    })

    let geometry = new PlaneBufferGeometry(resX * 2, resY * 2, resX, resY)
    this.out.mesh = new LineSegments(geometry, material)
    material.defines.isPoint = this.out.mesh instanceof Points ? 'true' : 'false'

    this.addWork(() => {
      let time = window.performance.now() * 0.001
      material.uniforms.time.value = time * 0.43
    })

    this.onLoop(() => {
      this.works.forEach((v) => { v() })
    })
  }
  setOpacity (v) {
    this.out.mesh.material.uniforms.opacity.value = v
  }

  getDisplayVert () {
    return glsl`
      uniform float time;
      uniform float offset;
      uniform float aspect;

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

      // varying vec3 varColor;

      varying vec2 vUv;
      void main (void) {
        vec4 outputData = vec4(0.0);

        float oTime = time * 0.7 + offset;

        vUv = uv;
        vec3 newPos = position;
        vec3 newNormal = normal;

        float dynamo = 200.0 * (-0.25 + pattern(uv.xy + cos(0.1 + oTime), oTime));
        float dynamo2 = 200.0 * (-0.25 + pattern(uv.yx + cos(0.1 + oTime), oTime));
        newPos.x = mix(position.x, dynamo, 0.0);
        newPos.y = mix(position.y, dynamo, 1.0);
        newPos.z = mix(position.z, dynamo2, 0.5) * -1.0;

        vec4 transformedNormal = vec4(newNormal, 0.);
        vec4 transformedPosition = vec4(newPos, 1.0);
        #ifdef USE_INSTANCING
          transformedNormal = instanceMatrix * transformedNormal;
          transformedPosition = instanceMatrix * transformedPosition;
        #endif

        vec4 mvPosition = modelViewMatrix * vec4( transformedPosition.xyz, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( transformedPosition.xyz, 1.0 );
        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * transformedNormal.xyz );

        // vec3 I = worldPosition.xyz - cameraPosition;
        // varColor = refract(normalize(I), worldNormal, 1.03);

        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = (1.0 + 1.5 * aspect);
        // * mix(0.3, 1.0, sin(pi * vUv.x * 2.0 + time * -10.0)));
      }
    `
  }

  getDisplayFrag () {
    return glsl`
      #include <common>
      uniform float time;
      uniform float offset;
      uniform float opacity;

      const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

      float noise( in vec2 p ) {
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

      float pattern (vec2 p) {
        float vout = fbm4(p / fbm6(p));
        return (vout);
      }

      varying vec2 vUv;

      void main (void) {
        float oTime = time;

        float rx = pattern(vUv.xy + sin(0.1 * 2.0 * pi + oTime * 2.0));
        float ry = pattern(vUv.xy + sin(0.2 * 2.0 * pi + oTime * 2.0));
        float rz = pattern(vUv.xy + sin(0.3 * 2.0 * pi + oTime * 2.0));

        if (isPoint) {
          float hpt = length(gl_PointCoord.xy - 0.5);
          if (hpt <= 0.5) {
            gl_FragColor = vec4(vec3(rx, ry, rz) * 0.5 + 0.25, 0.333 * opacity);
          } else {
            discard;
          }
        } else {
          gl_FragColor = vec4(vec3(rx, ry, rz) * vec3(rx, ry, rz) * 4.5, 0.333 * opacity);
        }
      }
    `
  }
}