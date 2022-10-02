import { OrthographicCamera, Scene, DirectionalLight, Vector2, WebGLRenderer } from "three";
import Player from "./player";
import TriangleMap from "./triangle-map";
import GridOverlay from "./grid-overlay";
import Input from "./input";
import RadarRenderer from "./radar-renderer";
import { getLerpFactor } from "../util/math";

export default class Game {
  scene: Scene;
  camera: OrthographicCamera;
  radar: RadarRenderer;
  map: TriangleMap;
  player: Player;
  overlay: GridOverlay;

  constructor(renderer: WebGLRenderer) {
    this.scene = new Scene();
    const light = new DirectionalLight(0xffffff, 0.5);
    this.scene.add(light);
    light.position.set(1, 1, -0.5);
    this.camera = new OrthographicCamera(-1, 1, -1, 1, 0, 100);
    this.map = new TriangleMap(this.scene, 200, 400, 15);
    this.player = new Player(this);
    //this.overlay = new GridOverlay(this.scene, 1000, 1000, 15, 1);
    this.radar = new RadarRenderer(this, renderer);
  }

  update(dt: number, input: Input) {
    this.player.update(dt, input);
    this.camera.position.lerp(
      this.player.getPosition(),
      getLerpFactor(0.9, dt / 1000)
    );
    this.camera.position.z = 10;
    //this.overlay.update(this.camera.position);
    this.radar.update(dt, this.player.getPosition());
  }

  resize(renderer: WebGLRenderer) {
    this.radar.resize(renderer);
  }

  render(renderer: WebGLRenderer, dt: number) {
    const size = renderer.getSize(new Vector2()).divideScalar(2);
    const scale = Math.max(250 / size.x, 200 / size.y);
    this.camera.left = -scale * size.x;
    this.camera.right = scale * size.x;
    this.camera.top = -scale * size.y;
    this.camera.bottom = scale * size.y;
    this.camera.updateProjectionMatrix();
    this.radar.render(renderer, dt);
  }
}
