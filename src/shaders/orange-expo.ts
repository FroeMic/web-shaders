import type { ShaderDefinition } from "../types";

export const ORANGE_EXPO_SHADER_ID = "orange-expo";

export const orangeExpoShader: ShaderDefinition = {
  id: ORANGE_EXPO_SHADER_ID,
  name: "Orange Expo",
  description:
    "A pixelated orange gradient field inspired by a YC startup expo landing page.",
  frameworkAgnostic: true,
  fragment: `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float pixelGrid(vec2 uv, float size) {
  vec2 grid = floor(uv * size);
  float n = hash(grid);
  vec2 cell = fract(uv * size);
  float edge = smoothstep(0.0, 0.04, cell.x) * smoothstep(0.0, 0.04, cell.y);
  return (n - 0.5) * 0.035 * edge;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 centered = uv - 0.5;
  centered.x *= u_resolution.x / u_resolution.y;

  float leftHeat = 1.0 - smoothstep(-0.2, 1.15, uv.x);
  float lowerHeat = 1.0 - smoothstep(0.05, 0.95, uv.y);
  float glow = exp(-3.2 * length(centered - vec2(0.18, -0.22)));
  float verticalBand = smoothstep(0.45, 0.64, uv.x) * (1.0 - smoothstep(0.72, 1.0, uv.x));
  float topRightLight = smoothstep(0.38, 1.0, uv.x) * smoothstep(0.42, 1.0, uv.y);

  float grain =
    pixelGrid(uv + vec2(u_time * 0.006, 0.0), 30.0) +
    pixelGrid(uv + vec2(0.0, u_time * 0.004), 54.0);

  vec2 pointer = u_pointer / max(u_resolution, vec2(1.0));
  float pointerGlow = exp(-8.0 * distance(uv, pointer));

  vec3 orange = vec3(1.0, 0.33, 0.0);
  vec3 amber = vec3(1.0, 0.64, 0.28);
  vec3 cream = vec3(1.0, 0.78, 0.55);
  vec3 ember = vec3(0.95, 0.17, 0.0);

  vec3 color = mix(orange, amber, uv.x * 0.42 + uv.y * 0.2);
  color = mix(color, cream, topRightLight * 0.48);
  color = mix(color, ember, glow * 0.55 + verticalBand * lowerHeat * 0.2);
  color += vec3(1.0, 0.38, 0.06) * leftHeat * 0.2;
  color += vec3(1.0, 0.48, 0.14) * pointerGlow * 0.08;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`,
};
