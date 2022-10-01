import { OrthographicCamera } from "three";

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
    this.element.addEventListener("keydown", this.keyDown);
    this.element.addEventListener("keyup", this.keyUp);

    this.mouseScreen = [0, 0];
    this.mouseWorld = [0, 0];
    this.mouseMove = (event) => {
      this.mouseScreen = [event.offsetX, event.offsetY];
      console.log(this.mouseScreen);
    };
    this.element.addEventListener("mousemove", this.mouseMove);
  }

  before(camera: OrthographicCamera) {
    const [x,y]=this.mouseScreen;
  this.mouseWorld
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

getMouse(){
  return this.mouseWorld;
}

  destructor() {
    this.element.removeEventListener("keydown", this.keyDown);
    this.element.removeEventListener("keyup", this.keyUp);
    this.element.removeEventListener("mousemove", this.mouseMove);
  }
}
