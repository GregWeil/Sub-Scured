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
import Mine from './mine'
import TriangleMap from "./triangle-map";
import GridOverlay from "./grid-overlay";
import RadarRenderer from "./radar-renderer";
import Debris from "./debris";
import { music, lightColor } from "./assets";

import { getLerpFactor } from "../util/math";

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
  playerDebris: Debris[];
  mines: Mine[];
  overlay: GridOverlay;
  playingMusic: number;
  gameover: boolean;

  constructor(renderer: WebGLRenderer) {
    this.scene = new Scene();
    this.light = new DirectionalLight(lightColor, 1);
    this.scene.add(this.light);
    this.light.position.set(-0.1, -0.1, -1);
    this.camera = new OrthographicCamera(-1, 1, -1, 1, 0, 100);
    this.map = new TriangleMap(this.scene, 200, 400, 15);
    this.player = new Player(this);
    this.playerDebris = [];
    this.mines = [new Mine(this)];
    //this.overlay = new GridOverlay(this.scene, 1000, 1000, 15, 1);
    this.radar = new RadarRenderer(this, renderer);
    this.playingMusic = Music.play();
    this.gameover = false;
  }

  update(dt: number, input: Input) {
    if (!this.gameover) this.player.update(dt, input);
    this.playerDebris.forEach((debris) => debris.update(dt));
    this.mines.forEach((mine) => mine.update(dt));
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

  end() {
    this.gameover = true;
    this.light.color = new Color(0xff0000);
    const front = this.player.mesh.localToWorld(new Vector3(0, 20, 0));
    const back = this.player.mesh.localToWorld(new Vector3(0, -20, 0));
    for (let i = 0; i < 16; ++i) {
      this.playerDebris.push(
        new Debris(
          this.scene,
          this.map,
          front.clone().lerp(back, Math.random())
        )
      );
    }
    this.player.mesh.visible = false;
  }

  destructor() {
    Music.stop(this.music);
  }
}
