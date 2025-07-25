import { Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { Howl } from "howler";

import Game from "./game";
import Debris from "./debris";
import { GLTF, ModelLoader, mineModel, mineExplosionSound } from "./assets";
import { getLerpFactor } from "../util/math";

const MineModel = new Promise<GLTF>((resolve, reject) =>
  ModelLoader.load(
    mineModel,
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type !== "Mesh") return;
        const mesh = child as Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of materials) {
          if (material.type !== "MeshStandardMaterial") continue;
          (material as MeshStandardMaterial).metalness = 0.6;
        }
      });
      resolve(gltf);
    },
    undefined,
    reject
  )
);
const ExplosionSound = new Howl({ src: [mineExplosionSound] });

export default class Mine {
  private game: Game;
  private mesh: Group;
  private velocity: Vector3;
  private alerted: boolean;

  constructor(game: Game, position: Vector3) {
    this.game = game;
    this.mesh = new Group();
    this.game.scene.add(this.mesh);
    MineModel.then((gltf) => {
      const group = gltf.scene.clone(true);
      this.mesh.add(group);
      group.position.set(0, 0, 0);
      group.scale.set(20, 20, 20);
      group.rotation.set(-Math.PI / 2, Math.PI, 0);
    });
    this.mesh.position.copy(position);
    this.mesh.rotation.z = Math.random() * Math.PI;
    this.velocity = new Vector3();
    this.alerted = false;
  }

  update(dt: number) {
    const playerPosition = this.game.player.getPosition();
    const prevPosition = this.mesh.position.clone();

    if (this.alerted && !this.game.gameover) {
      this.velocity.add(
        playerPosition
          .clone()
          .sub(this.mesh.position)
          .normalize()
          .multiplyScalar((25 * dt) / 1000)
      );
      this.velocity.z = 0;
    } else if (this.mesh.position.distanceTo(playerPosition) < 150) {
      this.alerted = true;
    }

    this.velocity.multiplyScalar(1 - getLerpFactor(0.3, dt / 1000));
    this.mesh.position.add(this.velocity.clone().multiplyScalar(dt / 1000));
    if (this.velocity.x !== 0) {
      this.mesh.rotation.z +=
        0.1 *
        Math.sign(this.velocity.x) *
        Math.log(Math.abs(this.velocity.x)) *
        (dt / 1000);
    }

    if (
      this.game.map.raycast(
        prevPosition.x,
        prevPosition.y,
        this.mesh.position.x,
        this.mesh.position.y
      )
    ) {
      this.explode();
      return;
    }

    let shouldExplode = false;
    for (const mine of this.game.mines.slice(
      this.game.mines.indexOf(this) + 1
    )) {
      if (this.mesh.position.distanceTo(mine.mesh.position) < 40) {
        shouldExplode = true;
        mine.explode();
      }
    }
    if (shouldExplode) {
      this.explode();
      return;
    }

    const playerPositions = [
      this.game.player.localToWorld(new Vector3(0, 20, 0)),
      playerPosition,
      this.game.player.localToWorld(new Vector3(0, -20, 0)),
    ];
    for (const position of playerPositions) {
      if (this.mesh.position.distanceTo(position) < 20) {
        this.explode();
        this.game.end();
        return;
      }
    }
  }

  explode() {
    ExplosionSound.play();
    for (let i = 0; i < 64; ++i) {
      this.game.debris.push(
        new Debris(
          this.game,
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
