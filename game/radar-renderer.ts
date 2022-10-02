import {
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

  private sound: Howl;

  constructor(game: Game) {
    this.game = game;
    this.timer = 10;
    this.pulseX = 0;
    this.pulseY = 0;

    this.scratchTarget = new WebGLRenderTarget(100, 100);

    this.renderScene = new Scene();
    this.renderPlane = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshBasicMaterial({ color: 0xffffff })
    );
    this.renderScene.add(this.renderPlane);
    this.renderCamera = new OrthographicCamera(-1, 1, -1, 1, 1, 10);
    this.renderCamera.position.z = 5;

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
    this.renderPlane.rotateOnAxis(new Vector3(0, 1, 1).normalize(), dt / 1000);
  }

  render(renderer: WebGLRenderer) {
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
  }

  destructor() {
    this.scratchTarget.dispose();
    this.renderPlane.geometry.dispose();
  }
}
