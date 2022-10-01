import { BoxGeometry, MeshNormalMaterial, Mesh, Vector3 } from "three";

export default class Player {
  private mesh: Mesh;
  private asdf: string;

  constructor(scene) {
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshNormalMaterial();
    this.mesh = new Mesh(geometry, material);
    scene.add(this.mesh);
  }

  update(dt:number) {
    this.mesh.rotateOnAxis(new Vector3(0, 0, 1), (1 * dt) / 1000);
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
