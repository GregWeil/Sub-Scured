import {
  DodecahedronGeometry,
  Mesh,
  MeshNormalMaterial,
  Vector2,
  Vector3,
} from "three";
import { Howl } from "howler";

import Game from "./game";
import { treasureCollectSound } from "./assets";
import { getLerpFactor } from "../util/math";

const Geometry = new DodecahedronGeometry(20);
const CollectSound = new Howl({ src: [treasureCollectSound] });

export default class Treasure {
  private game: Game;
  private mesh: Group;

  constructor(game: Game, position: Vector3) {
    this.game = game;
    this.mesh = new Mesh(Geometry, new MeshNormalMaterial());
    this.game.scene.add(this.mesh);
    this.mesh.position.copy(position);
  }

  update(dt: number) {
    if (!this.game.gameover) {
      const playerPositions = [
        this.game.player.mesh.localToWorld(new Vector3(0, 20, 0)),
        this.game.player.getPosition(),
        this.game.player.mesh.localToWorld(new Vector3(0, -20, 0)),
      ];
      for (const position of playerPositions) {
        if (this.mesh.position.distanceTo(position) < 15) {
          this.collect();
          return;
        }
      }
    }
    this.mesh.rotateX(dt / 1000);
    this.mesh.rotateY(dt / 1000);
    this.mesh.rotateZ(dt / 1000);
    this.mesh.scale.setLength(
      Math.max(Math.sin(this.game.time * 2) / 3 + 1, 1)
    );
  }

  collect() {
    CollectSound.play();
    this.destructor();
  }

  destructor() {
    this.mesh.removeFromParent();
    this.game.treasure = this.game.treasure.filter(
      (treasure) => treasure !== this
    );
  }
}
