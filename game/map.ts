import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from "three";

const triangleHeightFromSide = Math.sqrt(3) / 2;

export default class Map {
  private width: number;
  private height: number;
  private size: number;
  private grid: UInt8Array;
  private mesh: Mesh|null;

  constructor(scene: Scene, width: number, height: number, size: number) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.grid = new Int8Array(width * height);
    this.generateMap();
  }

  private generateMap() {
    this.grid.fill(1);
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        if (Math.random() < 0.3) this.grid[i * this.width + j] = 0;
      }
    }
    this.generateMesh();
  }

  private generateMesh() {
    this.mesh?.removeFromParent();
    const vertices = [];
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        if (this.grid[i * this.width + j] === 0) continue;
        const [x1, y1, x2, y2, x3, y3] = this.getVertices(
          (-this.width / 2 + i) * this.side,
          (-this.height / 2 + j) * triangleHeightFromSide * this.side
        );
        vertices.push(x1, y1, 0, x2, y2, 0, x3, y3, 0);
      }
    }
    this.geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
  }

  private getVertices(x: number, y: number) {
    return [
      x + this.length / 2,
      y + (triangleHeightFromSide * this.length) / 3,
      x,
      y - (triangleHeightFromSide * this.length * 2) / 3,
      x - this.length / 2,
      y + (triangleHeightFromSide * this.length) / 3,
    ];
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
