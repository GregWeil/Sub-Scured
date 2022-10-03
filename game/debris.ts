import{Scene,Mesh,ConeGeometry,MeshStandardMaterial,Vector3}from'three';

import TriangleMap from './triangle-map'

export default class Debris {
  private map: TriangleMap;
private mesh:Mesh;
private velocity: Vector3;
private angularVelocity: Vector3;

constructor(scene:Scene,map:TriangleMap,position:Vector3){
  this.map=map;
  this.mesh = new Mesh(new ConeGeometry(5,10,3),new MeshStandardMaterial())
  scene.add(this.mesh);
  this.mesh.position.copy(position);
  this.mesh.rotation.set(Math.random(),Math.random(),Math.random());
  this.velocity=  new Vector3(0,4+Math.random()*4,0).applyAxisAngle(new Vector3(0,0,1),Math.random()*Math.PI*2);
  this.angularVelocity = new Vector3(1,1,1).multiplyScalar(0.1)
}

update(dt:number){
  this.mesh.position.add(this.velocity.clone().multiplyScalar(dt/1000));
  this.mesh.rotateX(this.angularVelocity.x*dt/1000)
  this.mesh.rotateY(this.angularVelocity.y*dt/1000)
  this.mesh.rotateZ(this.angularVelocity.z*dt/1000)
  
  this.velocity.lerp
}
}