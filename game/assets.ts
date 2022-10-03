import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export const ModelLoader = new GLTFLoader();

export const overlayColor = 0x115630;
export const terrainColor = 0x04fb06;
export const lightColor = 0x55ff55;

const assetPath =
  "https://cdn.glitch.global/f2e558c1-0728-4f7a-8020-854d50f81021";

export const music = assetPath + '/Level3.mp3'

export const playerModel = assetPath + "/submarine.gltf";
export const playerDeathSound = assetPath+"/awooga.wav";

export const playerVisibilityOuterRadius = 80;
export const playerVisibilityInnerRadius = 30;

export const radarPingSound = assetPath + "/bleepfinal.wav";
export const radarPingSpeed = 150;
export const radarPingAcceleration = -15;
export const radarPingInnerThickness = 2;
export const radarPingOuterThickness = 20;
export const radarPingFadeStart = 0;
export const radarPingFadeEnd = 9;

export const radarMapTransitionSpeed = 0.75;
export const radarMapFadeInterval = 0.05;
export const radarMapFadeAmount = 0.1;
export const radarMapFadeSubtract = 0.3;

export const mineModel = assetPath + "/mine.gltf"
export const mineExplosionSound = assetPath+"/mine.wav";
