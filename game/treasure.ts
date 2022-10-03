import {  Mesh, DodecahedronGeometry,Vector2, Vector3 } from "three";
import { Howl } from "howler";

import Game from "./game";
import { treasureCollectSound } from "./assets";
import { getLerpFactor } from "../util/math";

const Geometry = new DodecahedronGeometry(10);
const CollectSound = new Howl({ src: [treasureCollectSound] });

export default class Treasure {
  private game: Game;
  private mesh: Group;

  constructor(game: Game, position: Vector3) {
    this.game = game;
    this.mesh = new Mesh(Geometry,new MeshStandardMaterial());
    this.mesh.position.copy(position);
  }

  update(dt: number) {
    const playerPositions = [
      this.game.player.mesh.localToWorld(new Vector3(0, 20, 0)),
      playerPosition,
      this.game.player.mesh.localToWorld(new Vector3(0, -20, 0)),
    ];
    for (const position of playerPositions) {
      if (this.mesh.position.distanceTo(position) < 5) {
        this.collect()
        return;
      }
    }
  }

  collect() {
    CollectSound.play();
    this.destructor();
  }

  destructor() {
    this.mesh.removeFromParent();
    this.game.treasure = this.game.treasure.filter((treasure) => treasure !== this);
  }
}
