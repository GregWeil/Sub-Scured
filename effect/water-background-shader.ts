import { Vector2, Vector4 } from "three";

import {} from "../game/assets.ts";

const defines = {};

const uniforms = {
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

uniform vec4 PositionBounds;

varying vec2 vUv;

void main() {
  vec2 worldPos = mix(PositionBounds.xy, PositionBounds.zw, vUv);
  gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
}
`;

export const WaterBackgroundShader = {
  defines,
  uniforms,
  vertexShader,
  fragmentShader,
};
export default WaterBackgroundShader;
