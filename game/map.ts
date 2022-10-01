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
        if (Math.random() < 0.4) this.grid[i * this.width + j] = 0;
      }
    }
    this.generateMesh();
  }

  private generateMesh() {
    this.mesh.clear();

    const vertices = [];
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        if (this.grid[i * this.width + j] === 0) continue;
        vertices.push(...this.getVertices(i,j))
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
    const xc = -this.width / 2 + x + 0.5;
    const yc = (-this.height / 2 + y + 0.5) * triangleHeightFromSide;

    const x1 = (xc + 0.5) * this.size;
    const y1 = (yc + triangleHeightFromSide / 3) * this.size;
    const x2 = xc;
    const y2 = (yc - (2 / 3) * triangleHeightFromSide) * this.size;
    const x3 = (xc - 0.5) * this.size;
    const y3 = (yc + triangleHeightFromSide / 3) * this.size;
    
    if (y%2==0){
      return [x1,y1,x2,y2,x3,y3];
    } else {
      return [x3,y3,x2,t2,x1,y1];
    }
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
