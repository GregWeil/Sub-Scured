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

  constructor(game: Game) {
    this.game = game;
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshNormalMaterial();
    this.mesh = new Mesh(geometry, material);
    this.game.scene.add(this.mesh);
  }

  impulse(input: Input){
    let impulseAcc = 0;
    const vertical = input.getVertical();
    if (impulseAcc < 50 && vertical) {
      impulseAcc += 5;
    }else if (impulseAcc >= 50 && vertical) {
      impulseAcc = 50;
    }else if (!vertical && impulseAcc > 0) {
      impulseAcc -= 0.5;
    }
    console.log(impulseAcc);
    return impulseAcc;
  }

  update(dt: number, input: Input) {
    const horizontal = input.getHorizontal();
    const turnAcc = 0;
    //this.mesh.position.x += (horizontal * 50 * dt) / 1000;
    const turn = this.mesh.rotateOnAxis(new Vector3(0, 0, 1).normalize(), (horizontal * dt) / 1000);
    const vertical = input.getVertical();

    //impulse();
    this.mesh.position.y += (vertical * 50 * dt) / 1000;
    //this.mesh.translateOnAxis(turn, (vertical * impulseAcc * dt) / 1000);

  }
  
  getPosition() {
    return this.mesh.position;
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
