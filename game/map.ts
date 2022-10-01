import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from "three";

export default class Map {
private width: number;
private height: number;
private size: number;
private grid: Int8Array;
  private mesh:Mesh;

constructor(width:number,height:number,size:number){
  this.width=width;
  this.height=height;
  this.size=size;
  this.grid = new Int8Array(width * height);
}
}