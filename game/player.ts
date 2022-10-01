import { BoxGeometry, MeshNormalMaterial, Mesh, Scene, Vector3 } from "three";
import Input from "./input";

export default class Player {
  private mesh: Mesh;

  constructor(scene: Scene) {
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshNormalMaterial();
    this.mesh = new Mesh(geometry, material);
    scene.add(this.mesh);
  }

  update(dt: number, input: Input) {
    this.mesh.rotateOnAxis(new Vector3(0, 0, 1), dt / 1000);
    const horizontal = input.get("Right") - input.get("Left");
    this.mesh.translateX((horizontal * 1 * dt) / 1000);
    const vertical = input.get("Down") - input.get("Up");
    this.mesh.translateY((vertical * 1 * dt) / 1000);
  }

  destructor() {
    this.mesh.removeFromParent();
  }
}
