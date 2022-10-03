import {Scene,Group,Vector2}from 'three';

import Game from'./game';
import {ModelLoader, mineModel}from './assets'

export default class Mine{
  private game:Game;
  private mesh: Group;

constructor(game: Game){
  this.game=game;
  this.mesh = new Group();
  this.game.scene.add(this.mesh);
    ModelLoader.load(mineModel, (gltf) => {
      const group = new Group();
      group.add(gltf.scene);
      this.mesh.add(group);
      group.position.set(0, 0, 0);
      group.scale.set(10, 10, 10);
      group.rotation.set(-Math.PI / 2, Math.PI, 0);
    });
}
}