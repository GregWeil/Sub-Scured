import {
  BufferGeometry,
  BufferAttribute,
  LineSegments,
  LineBasicMaterial,
  Scene,
  Vector3,
} from "three";

export default class Grid {
  private mesh: LineSegments;
  private spacing: number;

  constructor(scene: Scene, width: number, height: number, spacing: number) {
    this.spacing = spacing;
    const vertices = [];
    for (let x = -width / 2; x <= width / 2; x += spacing) {
      vertices.push(x, -height, 0);
      vertices.push(x, height, 0);
    }
    for (let y = -height / 2; y <= height / 2; y += spacing) {
      vertices.push(-width, y, 0);
      vertices.push(width, y, 0);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
    const material = new LineBasicMaterial({
      color: 0xffffff,
      linewidth: 10,
    });
    this.mesh = new LineSegments(geometry, material);
    scene.add(this.mesh);
  }

  update(cameraPosition: Vector3) {
    this.mesh.position.x = Math.round(cameraPosition.x / this.spacing) * this.spacing;
    this.mesh.position.y = Math.round(cameraPosition.y / this.spacing) * this.spacing;
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
