import {OrthographicCamera,Scene}from 'three';
import Player from './player';

export default class Game {
  constructor() {
    this.scene = new Scene();
    this.camera = new OrthographicCamera(-1,1,-1,1,1,100);
    this.camera.position.z = 1;
    this.player = new Player(this.scene);
  }
  
  update(dt) {
    
  }
  
  render() {
    
  }
}