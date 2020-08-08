precision highp float;

uniform lowp vec2 sceneRect;
uniform float time;
varying vec2 vUv;
uniform sampler2D tex;

const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float noise( in vec2 p ) {
	return sin(p.x)*sin(p.y);
}

float fbm4( vec2 p )
{
    float f = 0.0;
    f += 0.5000 * noise( p ); p = m * p * 2.02;
    f += 0.2500 * noise( p ); p = m * p * 2.03;
    f += 0.1250 * noise( p ); p = m * p * 2.01;
    f += 0.0625 * noise( p );
    return f / 0.9375;
}

float fbm6( vec2 p )
{
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
  float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
  return abs(sin(vout + time) * vout);
}

void main (void) {
  vec4 imgColor = texture2D(tex, vUv);
  vec3 outColor = vec3(0.0);

  // if (imgColor.a > 0.0) {
  if (imgColor.r >= 0.1) {
    vec2 pt = vUv.xy;
    pt.y = pt.y * (sceneRect.y / sceneRect.x);
    pt.xy = pt.xy * 3.0;
    outColor.r = 0.1 + 2.0 * pattern(pt.xy + imgColor.r * pt.xy + -0.5 * cos(time));
    outColor.g = 0.1 + 2.0 * pattern(pt.xy + imgColor.g * pt.xy + 0.0);
    outColor.b = 0.1 + 2.0 * pattern(pt.xy + imgColor.b * pt.xy + 0.5 * cos(time));
    outColor.rgb *= imgColor.a;

    gl_FragColor = vec4(clamp(outColor.rgb, 0.0, imgColor.a), outColor.r);
  } else {
    gl_FragColor = vec4(0.0);
  }
}

