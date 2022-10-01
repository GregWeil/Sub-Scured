import {BufferGeometry,BufferAttribute,LineSegments,Scene,Vector3}from 'three';

export default class Grid {
  private mesh: LineSegments
  
  constructor(scene:Scene, width:number,height:number,spacing:number){
    const geometry = new BufferGeometry();
    geometry.setAttribute("position",new BufferAttribute(3, ))
    const vertices = [];
    for (let x = -width/2;x<=width/2;x+=spacing){
      vertices.push(x,-height,0);
      vertices.push(x,height,0);
    }
    for (let y = -height/2;y<=height/2;y+=spacing){
      vertices.push(-width,y,0);
      vertices.push(width,y,0);
    }
  }
}