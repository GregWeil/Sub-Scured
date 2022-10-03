import { Group, Vector3 } from "three";

import Game from "./game";
import Input from "./input";
import { ModelLoader, playerModel ,playerDeathSound} from "./assets";

const DeathSound = new Howl({
  src:[]
})

export default class Player {
  private game: Game;
  private mesh: Group;
  private impulseAcc: number;
  private turnAcc: number;

  constructor(game: Game) {
    this.game = game;
    this.mesh = new Group();
    ModelLoader.load(playerModel, (gltf) => {
      const group = new Group();
      group.add(gltf.scene);
      this.mesh.add(group);
      group.position.set(0, 0, 0);
      group.scale.set(5, 5, 5);
      group.rotation.set(-Math.PI / 2, Math.PI, 0);
    });
    this.game.scene.add(this.mesh);
    this.impulseAcc = 0;
    this.turnAcc = 0;
  }

  update(dt: number, input: Input) {
    const prevPosition = this.mesh.localToWorld(new Vector3(0, 0, 0));

    const horizontal = input.getHorizontal();
    //this.mesh.position.x += (horizontal * 50 * dt) / 1000;
    let direction = this.turn(input);
    this.mesh.rotateOnAxis(
      new Vector3(0, 0, 1).normalize(),
      (direction * dt) / 1000
    );
    const vertical = input.getVertical();

    let acc = this.impulse(input);
    //this.mesh.position.y += (acc * dt) / 1000;
    this.mesh.translateOnAxis(
      new Vector3(0, 1, 0).normalize(),
      (acc * dt) / 1000
    );

    const currentPosition = this.mesh.localToWorld(new Vector3(0, 16, 0));
    const hit = this.game.map.raycast(
      prevPosition.x,
      prevPosition.y,
      currentPosition.x,
      currentPosition.y
    );
    if (hit) this.game.end();
  }

  impulse(input: Input) {
    const go = input.getVertical();
    if (this.impulseAcc < 80 && go) {
      this.impulseAcc += 0.5;
    } else if (this.impulseAcc >= 80 && go) {
      this.impulseAcc = 80;
    } else if (!go && this.impulseAcc > 0) {
      this.impulseAcc -= 0.2;
    }
    //console.log(this.impulseAcc);
    return this.impulseAcc;
  }

  turn(input: Input) {
    const go = input.getHorizontal();
    this.turnAcc += go * 0.1;
    if (this.turnAcc > 1) this.turnAcc = 1;
    if (this.turnAcc < -1) this.turnAcc = -1;
    if (Math.abs(go) < 0.5) {
      if (this.turnAcc > 0) this.turnAcc -= 0.06;
      if (this.turnAcc < 0) this.turnAcc += 0.06;
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
