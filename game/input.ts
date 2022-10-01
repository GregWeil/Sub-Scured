export default class Input {
  private state: Set<String>;
  private keydown: (event: KeyboardEvent) => {};
  private keyup: (event: KeyboardEvent) => {};

  constructor() {
    this.state = new Set();
    this.keydown = (event) => this.state.add(event.key);
    this.keyup = (event) => this.state.remove(event.key);
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  get(key: string) {
    return this.state.has(key);
  }

  destructor() {
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);
  }
}
