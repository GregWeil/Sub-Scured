import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Object3D,
  Vector3,
} from "three";

const triangleHeightFromSide = Math.sqrt(3) / 2;

export default class Map {
  private width: number;
  private height: number;
  private size: number;
  private grid: Int8Array;
  private mesh: Object3D;

  constructor(scene: Scene, width: number, height: number, size: number) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.grid = new Int8Array(width * height);
    this.mesh = new Object3D();
    scene.add(this.mesh);
    this.generateMap();
  }

  private generateMap() {
    this.grid.fill(1);
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        if (Math.random() < 0.3) this.grid[i * this.width + j] = 0;
      }
    }
    const t = performance.now();
    this.generateMesh();
    console.log(performance.now() - t);
  }

  private generateMesh() {
    this.mesh.clear();

    const vertices = [];
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        if (this.grid[i * this.width + j] === 0) continue;
        const [x1, y1, x2, y2, x3, y3] = this.getVertices(
          (-this.width / 2 + i + 0.5) * this.size,
          (-this.height / 2 + j + 0.5) * triangleHeightFromSide * this.size
        );
        vertices.push(x1, y1, 0, x2, y2, 0, x3, y3, 0);
      }
    }

    if (vertices.length > 0) {
      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new BufferAttribute(new Float32Array(vertices), 3)
      );
      const material = new MeshBasicMaterial({ color: 0x777777 });
      this.mesh.add(new Mesh(geometry, material));
    }
  }

  private getVertices(x: number, y: number) {
    return [
      x + this.size / 2,
      y + (triangleHeightFromSide * this.size) / 3,
      x,
      y - (triangleHeightFromSide * this.size * 2) / 3,
      x - this.size / 2,
      y + (triangleHeightFromSide * this.size) / 3,
    ];
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
