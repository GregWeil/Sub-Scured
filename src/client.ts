import { WebGLRenderer } from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";

import Game from "./game";
import Input from "./game/input";

document.getElementById("fullscreen")!.addEventListener("click", () => {
  document.body.requestFullscreen({ navigationUI: "hide" });
});

const renderer = new WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
});
document.body.insertBefore(renderer.domElement, document.body.firstChild);
renderer.autoClear = false;
renderer.clear();

const stats = Stats();
document.body.appendChild(stats.domElement);

const input = new Input(renderer.domElement);
const game = new Game(renderer);

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  game.resize(renderer);
};
window.addEventListener("resize", resize);
resize();

let started = false;
game.render(renderer, 0);
document.getElementById("start")!.addEventListener("click", () => {
  document.body.classList.remove("title");
  started = true;
});
document.getElementById("restart")!.addEventListener("click", () => {
  window.location.reload();
});

let timeLast = 0;
renderer.setAnimationLoop((time) => {
  if (timeLast && started) {
    const dt = Math.min(time - timeLast, 1000 / 15);
    input.before(game.camera);
    if (started) game.update(dt, input);
    input.after();
    game.render(renderer, dt);
  }
  timeLast = time;
  stats.update();
});

console.log("Hello world!");
