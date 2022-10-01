import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Group,
  Vector3,
} from "three";

import Iput from './input';
import { terrainColor } from "./constants";

const triangleHeightFromSide = Math.sqrt(3) / 2;

export default class Map {
  private width: number;
  private height: number;
  private size: number;
  private grid: Int8Array;
  private group: Group;

  constructor(scene: Scene, width: number, height: number, size: number) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.grid = new Int8Array(width * height);
    this.group = new Group();
    scene.add(this.group);
    this.generateMap();
  }

  private generateMap() {
    this.grid.fill(1);
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        if (Math.random() < 0.4) this.grid[i * this.width + j] = 0;
      }
    }
    this.generateMesh();
  }

  private generateMesh() {
    const vertices = [];
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        if (this.grid[i * this.width + j] === 0) continue;
        const [x1, y1, x2, y2, x3, y3] = this.getVertices(i, j);
        vertices.push(x1, y1, 0, x2, y2, 0, x3, y3, 0);
      }
    }

    this.group.clear();
    if (vertices.length > 0) {
      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new BufferAttribute(new Float32Array(vertices), 3)
      );
      const material = new MeshBasicMaterial({ color: terrainColor });
      const mesh = new Mesh(geometry, material);
      mesh.position.x = (-this.width / 2 + 0.5) * this.size;
      mesh.position.y = (-this.height / 4 + 0.25) * this.size;
      mesh.scale.x = this.size;
      mesh.scale.y = this.size;
      this.group.add(mesh);
    }
  }

  private toTriangleSpace(x: number, y: number) {
    const xc = x + ((y + 2) % 4 < 2 ? 0.5 : 0);
    const yc =
      Math.ceil(y / 2) * triangleHeightFromSide +
      (y % 2 == 0 ? 1 / 6 : -1 / 6) * triangleHeightFromSide;
    return [xc, yc];
  }

private fromTriangleSpace(x:number,y:number){
}

  private getVertices(x: number, y: number) {
    const [xc, yc] = this.toTriangleSpace(x, y);

    const x1 = 0.5;
    const y1 = triangleHeightFromSide / 3;
    const x2 = 0;
    const y2 = -(2 / 3) * triangleHeightFromSide;
    const x3 = -0.5;
    const y3 = triangleHeightFromSide / 3;

    if (y % 2 == 0) {
      return [xc + x1, yc + y1, xc + x2, yc + y2, xc + x3, yc + y3];
    } else {
      return [xc + x3, yc - y3, xc + x2, yc - y2, xc + x1, yc - y1];
    }
  }

update(dt:number){
  
}

  destructor() {
    this.group.removeFromParent();
  }
}
