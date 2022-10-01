import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Group,
  Vector3,
} from "three";

import { terrainColor } from "./constants";

const triangleHeightFromSide = Math.sqrt(3) / 2;

export default class Map {
  private width: number;
  private height: number;
  private size: number;
  private grid: Int8Array;
  private mesh: Group;

  constructor(scene: Scene, width: number, height: number, size: number) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.grid = new Int8Array(width * height);
    this.mesh = new Group();
    scene.add(this.mesh);
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
        vertices.push(...this.getVertices(i, j));
      }
    }

    this.mesh.clear();
    if (vertices.length > 0) {
      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new BufferAttribute(new Float32Array(vertices), 2)
      );
      const material = new MeshBasicMaterial({ color: terrainColor });
      const model = new Mesh(geometry, material);
      model.position.x = (-this.width / 2 + 0.5) * this.size;
      model.position.y = (-this.height / 2 + 0.5) * this.size;
      model.scale.x = this.size;
      model.scale.y = this.size;
      this.mesh.add(model);
    }
  }

  private getVertices(x: number, y: number) {
    const xc = x + ((y + 2) % 4 < 2 ? 0.5 : 0);
    const yc =
      Math.ceil(y / 2) * triangleHeightFromSide +
      (y % 2 == 0 ? 1 / 6 : -1 / 6) * triangleHeightFromSide;

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

  destructor() {
    this.mesh.removeFromParent();
  }
}
