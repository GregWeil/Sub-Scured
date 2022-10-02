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
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Howl } from "howler";

import Game from "./game";
import { backgroundColor, radarPing } from "./assets";

export default class RadarRenderer {
  private game: Game;
  private timer: number;
  private pulseX: number;
  private pulseY: number;

  private scratchTarget: WebGLRenderTarget;

  private renderScene: Scene;
  private renderPlane: Mesh;
  private renderCamera: OrthographicCamera;

  private sceneComposer: EffectComposer;

  private sound: Howl;

  constructor(game: Game, renderer: WebGLRenderer) {
    this.game = game;
    this.timer = 10;
    this.pulseX = 0;
    this.pulseY = 0;

    this.scratchTarget = new WebGLRenderTarget(100, 100);

    this.renderScene = new Scene();
    this.renderPlane = new Mesh(
      new PlaneGeometry(2, 2),
      new MeshBasicMaterial({ map: this.scratchTarget.texture })
    );
    this.renderPlane.rotation.y = Math.PI;
    this.renderPlane.rotation.z = Math.PI;
    this.renderScene.add(this.renderPlane);
    this.renderCamera = new OrthographicCamera(-1, 1, -1, 1, 1, 10);
    this.renderCamera.position.z = 5;
    this.sceneComposer = new EffectComposer(renderer);
    this.sceneComposer.addPass(
      new TAARenderPass(this.game.scene, this.game.camera, backgroundColor, 1)
    );

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

  render(renderer: WebGLRenderer, dt: number) {
    /*
    const resolution = renderer.getDrawingBufferSize(new Vector2());
    if (
      this.scratchTarget.width !== resolution.x ||
      this.scratchTarget.height !== resolution.y
    ) {
      this.scratchTarget.setSize(resolution.x, resolution.y);
    }
    renderer.setRenderTarget(this.scratchTarget);
    renderer.setClearColor(backgroundColor);
    renderer.clear();
    renderer.render(this.game.scene, this.game.camera);

    renderer.setRenderTarget(null);
    renderer.setClearColor(0x000000);
    renderer.clear();
    renderer.render(this.renderScene, this.renderCamera);
    */
    const size = renderer.getSize(new Vector2());
    if (
      this.sceneComposer.width !== size.x ||
      this.sceneComposer.height !== size.y
    ) {
      this.scratchTarget.setSize(size);
    }
    const pixelRatio = renderer.getPixelRatio();
    if (pixelRatio !== this.sceneComposer.pixelRatio) {
      this.sceneComposer.setPixelRatio(pixelRatio);
    }
    this.sceneComposer.render(dt / 1000);
  }

  destructor() {
    this.scratchTarget.dispose();
    this.renderPlane.geometry.dispose();
  }
}
