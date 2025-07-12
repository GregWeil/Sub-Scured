import { Vector2, Vector4 } from "three";

import {
  playerVisibilityInnerRadius,
  playerVisibilityOuterRadius,
  radarPingSpeed,
  radarPingAcceleration,
  radarPingInnerThickness,
  radarPingOuterThickness,
  radarPingFadeStart,
  radarPingFadeEnd,
} from "../game/assets.ts";

const defines = {
  PLAYER_INNER_RADIUS: playerVisibilityInnerRadius,
  PLAYER_OUTER_RADIUS: playerVisibilityOuterRadius,
  RADAR_SPEED: radarPingSpeed,
  RADAR_ACCELERATION: radarPingAcceleration,
  RADAR_INNER_THICKNESS: radarPingInnerThickness,
  RADAR_OUTER_THICKNESS: radarPingOuterThickness,
  RADAR_FADE_START: radarPingFadeStart,
  RADAR_FADE_END: radarPingFadeEnd,
};

const uniforms = {
  tDiffuse: { value: null },
  SourceImage: { value: null },
  PositionBounds: { value: new Vector4() },
  PlayerPosition: { value: new Vector2() },
  RadarPosition: { value: new Vector2() },
  RadarTime: { value: 0 },
  TransitionAmount: { value: 1 },
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
uniform vec2 RadarPosition;
uniform float RadarTime;
uniform float TransitionAmount;

varying vec2 vUv;

void main() {
  vec2 worldPos = mix(PositionBounds.xy, PositionBounds.zw, vUv);
  float distFromPlayer = distance(PlayerPosition, worldPos);
  float playerVisibility = smoothstep(float(PLAYER_OUTER_RADIUS), float(PLAYER_INNER_RADIUS), distFromPlayer);
  float radarRadius = (float(RADAR_SPEED) + float(RADAR_ACCELERATION) * RadarTime / 2.0) * RadarTime;
  float distFromRadar = abs(distance(RadarPosition, worldPos) - radarRadius);
  float radarFade = smoothstep(float(RADAR_FADE_END), float(RADAR_FADE_START), RadarTime);
  float radarVisibility = smoothstep(float(RADAR_OUTER_THICKNESS), float(RADAR_INNER_THICKNESS) * radarFade, distFromRadar);
  vec4 target = texture2D(tDiffuse, vUv);
  vec4 source = texture2D(SourceImage, vUv);
  gl_FragColor = mix(target, source, max(playerVisibility, radarVisibility * pow(radarFade, 3.0)) * TransitionAmount);
}
`;

export const VisibilityShader = {
  defines,
  uniforms,
  vertexShader,
  fragmentShader,
};
export default VisibilityShader;
