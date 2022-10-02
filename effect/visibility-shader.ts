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

vec4 function blend(vec4 source, vec4 target) {
  float a = source.a + target.a * (1.0 - source.a);
  vec3 color = (source.rgb * source.a + target.rgb * target.a * (1.0 - source.a)) / gl_FragColor.a;
  
}

void main() {
  vec4 source = texture2D(SourceImage, vUv);
  vec4 target = texture2D(tDiffuse, vUv);
  gl_FragColor.a = source.a + target.a * (1.0 - source.a);
  gl_FragColor.rgb = (source.rgb * source.a + target.rgb * target.a * (1.0 - source.a)) / gl_FragColor.a;
}
`;

export const VisibilityShader = {
  defines,
  uniforms,
  vertexShader,
  fragmentShader,
};
export default VisibilityShader;
