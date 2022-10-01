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
    const horizontal = input.getHorizontal();
    this.mesh.position.x += (horizontal * 50 * dt) / 1000;
    const vertical = input.getVertical();
    this.mesh.position.y += (vertical * 50 * dt) / 1000;
  }

getPosition(){
  return this.mesh.position;
}

  destructor() {
    this.mesh.removeFromParent();
  }
}
