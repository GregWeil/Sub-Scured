import {OrthographicCamera,Scene,WebGLRenderer,BoxGeometry,MeshNormalMaterial,Mesh} from 'three';

const camera = new OrthographicCamera(-100,100,-100,100,1,1000)

const scene = new Scene()

const geometry = new BoxGeometry(0.2,0.2,0.2);
const material=new MeshNormalMaterial()
const mesh = new Mesh(geometry,material)
scene.add(mesh)

const renderer=new WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

console.log('Hello world!');
