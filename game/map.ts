import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from "three";

const triangleHeightFromSide = Math.sqrt(3)/2;

export default class Map {
  private width: number;
  private height: number;
  private size: number;
  private grid: UInt8Array;
  private geometry: BufferGeometry;
  private mesh: Mesh;

  constructor(scene: Scene, width: number, height: number, size: number) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.grid = new Int8Array(width * height);

    this.geometry = new BufferGeometry();
    const material = new MeshBasicMaterial({ color: 0x555555 });
    this.mesh = new Mesh(this.geometry, material);
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
    this.generateMesh();
  }

  private generateMesh() {
    const vertices = [];
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        if (this.grid[i * this.width + j] === 0) continue;
        
      }
    }
    this.geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
  }

private getVertices(x:number,y:number) {
  
}

  destructor() {
    this.mesh.removeFromParent();
  }
}
