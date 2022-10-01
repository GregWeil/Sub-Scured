import {
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from "three";

export default class Grid {
  private mesh: Mesh;
  private spacing: number;

  constructor(scene: Scene, width: number, height: number, spacing: number,width:number) {
    this.spacing = spacing;
    const vertices = [];
    for (let x = -width / 2; x <= width / 2; x += spacing) {
      vertices.push(x, -height / 2, 0);
      vertices.push(x, height / 2, 0);
    }
    for (let y = -height / 2; y <= height / 2; y += spacing) {
      vertices.push(-width / 2, y, 0);
      vertices.push(width / 2, y, 0);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
    const material = new MeshBasicMaterial({color: 0x555555});
    this.mesh = new Mesh(geometry, material);
    scene.add(this.mesh);
  }

  update(cameraPosition: Vector3) {
    this.mesh.position.x =
      Math.round(cameraPosition.x / this.spacing) * this.spacing;
    this.mesh.position.y =
      Math.round(cameraPosition.y / this.spacing) * this.spacing;
    this.mesh.position.z = -10;
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
