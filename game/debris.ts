import {
  Scene,
  Mesh,
  ConeGeometry,
  MeshStandardMaterial,
  Vector3,
} from "three";

import Game from "./game";
import { getLerpFactor } from "../util/math";

const Geometry = new ConeGeometry(5, 10, 3);

export default class Debris {
  private game: Game;
  private mesh: Mesh;
  private velocity: Vector3;
  private angularVelocity: Vector3;

  constructor(game: Game, position: Vector3) {
    this.game = game;
    this.mesh = new Mesh(Geometry, new MeshStandardMaterial({ metalness: 0 }));
    this.game.scene.add(this.mesh);
    this.mesh.position.copy(position);
    this.mesh.rotation.set(Math.random(), Math.random(), Math.random());
    this.velocity = new Vector3(0, 16 + Math.random() * 32, 0).applyAxisAngle(
      new Vector3(0, 0, 1),
      Math.random() * Math.PI * 2
    );
    this.angularVelocity = new Vector3(1, 1, 1).multiplyScalar(0.3);
  }

  update(dt: number) {
    this.mesh.position.add(this.velocity.clone().multiplyScalar(dt / 1000));
    this.mesh.rotateX((this.angularVelocity.x * dt) / 1000);
    this.mesh.rotateY((this.angularVelocity.y * dt) / 1000);
    this.mesh.rotateZ((this.angularVelocity.z * dt) / 1000);

    this.velocity.multiplyScalar(1 - getLerpFactor(0.5, dt / 1000));

    if (this.mesh.position.distanceTo(this.game.player.getPosition()) > 500) {
      this.destructor();
    }
  }

  destructor() {
    this.game.debris = this.game.debris.filter((debris) => debris !== this);
    this.mesh.removeFromParent();
  }
}
