export default class Input {
  private state: Set<String>;
  private keydown: (event: KeyboardEvent) => {};
  private keyup: (event: KeyboardEvent) => {};

  constructor() {
    this.state = new Set();
    this.keydown = (event) => this.state.add(event.key);
    this.keyup = (event) => this.state.delete(event.key);
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  get(...keys: string[]) {
    return keys.some((key) => this.state.has(key));
  }

  getHorizontal() {
    return (
      Number(this.get("ArrowRight", "d")) - Number(this.get("ArrowLeft", "a"))
    );
  }

  getVertical() {
    return (
      Number(this.get("ArrowDown", "s")) - Number(this.get("ArrowUp", "w"))
    );
  }

  destructor() {
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);
  }
}
