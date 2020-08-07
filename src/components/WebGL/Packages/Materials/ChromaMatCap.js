// import { ShaderChunk } from 'three/src/renderers/shaders/ShaderLib'
import { mergeUniforms } from 'three/src/renderers/shaders/UniformsUtils.js'
import { UniformsLib } from 'three/src/renderers/shaders/UniformsLib.js'
import { ShaderMaterial } from 'three'
// import { CanvasPaintTexture2D } from '../../Reusable/CanvasPaintTexture'
let glsl = (v, ...args) => {
  let str = ''
  v.forEach((e, i) => {
    str += e + (args[i] || '')
  })
  return str
}

export class ChromaMatCap extends ShaderMaterial {
  constructor ({ onLoop, scale, ...props }) {
    super({
      uniforms: mergeUniforms( [
        UniformsLib.common,
        UniformsLib.bumpmap,
        UniformsLib.normalmap,
        UniformsLib.displacementmap,
        UniformsLib.fog,
        {
          matcap: { value: null }
        },
        {
          time: { value: 0 }
        },
        {
          scale: { value: scale }
        }
      ] ),
      vertexShader: ChromaMatCap.vertexShader,
      fragmentShader: ChromaMatCap.fragmentShader
    })
    this.onLoop = onLoop
    this.uniforms.matcap = { value: props.matcap }
    this.onLoop(() => {
      this.uniforms.time.value = window.performance.now() / 1000
    })

    // let painter = new CanvasPaintTexture2D({ onLoop })
    // this.uniforms.matcap.value = painter.out.texture
  }
  get matcap () {
    return this.uniforms.matcap.value
  }
  set matcap (v) {
    this.uniforms.matcap.value = v
  }
  get scale () {
    return this.uniforms.scale.value
  }
  set scale (v) {
    this.uniforms.scale.value = v
  }
  static vertexShader = glsl`
    #define MATCAP
    varying vec3 vViewPosition;
    #ifndef FLAT_SHADED
      varying vec3 vNormal;
    #endif
    #include <common>
    #include <uv_pars_vertex>
    #include <color_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>

    void main() {
      #include <uv_vertex>
      #include <color_vertex>
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
      #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
        vNormal = normalize( transformedNormal );
      #endif
      #include <begin_vertex>

      #include <worldpos_vertex>

      #include <morphtarget_vertex>
      #include <skinning_vertex>
      #include <displacementmap_vertex>
      #include <project_vertex>
      #include <logdepthbuf_vertex>
      #include <clipping_planes_vertex>
      #include <fog_vertex>
      vViewPosition = - mvPosition.xyz;


      float mFresnelBias = 0.1;
      float mRefractionRatio = 1.02;
      float mFresnelPower = 0.7;
      float mFresnelScale = 0.6;

      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    }
  `
  static fragmentShader = glsl`
    #define MATCAP
    uniform vec3 diffuse;
    uniform float scale;
    uniform float opacity;
    uniform float time;
    uniform sampler2D matcap;
    varying vec3 vViewPosition;
    #ifndef FLAT_SHADED
      varying vec3 vNormal;
    #endif
    #include <common>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <fog_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>


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
        f += 0.500000*(0.5 + 0.5 * noise( p )); p = m*p*2.02;
        f += 0.250000*(0.5 + 0.5 * noise( p )); p = m*p*2.03;
        f += 0.125000*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
        f += 0.062500*(0.5 + 0.5 * noise( p )); p = m*p*2.04;
        f += 0.031250*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
        f += 0.015625*(0.5 + 0.5 * noise( p ));
        return f/0.96875;
    }

    float pattern (vec2 p) {
      float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
      return abs(vout);
    }

    void main() {
      #include <clipping_planes_fragment>
      vec4 diffuseColor = vec4( diffuse, opacity );
      #include <logdepthbuf_fragment>
      #include <map_fragment>
      #include <color_fragment>
      #include <alphamap_fragment>
      #include <alphatest_fragment>
      #include <normal_fragment_begin>
      #include <normal_fragment_maps>
      vec3 viewDir = normalize( vViewPosition );
      vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
      vec3 y = cross( viewDir, x );
      vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks
      #ifdef USE_MATCAP
        vec4 matcapColor = texture2D( matcap, uv );
        matcapColor = matcapTexelToLinear( matcapColor );
      #else
        vec4 matcapColor = vec4( 1.0 );
      #endif
      // float radius = length(uv - 0.5);

      matcapColor.xyz = matcapColor.xyz * vec3(
        1.0 - pattern(uv * 10.0123 * scale + -0.37 * cos(time * 0.15)),
        1.0 - pattern(uv * 10.0123 * scale +  0.0 * cos(time * 0.15)),
        1.0 - pattern(uv * 10.0123 * scale +  0.37 * cos(time * 0.15))
      );

      vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

      gl_FragColor = vec4( outgoingLight, diffuseColor.a );
      #include <tonemapping_fragment>
      #include <encodings_fragment>
      #include <fog_fragment>
      #include <premultiplied_alpha_fragment>
      #include <dithering_fragment>
    }
  `
}