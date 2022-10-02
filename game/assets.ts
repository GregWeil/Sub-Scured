
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export const ModelLoader = new GLTFLoader();

export const overlayColor = 0x115630;
export const terrainColor = 0x04fb06;

const assetPath =
  "https://cdn.glitch.global/f2e558c1-0728-4f7a-8020-854d50f81021";

export const playerModel = assetPath + "/submarine.gltf";

export const playerVisibilityOuterRadius = 60;
export const playerVisibilityInnerRadius = 30;

export const radarPingSound = assetPath + "/bleepfinal.wav";
export const radarPingSpeed = 150;
export const radarPingAcceleration = -30;
export const radarPingInnerThickness = 2;
export const radarPingOuterThickness = 10;
export const radarPingFadeStart = 0;
export const radarPingFadeEnd = 7;

export const radarMapTransitionSpeed = 0.75;
export const radarMapFadeInterval = 0.05;
export const radarMapFadeAmount = 0.1;
export const radarMapFadeSubtract = 0.3;
