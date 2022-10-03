import { Scene, Group, Vector2, Vector3 } from "three";

import Game from "./game";
import Debris from "./debris";
import { ModelLoader, mineModel } from "./assets";

export default class Mine {
  private game: Game;
  private mesh: Group;

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
  }

  update(dt: number) {
    const playerPosition = this.game.player.getPosition()
    
    //move towards player
    
    //check for wall collision
    
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
    for (let i = 0; i < 64; ++i) {
      this.game.playerDebris.push(
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
