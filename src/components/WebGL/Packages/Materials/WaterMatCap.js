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

export class WaterMatCap extends ShaderMaterial {
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
      vertexShader: WaterMatCap.vertexShader,
      fragmentShader: WaterMatCap.fragmentShader
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


    // Found this on GLSL sandbox. I really liked it, changed a few things and made it tileable.
    // :)
    // by David Hoskins.


    // Water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07


    // Redefine below to see the tiling...
    //#define SHOW_TILING

    #define TAU 6.28318530718
    #define MAX_ITER 35

    vec4 waterwaves( in vec2 fragCoord, in vec2 iResolution, in float iTime, in float radius)
    {
      float time = iTime * .5+23.0;
        // uv should be the 0-1 uv of texture...
      vec2 uv = fragCoord.xy / iResolution.xy;

    #ifdef SHOW_TILING
      vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
    #else
        vec2 p = mod(uv*TAU, TAU)-250.0;
    #endif
      vec2 i = vec2(p);
      float c = 1.0;
      float inten = .005;

      for (int n = 0; n < MAX_ITER; n++)
      {
        float t = time * (1.0 - (3.5 / float(n+1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
      }
      c /= float(MAX_ITER);
      c = 1.17-pow(c, 1.4);
      vec3 colour = vec3(pow(abs(c), 8.0));
      colour = clamp(colour * colour * vec3(0.0, 0.45, 0.8) * 2.0 + 0.15, 0.0, 1.0);


      #ifdef SHOW_TILING
      // Flash tile borders...
      vec2 pixel = 2.0 / iResolution.xy;
      uv *= 2.0;

      float f = floor(mod(iTime*.5, 2.0)); 	// Flash value.
      vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
      uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
      colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line

      #endif
      return vec4(colour, 1.0);
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
      float radius = length(uv - 0.5);
      if (radius < 0.5) {
        matcapColor = waterwaves(uv * scale, vec2(1.0, 1.0), time, radius);
      }

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