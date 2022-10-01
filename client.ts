import {
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  Vector3,
} from "three";
import Game from "./game";

const renderer = new WebGLRenderer({ antialias: true });
const resize = () => renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", resize);
resize();
document.body.appendChild(renderer.domElement);

const game = new Game();

let timeLast = 0;
renderer.setAnimationLoop((time) => {
  if (timeLast) {
    game.update(time - timeLast);
  }
  timeLast = time;
  game.render(renderer);
});

console.log("Hello world!");
