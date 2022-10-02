import { Vector2, Vector4 } from "three";

import{playerVisibilityRadius}from'../game/assets.ts'

const defines = {
  PLAYER_RADIUS: playerVisibilityRadius
}

const uniforms = {
  tDiffuse: { value: null },
  SourceImage: { value: null },
  PositionBounds: { value: new Vector4() },
  PlayerPosition: { value: new Vector2() },
};

const vertexShader = `
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
as;
const fragmentShader = `
precision highp float;

uniform sampler2D tDiffuse
uniform sampler2D SourceImage;
uniform vec4 PositionBounds;
uniform vec2 PlayerPosition;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv, 0.5, 1);
}
`;

export const VisibilityShader = {
  defines,
  uniforms,
  vertexShader,
  fragmentShader,
};
export default VisibilityShader;
