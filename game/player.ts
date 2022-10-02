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

  constructor(game: Game) {
    this.game = game;
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshNormalMaterial();
    this.mesh = new Mesh(geometry, material);
    this.game.scene.add(this.mesh);
    this.impulseAcc=0;
  }


  update(dt: number, input: Input) {
    const horizontal = input.getHorizontal();
    const turnAcc = 0;
    //this.mesh.position.x += (horizontal * 50 * dt) / 1000;
    const turn = this.mesh.rotateOnAxis(new Vector3(0, 0, 1).normalize(), (horizontal * dt) / 1000);
    const vertical = input.getVertical();

    this.impulse(input);
    this.mesh.position.y += (vertical * 50 * dt) / 1000;
    //this.mesh.translateOnAxis(turn, (vertical * impulseAcc * dt) / 1000);

  }

  impulse(input: Input){
    const go = input.getVertical();
    if (this.impulseAcc < 50 && go) {
      this.impulseAcc += 5;
    }else if (this.impulseAcc >= 50 && go) {
      this.impulseAcc = 50;
    }else if (!go && impulseAcc > 0) {
      impulseAcc -= 0.5;
    }
    console.log(impulseAcc);
    return impulseAcc;
  }
  
  getPosition() {
    return this.mesh.position;
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
