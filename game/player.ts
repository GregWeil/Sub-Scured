import { BoxGeometry, MeshNormalMaterial, Mesh, Vector3 } from "three";
import Game from './game';
import Input from "./input";

export default class Player {
  private game:Game;
  private mesh: Mesh;

  constructor(game: Game) {
    this.game=game;
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshNormalMaterial();
    this.mesh = new Mesh(geometry, material);
    this.game.scene.add(this.mesh);
  }

  update(dt: number, input: Input) {
    this.mesh.rotateOnAxis(new Vector3(0, 1, 1).normalize(), dt / 1000);
    const horizontal = input.getHorizontal();
    this.mesh.position.x += (horizontal * 50 * dt) / 1000;
    const vertical = input.getVertical();
    this.mesh.position.y += (vertical * 50 * dt) / 1000;
  }

  getPosition() {
    return this.mesh.position;
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
