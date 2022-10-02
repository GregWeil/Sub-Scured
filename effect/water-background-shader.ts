import { Vector2, Vector4 } from "three";

import PerlinNoise from './perlin-noise';
import {} from "../game/assets.ts";

const defines = {};

const uniforms = {
  tDiffuse: { value: null },
  PositionBounds: { value: new Vector4() },
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

varying vec2 vUv;

${PerlinNoise}

vec4 blend(vec4 source, vec4 target) {
  float alpha = source.a + target.a * (1.0 - source.a);
  vec3 color = (source.rgb * source.a + target.rgb * target.a * (1.0 - source.a)) / alpha;
  return vec4(color, alpha);
}

void main() {
  vec2 worldPos = mix(PositionBounds.xy, PositionBounds.zw, vUv);
  float noise = psrdnoise(worldPos, vec2(100.0, 100.0), 0);
  vec3 waterColor = vec3(0.03, 0.05, 0.1 + noise) + 0.1 * vec3(vUv, 0.0);
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
