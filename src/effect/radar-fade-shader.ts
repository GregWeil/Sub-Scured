import PerlinNoise from "./perlin-noise";
import { radarMapFadeAmount, radarMapFadeSubtract, radarMapFadeSubtractReverse } from "../game/assets";

const defines = {
  FADE_AMOUNT: radarMapFadeAmount,
  FADE_SUBTRACT: radarMapFadeSubtract,
  FADE_SUBTRACT_REVERSE: radarMapFadeSubtractReverse,
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
  vec4 desired = vec4(0.0, 0.0, 0.0, 1.0);
  float noise = psrdnoise(vUv * 100.0, vec2(0.0, 0.0), Time * 10.0, unused);
  float subtract = clamp(noise, -float(FADE_SUBTRACT_REVERSE), 1.0) * float(FADE_SUBTRACT) * DeltaTime;
  vec4 amount = abs(vec4(1.0) - desired - current) * (1.0 - pow(1.0 - float(FADE_AMOUNT), DeltaTime));
  gl_FragColor = mix(current, desired, amount) + vec4(-1.0, -1.0, -1.0, +1.0) * subtract;
  gl_FragColor = clamp(gl_FragColor, vec4(0.0), vec4(1.0));
}
`;

export const RadarFadeShader = {
  defines,
  uniforms,
  vertexShader,
  fragmentShader,
};
export default RadarFadeShader;
