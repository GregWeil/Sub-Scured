import { Vector2, Vector4 } from "three";

import PerlinNoise from "./perlin-noise";
import {} from "../game/assets.ts";

const defines = {};

const uniforms = {
  tDiffuse: { value: null },
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
uniform float Time;

varying vec2 vUv;

${PerlinNoise}

void main() {
  vec2 unused;
  float noise = psrdnoise(vUv, vec2(0.0, 0.0), Time, unused);
  vec4 current = texture2D(tDiffuse, vUv);
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
