import { Scene, Group, Vector2, Vector3 } from "three";

import Game from "./game";

import { ModelLoader, mineModel } from "./assets";

export default class Mine {
  private game: Game;
  private mesh: Group;

  constructor(game: Game) {
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
    this.mesh.position.set(0, 100);
  }

  update(dt: number) {
    const playerPositions = [
      this.game.player.mesh.localToWorld(new Vector3(0, 20, 0)),
      this.game.player.getPosition(),
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
        this.game.playerDebris.push(new Debris(
          this.scene,
          this.map,
          front.clone().lerp(back, Math.random())
        ))
    this.destructor();
  }

  destructor() {
    this.mesh.removeFromParent();
    this.game.mines = this.game.mines.filter((mine) => mine !== this);
  }
}
