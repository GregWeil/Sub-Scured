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
import { lerp, unlerp, distance } from "../util/math";
import { raycast } from "../util/collide";

const triangleHeightFromSide = Math.sqrt(3) / 2;

export default class TriangleMap {
  private width: number;
  private height: number;
  private size: number;
  private grid: Uint8Array;
  private group: Group;
  private picker: Mesh;

  constructor(scene: Scene, width: number, height: number, size: number) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.grid = new Uint8Array(this.width * this.height);
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
    //scene.add(this.picker);
  }

  private generateMap() {
    this.grid.fill(1);
    for (let i = 1; i < this.width - 1; ++i) {
      for (let j = 1; j < this.height - 1; ++j) {
        if (Math.random() < 0.7) this.grid[i * this.height + j] = 0;
      }
    }
    this.generateMesh();
  }

  private generateMesh() {
    const vertices = [];
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        if (this.grid[i * this.height + j] === 0) continue;
        const [x1, y1, x2, y2, x3, y3] = this.getTriangleVertices(i, j);
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
    const jo = j % 2 < 1 ? xo - Math.floor(xo) > jf : xo - Math.floor(xo) < jf;
    return [Math.floor(xo), Math.floor(j) * 2 + (jo ? -1 : 0)];
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

  private getTriangleVertices(x: number, y: number) {
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

  private getAdjacent(x: number, y: number) {
    const adjacent = [y % 4 < 2 ? x - 1 : x + 1, y % 2 === 0 ? y - 1 : y + 1];
    return [[x, y - 1], [x, y + 1], adjacent];
  }

  raycast(x1:number, y1:number, x2:number, y2:number) {
    const [tx1, ty1] = this.worldToTriangle(x1, y1);
    const [cx1, cy1] = this.triangleToCell(tx1, ty1);
    if (this.grid[cx1 * this.height + cy1] > 0) return [x1, y1];
    const [tx2, ty2] = this.worldToTriangle(x2, y2);

    const checked = new Set([`${cx1}_${cy1}`]);
    const queue = this.getAdjacent(cx1, cy1);
    while (queue.length) {
      const [cx, cy] = queue.pop();

      const [xa, ya, xb, yb, xc, yc] = this.getTriangleVertices(cx, cy);
      const hits = raycast(
        [tx1, ty1, tx2, ty2],
        [xa, ya, xb, yb],
        [xb, yb, xc, yc],
        [xc, yc, xa, ya]
      );
      if (!hits.length) continue;

      if (this.grid[cx * this.height + cy] > 0) {
        let hit = hits[0];
        let hitDist = distance(tx1, ty1, ...hit);
        for (let i = 1; i < hits.length; ++i) {
          const dist = distance(tx1, ty1, ...hits[i]);
          if (dist >= hitDist) continue;
          hit = hits[i];
          hitDist = dist;
        }
        return this.triangleToWorld(...hit);
      }

      for (const [acx, acy] of this.getAdjacent(cx, cy)) {
        const key = `${acx}_${acy}`;
        if (checked.has(key)) continue;
        checked.add(key);
        queue.push([acx, acy]);
      }
    }

    return null;
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
    this.picker.removeFromParent();
  }
}
