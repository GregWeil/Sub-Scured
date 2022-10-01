import {
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
} from "three";

const camera = new OrthographicCamera(-100, 100, -100, 100, 1, 1000);
camera.position.z = 1;

const scene = new Scene();
const geometry = new BoxGeometry(10, 10, 10);
const material = new MeshNormalMaterial();
const mesh = new Mesh(geometry, material);
scene.add(mesh);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const resize = () => {
  const scale = (100 * 100) / (window.innerWidth * window.innerHeight);
  camera.left = (-scale * window.innerWidth) / 2;
  camera.right = (-scale * window.innerWidth) / 2;
  camera.top = (-scale * window.innerHeight) / 2;
  camera.bottom = (-scale * window.innerHeight) / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", resize);
resize();

renderer.setAnimationLoop((time) => {
  renderer.render(scene, camera);
});

console.log("Hello world!");
