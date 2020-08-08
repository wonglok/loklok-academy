#include <common>

uniform vec3 myColor;
uniform float time;
uniform float radius;
uniform vec2 resolution;
varying vec3 vPos;
// void main (void) {
//   vec2 muv = gl_FragCoord.xy / resolution.xy;
//   gl_FragColor.r = 1.0 + sin(10.0 * muv.x + time * 1.0);
//   gl_FragColor.g = 1.0 + cos(10.0 * muv.x + time * 1.0);
//   gl_FragColor.b = 0.5;
//   gl_FragColor.a = 1.0;
// }


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
    return f / 0.96875;
}

float pattern (vec2 p) {

  float vout = fbm4( p + time + fbm6( p + fbm4( p + time )) );
  return abs(vout);
}

void main (void) {
  vec2 muv = gl_FragCoord.xy / resolution.xy;
  vec3 outColor = vec3(0.0);
  vec2 pt = muv.xy;
  pt.xy *= 2.0;
  pt.y = pt.y * (resolution.y / resolution.x);

  if (rand(vec2(radius, 1.0)) < 0.15) {
    // outColor.r = myColor.r + 0.5 * sin(time * 3.0);
    // outColor.g = myColor.g + 0.5 * sin(time * 3.0);
    // outColor.b = myColor.b;

    outColor.r = pattern(pt.xy + vec2(0.0, -0.15 * cos(time)));
    outColor.g = pattern(pt.xy + 0.0);
    outColor.b = pattern(pt.xy + vec2(0.0, 0.15 * cos(time)));
  } else {
    outColor.r = myColor.r + 0.1 * sin(time);
    outColor.g = myColor.g + 0.1 * sin(time);
    outColor.b = myColor.b;
  }

  gl_FragColor = vec4(clamp(outColor.rgb, 0.0, 1.0), 0.8);
}