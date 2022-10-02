import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from "three";

import { overlayColor } from "./constants";

export default class GridOverlay {
  private mesh: Mesh;
  private spacing: number;

  constructor(
    scene: Scene,
    width: number,
    height: number,
    spacing: number,
    thickness: number
  ) {
    this.spacing = spacing;
    const vertices = [];
    for (let x = -width / 2; x <= width / 2; x += spacing) {
      vertices.push(x - thickness / 2, -height / 2, 0);
      vertices.push(x - thickness / 2, height / 2, 0);
      vertices.push(x + thickness / 2, height / 2, 0);
      vertices.push(x + thickness / 2, -height / 2, 0);
      vertices.push(x - thickness / 2, -height / 2, 0);
      vertices.push(x + thickness / 2, height / 2, 0);
    }
    for (let y = -height / 2; y <= height / 2; y += spacing) {
      vertices.push(-width / 2, y - thickness / 2, 0);
      vertices.push(width / 2, y + thickness / 2, 0);
      vertices.push(width / 2, y - thickness / 2, 0);
      vertices.push(-width / 2, y - thickness / 2, 0);
      vertices.push(-width / 2, y + thickness / 2, 0);
      vertices.push(width / 2, y + thickness / 2, 0);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
    const material = new MeshBasicMaterial({ color: overlayColor });
    this.mesh = new Mesh(geometry, material);
    scene.add(this.mesh);
  }

  update(cameraPosition: Vector3) {
    this.mesh.position.x =
      Math.round(cameraPosition.x / this.spacing) * this.spacing;
    this.mesh.position.y =
      Math.round(cameraPosition.y / this.spacing) * this.spacing;
    this.mesh.position.z = -25;
  }

  destructor() {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
  }
}
