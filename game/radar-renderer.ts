import { WebGLRenderer, Vector3 } from "three";

import Game from "./game";
import { backgroundColor } from "./constants";

export default class RadarRenderer {
  private game: Game;
  private timer: number;

  constructor(game: Game) {
    this.game = game;
    this.timer = 0;
  }

  update(dt: number, playerPosition: Vector3) {
    this.timer += dt / 1000;
    if(this.timer>=1){
      console.log('ping')
      this.timer-=1;
    }
  }

  render(renderer: WebGLRenderer) {
    renderer.clear(backgroundColor);
    renderer.render(this.game.scene, this.game.camera);
  }
}
