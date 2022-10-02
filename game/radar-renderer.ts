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
private pulseX:number;
private pulseY:number;

  private scratchTarget: WebGLRenderTarget;

  private sound: Howl;

  constructor(game: Game) {
    this.game = game;
    this.timer = 10;
    this.pulseX=0;
    this.pulseY=0;
    
    this.scratchTarget = new WebGLRenderTarget(100,100);
    
    this.sound = new Howl({ src: [radarPing] });
  }

  update(dt: number, playerPosition: Vector3) {
    this.timer += dt / 1000;
    if (this.timer >= 10) {
      this.sound.play();
      this.timer =this.timer%10;
      this.pulseX=playerPosition.x;
      this.pulseY=playerPosition.y;
    }
  }

  render(renderer: WebGLRenderer) {
    this.scratchTarget.setSize(renderer.)
    
    renderer.setClearColor(backgroundColor);
    renderer.clear();
    renderer.render(this.game.scene, this.game.camera);
  }

destructor(){
  this.fullTarget.dispose();
}
}
