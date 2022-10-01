import { OrthographicCamera, Scene, Vector2, WebGLRenderer } from "three";
import Player from "./player";
import GridOverlay from "./grid-overlay";
import Input from "./input";
import { getLerpFactor } from "../util/math";

export default class Game {
  scene: Scene;
  camera: OrthographicCamera;
  player: Player;
  grid: Grid;

  constructor() {
    this.scene = new Scene();
    this.camera = new OrthographicCamera(-1, 1, -1, 1, 1, 100);
    this.camera.position.z = 1;
    this.player = new Player(this.scene);
    this.grid = new Grid(this.scene, 1000, 1000, 15, 1);
  }

  update(dt: number, input: Input) {
    this.player.update(dt, input);
    this.camera.position.lerp(
      this.player.getPosition(),
      getLerpFactor(0.9, dt / 1000)
    );
    this.camera.position.z = 1;
    this.grid.update(this.camera.position);
  }

  render(renderer: WebGLRenderer) {
    const size = renderer.getSize(new Vector2()).divideScalar(2);
    const scale = Math.max(150 / size.x, 100 / size.y);
    this.camera.left = -scale * size.x;
    this.camera.right = scale * size.x;
    this.camera.top = -scale * size.y;
    this.camera.bottom = scale * size.y;
    this.camera.updateProjectionMatrix();
    renderer.render(this.scene, this.camera);
  }
}
