import type { ShaderDefinition } from "../types";

export const GRAINIENT_SHADER_ID = "grainient";

// Ported from the react-bits "Grainient" component (originally WebGL2 / GLSL
// ES 3.00, driven by many uniforms) down to the framework-agnostic GLSL ES 1.00
// renderer used here. The look-and-feel parameters are baked in as constants to
// match the warm orange palette used on the interaction42 site.
export const grainientShader: ShaderDefinition = {
  id: GRAINIENT_SHADER_ID,
  name: "Grainient",
  description:
    "Grainy gradient swirls with soft wave distortion in a warm orange palette.",
  frameworkAgnostic: true,
  fragment: `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;

#define S(a, b, t) smoothstep(a, b, t)

const float TIME_SPEED = 0.7;
const float COLOR_BALANCE = 0.0;
const float WARP_STRENGTH = 1.0;
const float WARP_FREQUENCY = 5.0;
const float WARP_SPEED = 2.0;
const float WARP_AMPLITUDE = 50.0;
const float BLEND_ANGLE = 0.0;
const float BLEND_SOFTNESS = 0.05;
const float ROTATION_AMOUNT = 500.0;
const float NOISE_SCALE = 2.0;
const float GRAIN_AMOUNT = 0.1;
const float GRAIN_SCALE = 2.0;
const float CONTRAST = 1.5;
const float GAMMA = 1.0;
const float SATURATION = 1.0;
const vec2 CENTER_OFFSET = vec2(0.0, 0.0);
const float ZOOM = 0.9;

const vec3 COLOR1 = vec3(0.9764706, 0.5960784, 0.0862745); // #f99816
const vec3 COLOR2 = vec3(0.9764706, 0.4509804, 0.0862745); // #f97316
const vec3 COLOR3 = vec3(0.9607843, 0.9254902, 0.8549020); // #f5ecda

mat2 Rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
  return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  float n = mix(
    mix(
      dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)),
      u.x
    ),
    mix(
      dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)),
      u.x
    ),
    u.y
  );
  return 0.5 + 0.5 * n;
}

void main() {
  float t = u_time * TIME_SPEED;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float ratio = u_resolution.x / u_resolution.y;

  vec2 tuv = uv - 0.5 + CENTER_OFFSET;
  tuv /= max(ZOOM, 0.001);

  float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) * NOISE_SCALE);
  tuv.y *= 1.0 / ratio;
  tuv *= Rot(radians((degree - 0.5) * ROTATION_AMOUNT + 180.0));
  tuv.y *= ratio;

  float frequency = WARP_FREQUENCY;
  float ws = max(WARP_STRENGTH, 0.001);
  float amplitude = WARP_AMPLITUDE / ws;
  float warpTime = t * WARP_SPEED;
  tuv.x += sin(tuv.y * frequency + warpTime) / amplitude;
  tuv.y += sin(tuv.x * (frequency * 1.5) + warpTime) / (amplitude * 0.5);

  vec3 colLav = COLOR1;
  vec3 colOrg = COLOR2;
  vec3 colDark = COLOR3;
  float b = COLOR_BALANCE;
  float s = max(BLEND_SOFTNESS, 0.0);
  mat2 blendRot = Rot(radians(BLEND_ANGLE));
  float blendX = (tuv * blendRot).x;
  float edge0 = -0.3 - b - s;
  float edge1 = 0.2 - b + s;
  float v0 = 0.5 - b + s;
  float v1 = -0.3 - b - s;
  vec3 layer1 = mix(colDark, colOrg, S(edge0, edge1, blendX));
  vec3 layer2 = mix(colOrg, colLav, S(edge0, edge1, blendX));
  vec3 col = mix(layer1, layer2, S(v0, v1, tuv.y));

  vec2 grainUv = uv * max(GRAIN_SCALE, 0.001);
  float grain = fract(sin(dot(grainUv, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * GRAIN_AMOUNT;

  col = (col - 0.5) * CONTRAST + 0.5;
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, SATURATION);
  col = pow(max(col, 0.0), vec3(1.0 / max(GAMMA, 0.001)));
  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`,
};
