import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Scene,
  Group,
  Vector3,
} from "three";

import Iput from "./input";
import { terrainColor } from "./constants";
import { lerp, unlerp } from "../util/math";

const triangleHeightFromSide = Math.sqrt(3) / 2;

export default class Map {
  private width: number;
  private height: number;
  private size: number;
  private grid: Int8Array;
  private group: Group;
  private picker: Mesh;

  constructor(scene: Scene, width: number, height: number, size: number) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.grid = new Int8Array(width * height);
    this.group = new Group();
    [this.group.position.x, this.group.position.y] = this.getWorldOrigin();
    this.group.scale.x = this.size;
    this.group.scale.y = this.size;
    scene.add(this.group);
    this.generateMap();
    this.picker = new Mesh(
      new SphereGeometry(3),
      new MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add(this.picker);
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
      this.group.add(mesh);
    }
  }

  private cellToTriangle(x: number, y: number) {
    const xc = x + ((y + 2) % 4 < 2 ? 0.5 : 0);
    const yc =
      Math.ceil(y / 2) * triangleHeightFromSide +
      (y % 2 == 0 ? 1 / 6 : -1 / 6) * triangleHeightFromSide;
    return [xc, yc];
  }

  private triangleToCell(x: number, y: number) {
    const j = y / triangleHeightFromSide + 0.5;
    const jf = j % 2 < 1 ? j - Math.floor(j) : Math.ceil(j) - j;
    const xo = x - lerp(0, -0.5, jf);
    //j%2<2?xo>jf:xo<jf
    return [Math.floor(xo), Math.floor(j) * 2 + (xo < jf ? 1 : 0)];
  }

  private worldToTriangle(x: number, y: number) {
    const [xo, yo] = this.getWorldOrigin();
    return [(x - xo) / this.size, (y - yo) / this.size];
  }

  private triangleToWorld(x: number, y: number) {
    const [xo, yo] = this.getWorldOrigin();
    return [xo + x * this.size, yo + y * this.size];
  }

  private getWorldOrigin() {
    return [
      (-this.width / 2 + 0.5) * this.size,
      (-this.height / 4 + 0.5) * this.size,
    ];
  }

  private getVertices(x: number, y: number) {
    const [xc, yc] = this.cellToTriangle(x, y);

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

  update(dt: number, input: Input) {
    const cellPos = this.triangleToCell(
      ...this.worldToTriangle(...input.getMouse())
    );
    const [x, y] = this.triangleToWorld(...this.cellToTriangle(...cellPos));
    this.picker.position.x = x;
    this.picker.position.y = y;
    this.picker.position.z = 1;
  }

  destructor() {
    this.group.removeFromParent();
  }
}
