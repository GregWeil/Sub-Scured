import {
  DoubleSide,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  WebGLRenderTarget,
  WebGLRenderer,
  Vector2,
  Vector3,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js";
import { Howl } from "howler";

import Game from "./game";
import { backgroundColor, radarPing } from "./assets";

export default class RadarRenderer {
  private game: Game;
  private timer: number;
  private pulseX: number;
  private pulseY: number;

  private overviewCamera: OrthographicCamera;
  private overviewTarget: WebGLRenderTarget;
  private overviewComposer: EffectComposer;

  private sceneComposer: EffectComposer;

  private sound: Howl;

  constructor(game: Game, renderer: WebGLRenderer) {
    this.game = game;
    this.timer = 10;
    this.pulseX = 0;
    this.pulseY = 0;

    const [x, y] = this.game.map.getWorldOrigin();
    this.overviewCamera = new OrthographicCamera(x, -x, y, -y, 0, 100);
    this.overviewCamera.position.z = 10;
    this.overviewCamera.updateProjectionMatrix();
    this.overviewTarget = new WebGLRenderTarget(512, 512);
    this.overviewComposer = new EffectComposer(renderer, this.overviewTarget);
    this.overviewComposer.addPass(
      new RenderPass(this.game.scene, this.overviewCamera)
    );

    this.sceneComposer = new EffectComposer(renderer);
    const renderPass = new TAARenderPass(
      this.game.scene,
      this.game.camera,
      backgroundColor,
      1
    );
    renderPass.sampleLevel = 2;
    this.sceneComposer.addPass(renderPass);

    this.sound = new Howl({ src: [radarPing] });
  }

  update(dt: number, playerPosition: Vector3) {
    this.timer += dt / 1000;
    if (this.timer >= 10) {
      this.sound.play();
      this.timer = this.timer % 10;
      this.pulseX = playerPosition.x;
      this.pulseY = playerPosition.y;
    }
  }

  resize(renderer: WebGLRenderer) {
    const size = renderer.getSize(new Vector2());
    this.sceneComposer.setSize(size.x, size.y);
    this.sceneComposer.setPixelRatio(renderer.getPixelRatio());
  }

  render(renderer: WebGLRenderer, dt: number) {
    //this.sceneComposer.render(dt / 1000);
    this.overviewComposer.render(dt / 1000);
  }

  destructor() {
    this.overviewComposer.dispose();
    this.sceneComposer.dispose();
  }
}
