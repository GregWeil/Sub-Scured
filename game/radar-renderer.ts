import {
  OrthographicCamera,
  WebGLRenderTarget,
  WebGLRenderer,
  Vector3,
} from "three";
import { Howl } from "howler";

import Game from "./game";
import { backgroundColor, radarPing } from "./assets";

export default class RadarRenderer {
  private game: Game;
  private timer: number;

  private fullTarget: WebGLRenderTarget;
  private fullCamera: OrthographicCamera;

  private sound: Howl;

  constructor(game: Game) {
    this.game = game;
    this.sound = new Howl({ src: [radarPing] });
    this.timer = 0;
  }

  update(dt: number, playerPosition: Vector3) {
    this.timer += dt / 1000;
    if (this.timer >= 10) {
      this.sound.play();
      this.timer -= 10;
    }
  }

  render(renderer: WebGLRenderer) {
    renderer.setClearColor(0xffffff);
    //renderer.clear();
    renderer.render(this.game.scene, this.game.camera);
  }
}
