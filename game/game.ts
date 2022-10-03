import {
  Color,
  OrthographicCamera,
  Scene,
  AmbientLight,
  DirectionalLight,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { Howl } from "howler";

import Input from "./input";
import Player from "./player";
import Mine from "./mine";
import Treasure from "./treasure";
import TriangleMap from "./triangle-map";
import GridOverlay from "./grid-overlay";
import RadarRenderer from "./radar-renderer";
import Debris from "./debris";
import { music, lightColor } from "./assets";

import { distance, lerp, getLerpFactor } from "../util/math";

const Music = new Howl({
  src: [music],
  loop: true,
});

export default class Game {
  scene: Scene;
  camera: OrthographicCamera;
  light: DirectionalLight;
  radar: RadarRenderer;
  map: TriangleMap;
  player: Player;
  debris: Debris[];
  mines: Mine[];
  treasure: Treasure[];
  overlay: GridOverlay;
  playingMusic: number;
  time: number;
  gameover: boolean;

  constructor(renderer: WebGLRenderer) {
    this.scene = new Scene();
    this.light = new DirectionalLight(lightColor, 1);
    this.scene.add(this.light);
    this.light.position.set(-0.1, -0.1, -1);
    this.camera = new OrthographicCamera(-1, 1, -1, 1, 0, 100);
    this.map = new TriangleMap(this.scene, 200, 400, 15);
    this.player = new Player(this);
    this.debris = [];
    this.mines = [];
    this.treasure = [];
    //this.overlay = new GridOverlay(this.scene, 1000, 1000, 15, 1);
    this.radar = new RadarRenderer(this, renderer);
    this.playingMusic = Music.play();
    this.time = 0;
    this.gameover = false;
  }

  update(dt: number, input: Input) {
    if (!this.gameover) {
      this.time += dt / 1000;
      this.player.update(dt, input);
    if (this.mines.length < Math.log(this.time) * 10) {
      this.spawnMine();
    }
    if (this.treasure.length < 1000) {
      this.spawnTreasure();
    }
    }
    this.treasure.forEach((treasure) => treasure.update(dt));
    this.mines.forEach((mine) => mine.update(dt));
    this.debris.forEach((debris) => debris.update(dt));
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

  private getSpawnPoint(minDistFromPlayer: number) {
    const { x: playerX, y: playerY } = this.player.getPosition();
    const [originX, originY] = this.map.getWorldOrigin();
    for (let i = 0; i < 1000; ++i) {
      const x = lerp(originX, -originX, Math.random());
      const y = lerp(originY, -originY, Math.random());
      if (distance(x, y, playerX, playerY) < minDistFromPlayer) continue;
      if (this.map.raycast(x - 1, y, x + 1, y)) continue;
      if (this.map.raycast(x, y - 1, x, y + 1)) continue;
      return [x, y];
    }
    return null;
  }

  spawnMine() {
    const position = this.getSpawnPoint(300);
    if (!position) return;
    this.mines.push(new Mine(this, new Vector3(...position, 0)));
  }

  spawnTreasure() {
    const position = this.getSpawnPoint(500);
    if (!position) return;
    this.treasure.push(new Treasure(this, new Vector3(...position, 0)));
  }

  end() {
    if (this.gameover) return;
    this.gameover = true;
    this.light.color = new Color(0xff0000);
    this.player.die();
  }

  destructor() {
    Music.stop(this.music);
  }
}
