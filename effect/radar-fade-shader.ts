import PerlinNoise from "./perlin-noise";
import { radarFadeAmount, radarFadeSubtract } from "../game/assets.ts";

const defines = {
  FADE_AMOUNT: radarFadeAmount,
  FADE_SUBTRACT: radarFadeSubtract,
};

const uniforms = {
  tDiffuse: { value: null },
  DeltaTime: { value: 0 },
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
uniform float DeltaTime;
uniform float Time;

varying vec2 vUv;

${PerlinNoise}

void main() {
  vec2 unused;
  vec4 current = texture2D(tDiffuse, vUv);
  float subtract = /*psrdnoise(vUv, vec2(0.0, 0.0), Time, unused)*/1.0 * float(FADE_SUBTRACT) * DeltaTime;
  float amount = pow(1.0 - float(FADE_AMOUNT), DeltaTime);
  gl_FragColor = texture2D(tDiffuse, vUv) * amount - vec4(1.0, 1.0, 1.0, 0.0) * subtract;
}
`;

export const RadarFadeShader = {
  defines,
  uniforms,
  vertexShader,
  fragmentShader,
};
export default RadarFadeShader;
