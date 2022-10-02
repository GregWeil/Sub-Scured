import {
  BoxGeometry,
  SphereGeometry,
  MeshNormalMaterial,
  Mesh,
  Group,
  Vector3,
} from "three";
import Game from "./game";
import Input from "./input";

export default class Player {
  private game: Game;
  private mesh: Mesh;
private impulseAcc:number;
private turnAcc: number;

  constructor(game: Game) {
    this.game = game;
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshNormalMaterial();
    this.mesh = new Mesh(geometry, material);
    this.game.scene.add(this.mesh);
    this.impulseAcc=0;
    this.turnAcc=0;
  }


  update(dt: number, input: Input) {
    const horizontal = input.getHorizontal();
    //this.mesh.position.x += (horizontal * 50 * dt) / 1000;
    let direction = this.turn(input);
    this.mesh.rotateOnAxis(new Vector3(0, 0, 1).normalize(), (direction * dt) / 1000);
    const vertical = input.getVertical();

    let acc = this.impulse(input);
    //this.mesh.position.y += (acc * dt) / 1000;
    this.mesh.translateOnAxis(new Vector3(0, 1, 0).normalize(), (acc * dt) / 1000);

  }

  impulse(input: Input){
    const go = input.getVertical();
    if (this.impulseAcc < 50 && go) {
      this.impulseAcc += 1;
    }else if (this.impulseAcc >= 50 && go) {
      this.impulseAcc = 50;
    }else if (!go && this.impulseAcc > 0) {
      this.impulseAcc -= 0.5;
    }
    //console.log(this.impulseAcc);
    return this.impulseAcc;
  }
  
  turn(input: Input){
    const go = input.getHorizontal();
    this.turnAcc += go*0.1;
    if(this.turnAcc>5)this.turnAcc=5;
    if(this.turnAcc<-5)this.turnAcc=-5;
    if(Math.abs(go)<0.5){
      if (this.turnAcc>0)this.turnAcc -= 0.1; 
      if (this.turnAcc<0)this.turnAcc += 0.1;
    }
    return this.turnAcc;
  }

  getPosition() {
    return this.mesh.position;
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
