import { Vector2, Vector4 } from "three";

import PerlinNoise from "./perlin-noise";
import {} from "../game/assets.ts";

const defines = {};

const uniforms = {
  tDiffuse: { value: null },
  PositionBounds: { value: new Vector4() },
  Time: { value: 0 },
};

const vertexShader = `
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tDiffuse;
uniform vec4 PositionBounds;
uniform float Time;

varying vec2 vUv;

${PerlinNoise}

vec4 blend(vec4 source, vec4 target) {
  float alpha = source.a + target.a * (1.0 - source.a);
  vec3 color = (source.rgb * source.a + target.rgb * target.a * (1.0 - source.a)) / alpha;
  return vec4(color, alpha);
}

void main() {
  vec2 unused;
  vec2 offset = -mix(PositionBounds.xy, PositionBounds.zw, 0.5);
  vec2 worldPos = mix(PositionBounds.xy, PositionBounds.zw, vUv);
  float noise1 = psrdnoise((worldPos + 0.8 * offset) * 0.01, vec2(0.0, 0.0), Time + 1.0, unused);
  float noise2 = psrdnoise((worldPos + 0.5 * offset) * 0.1, vec2(0.0, 0.0), Time + 10.0, unused);
  float noise3 = psrdnoise((worldPos + 0.2 * offset) * 0.4, vec2(0.0, 0.0), Time + 100.0, unused);
  float noiseg = psrdnoise((worldPos + 0.3 * offset) * 0.4, vec2(0.0, 0.0), Time * 5.0, unused);
  vec3 waterColor = vec3(0.03, 0.01 + 0.05 * noiseg, 0.15 + noise1 * 0.05 + noise2 * 0.01 + noise3 * 0.01) + 0.1 * vec3(vUv, 0.0);
  gl_FragColor = blend(texture2D(tDiffuse, vUv), vec4(waterColor, 1.0));
}
`;

export const WaterBackgroundShader = {
  defines,
  uniforms,
  vertexShader,
  fragmentShader,
};
export default WaterBackgroundShader;
