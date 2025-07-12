import { OrthographicCamera } from "three";

import { lerp } from "../util/math";

export default class Input {
  private element: HTMLElement;

  private keyState: Set<String>;
  private keyDown: (event: KeyboardEvent) => void;
  private keyUp: (event: KeyboardEvent) => void;

  private mouseScreen: [number, number];
  private mouseWorld: [number, number];
  private mouseMove: (event: MouseEvent) => void;

  constructor(element: HTMLElement) {
    this.element = element;

    this.keyState = new Set();
    this.keyDown = (event) => this.keyState.add(event.key);
    this.keyUp = (event) => this.keyState.delete(event.key);
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);

    this.mouseScreen = [0, 0];
    this.mouseWorld = [0, 0];
    this.mouseMove = (event) => {
      this.mouseScreen = [
        event.offsetX / element.clientWidth,
        event.offsetY / element.clientHeight,
      ];
    };
    this.element.addEventListener("mousemove", this.mouseMove);
  }

  before(camera: OrthographicCamera) {
    const [x, y] = this.mouseScreen;
    this.mouseWorld = [
      camera.position.x + lerp(camera.left, camera.right, x),
      camera.position.y + lerp(camera.top, camera.bottom, y),
    ];
  }

  after() {
    // clear out pressed/released flags
  }

  getKey(...keys: string[]) {
    return keys.some((key) => this.keyState.has(key));
  }

  getHorizontal() {
    return (
      Number(this.getKey("ArrowRight", "d")) -
      Number(this.getKey("ArrowLeft", "a"))
    );
  }

  getVertical() {
    return (
      Number(this.getKey("ArrowDown", "s")) -
      Number(this.getKey("ArrowUp", "w"))
    );
  }

  getMouse(): [number, number] {
    return this.mouseWorld;
  }

  destructor() {
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
    this.element.removeEventListener("mousemove", this.mouseMove);
  }
}
