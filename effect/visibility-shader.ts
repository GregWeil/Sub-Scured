import { Vector2, Vector4 } from "three";

const uniforms = {
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
as
const fragmentShader = `
precision highp float;

uniform sampler2D SourceImage;
uniform vec4 PositionBounds;
uniform vec2 PlayerPosition;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv, 0.5, 1);
}
`;

export const VisibilityShader = {
  uniforms,
  vertexShader,
  fragmentShader,
};
export default VisibilityShader;
