import { Vector2, Vector4 } from "three";

import { playerVisibilityRadius } from "../game/assets.ts";

const defines = {
  PLAYER_RADIUS: playerVisibilityRadius,
};

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

const fragmentShader = `
precision highp float;

uniform sampler2D tDiffuse;
uniform sampler2D SourceImage;
uniform vec4 PositionBounds;
uniform vec2 PlayerPosition;

varying vec2 vUv;

vec4 blend(vec4 source, vec4 target) {
  float alpha = source.a + target.a * (1.0 - source.a);
  vec3 color = (source.rgb * source.a + target.rgb * target.a * (1.0 - source.a)) / alpha;
  return vec4(color, alpha);
}

vec2 unmix(vec2 left, vec2 right, vec2 val) {
  return (val - left) / (right - left);
}

void main() {
  vec2 playerUv = unmix(PositionBounds.xy, PositionBounds.zw, PlayerPosition);
  float distFromPlayer = distance(vUv, playerUv);
  vec4 target = texture2D(tDiffuse, vUv);
  vec4 source = texture2D(SourceImage, vUv);
  gl_FragColor = mix(target, source, smoothstep(0.2, 0.05, distFromPlayer));
}
`;

export const VisibilityShader = {
  defines,
  uniforms,
  vertexShader,
  fragmentShader,
};
export default VisibilityShader;
