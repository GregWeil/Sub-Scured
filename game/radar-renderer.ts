import {
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Scene,
  WebGLRenderTarget,
  WebGLRenderer,
  Vector2,
  Vector3,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { Howl } from "howler";

import Game from "./game";
import { backgroundColor, radarPing } from "./assets";
import VisibilityShader from "../effect/visibility-shader";

export default class RadarRenderer {
  private game: Game;
  private timer: number;
  private pulseX: number;
  private pulseY: number;

  private overviewCamera: OrthographicCamera;
  private overviewTarget: WebGLRenderTarget;
  private overviewComposer: EffectComposer;
  private overviewScene: Scene;
  private overviewQuad: Mesh;

  private sceneComposer: EffectComposer;

  private screenTexture: ShaderPass;
  private screenComposer: EffectComposer;

  private sound: Howl;

  constructor(game: Game, renderer: WebGLRenderer) {
    this.game = game;
    this.timer = 10;
    this.pulseX = 0;
    this.pulseY = 0;

    const [x, y] = this.game.map.getWorldOrigin();
    const margin = 20;
    this.overviewCamera = new OrthographicCamera(
      x - margin,
      margin - x,
      y - margin,
      margin - y,
      0,
      100
    );
    this.overviewCamera.position.z = 10;
    this.overviewCamera.updateProjectionMatrix();
    this.overviewTarget = new WebGLRenderTarget(512, 512, {
      magFilter: NearestFilter,
    });
    this.overviewComposer = new EffectComposer(
      renderer,
      this.overviewTarget.clone()
    );
    this.overviewComposer.addPass(
      new RenderPass(this.game.scene, this.overviewCamera)
    );
    this.overviewComposer.renderToScreen = false;
    this.overviewScene = new Scene();
    this.overviewQuad = new Mesh(
      new PlaneGeometry(
        this.overviewCamera.right - this.overviewCamera.left,
        this.overviewCamera.bottom - this.overviewCamera.top
      ),
      new MeshBasicMaterial({ map: this.overviewComposer.readBuffer.texture })
    );
    this.overviewQuad.rotation.set(0, Math.PI, Math.PI);
    this.overviewScene.add(this.overviewQuad);

    this.sceneComposer = new EffectComposer(renderer);
    const renderPass = new TAARenderPass(
      this.game.scene,
      this.game.camera,
      0x000000,
      0
    );
    renderPass.sampleLevel = 2;
    this.sceneComposer.addPass(renderPass);
    this.sceneComposer.renderToScreen = false;

    this.screenComposer = new EffectComposer(renderer);
    this.screenComposer.addPass(
      new RenderPass(this.overviewScene, this.game.camera)
    );
    this.screenTexture = new ShaderPass(VisibilityShader);
    this.screenComposer.addPass(this.screenTexture);
    this.screenComposer.addPass(new FilmPass(0.35, 0.025, 648, false));

    this.sound = new Howl({ src: [radarPing] });
  }

  update(dt: number, playerPosition: Vector3) {
    this.timer += dt / 1000;
    if (this.timer >= 10) {
      this.sound.stop();
      this.sound.play();
      this.timer = this.timer % 10;
      this.pulseX = playerPosition.x;
      this.pulseY = playerPosition.y;
    }
  }

  resize(renderer: WebGLRenderer) {
    const size = renderer.getSize(new Vector2());
    this.sceneComposer.setSize(size.x, size.y);
    this.sceneComposer.setPixelRatio(renderer.getPixelRatio());
    this.screenComposer.setSize(size.x, size.y);
    this.screenComposer.setPixelRatio(renderer.getPixelRatio());
  }

  render(renderer: WebGLRenderer, dt: number) {
    this.overviewComposer.render(dt / 1000);
    this.sceneComposer.render(dt / 1000);
    this.overviewQuad.material.map = this.overviewComposer.readBuffer.texture;
    this.screenTexture.uniforms.SourceImage.value =
      this.sceneComposer.readBuffer.texture;
    this.screenComposer.render(dt / 1000);
  }

  destructor() {
    this.overviewTarget.dispose();
    this.overviewComposer.dispose();
    this.overviewQuad.geometry.dispose();
    this.sceneComposer.dispose();
    this.screenComposer.dispose();
  }
}
