import { Scene, Group, Vector2, Vector3 } from "three";
import { Howl } from "howler";

import Game from "./game";
import Debris from "./debris";
import { ModelLoader, mineModel, mineExplosionSound } from "./assets";
import { getLerpFactor } from "../util/math";

const ExplosionSound = new Howl({ src: [mineExplosionSound] });

export default class Mine {
  private game: Game;
  private mesh: Group;

  private velocity: Vector2;

  constructor(game: Game, position: Vector3) {
    this.game = game;
    this.mesh = new Group();
    this.game.scene.add(this.mesh);
    ModelLoader.load(mineModel, (gltf) => {
      const group = new Group();
      group.add(gltf.scene);
      this.mesh.add(group);
      group.position.set(0, 0, 0);
      group.scale.set(20, 20, 20);
      group.rotation.set(-Math.PI / 2, Math.PI, 0);
    });
    this.mesh.position.copy(position);
    this.velocity = new Vector3();
  }

  update(dt: number) {
    const playerPosition = this.game.player.getPosition();
    const prevPosition = this.mesh.position.clone();

    if (this.mesh.position.distanceTo(playerPosition) < 500) {
      this.velocity.add(
        playerPosition
          .clone()
          .sub(this.mesh.position)
          .normalize()
          .multiplyScalar((25 * dt) / 1000)
      );
      this.velocity.z = 0;
    }
    this.velocity.multiplyScalar(1 - getLerpFactor(0.3, dt / 1000));
    this.mesh.position.add(this.velocity.clone().multiplyScalar(dt / 1000));

    if (
      this.game.map.raycast(
        prevPosition.x,
        prevPosition.y,
        this.mesh.position.x,
        this.mesh.position.y
      )
    ) {
      this.explode();
    }

    const playerPositions = [
      this.game.player.mesh.localToWorld(new Vector3(0, 20, 0)),
      playerPosition,
      this.game.player.mesh.localToWorld(new Vector3(0, -20, 0)),
    ];
    for (const position of playerPositions) {
      if (this.mesh.position.distanceTo(position) < 20) {
        this.explode();
        this.game.end();
        break;
      }
    }
  }

  explode() {
    ExplosionSound.play();
    for (let i = 0; i < 64; ++i) {
      this.game.debris.push(
        new Debris(
          this.game.scene,
          this.game.map,
          new Vector3(Math.random() * 20, 0, 0)
            .applyAxisAngle(new Vector3(0, 0, 1), Math.random() * Math.PI * 2)
            .add(this.mesh.position)
        )
      );
    }
    this.destructor();
  }

  destructor() {
    this.mesh.removeFromParent();
    this.game.mines = this.game.mines.filter((mine) => mine !== this);
  }
}
