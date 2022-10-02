import {
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  MeshBasicMaterial,
  ShaderMaterial,
  Mesh,
  Scene,
  WebGLRenderTarget,
  WebGLRenderer,
  UniformsUtils,
  Vector2,
  Vector3,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { Howl } from "howler";

import Game from "./game";
import { radarPingSound, radarMapTransitionSpeed } from "./assets";
import VisibilityShader from "../effect/visibility-shader";
import WaterBackgroundShader from "../effect/water-background-shader";
import { getLerpFactor } from "../util/math";

export default class RadarRenderer {
  private game: Game;
  private timer: number;
  private pulseX: number;
  private pulseY: number;

  private overviewCamera: OrthographicCamera;
  private overviewTarget1: WebGLRenderTarget;
  private overviewTarget2: WebGLRenderTarget;
  private overviewTargetQuad: FullScreenQuad;
  private overviewComposer: EffectComposer;
  private overviewScene: Scene;
  private overviewQuad: Mesh;

  private sceneComposer: EffectComposer;

  private screenBackground: ShaderPass;
  private screenVisibility: ShaderPass;
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
    this.overviewTarget1 = new WebGLRenderTarget(256, 256, {
      magFilter: NearestFilter,
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setRenderTarget(this.overviewTarget1);
    renderer.clear();
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x000000, 0);
    this.overviewTarget2 = this.overviewTarget1.clone();
    this.overviewComposer = new EffectComposer(
      renderer,
      this.overviewTarget1.clone()
    );
    this.overviewComposer.addPass(
      new RenderPass(this.game.scene, this.overviewCamera)
    );
    this.overviewComposer.addPass(new FilmPass(0.5, 0, 0, true));
    this.overviewComposer.renderToScreen = false;
    this.overviewTargetQuad = new FullScreenQuad(
      new ShaderMaterial({
        ...VisibilityShader,
        uniforms: UniformsUtils.clone(VisibilityShader.uniforms),
        defines: { ...VisibilityShader.defines },
      })
    );
    this.overviewScene = new Scene();
    this.overviewQuad = new Mesh(
      new PlaneGeometry(
        this.overviewCamera.right - this.overviewCamera.left,
        this.overviewCamera.bottom - this.overviewCamera.top
      ),
      new MeshBasicMaterial({
        map: this.overviewTarget1.texture,
        transparent: true,
      })
    );
    this.overviewQuad.rotation.set(0, Math.PI, Math.PI);
    this.overviewScene.add(this.overviewQuad);

    this.sceneComposer = new EffectComposer(renderer);
    const renderPass = new RenderPass(
      this.game.scene,
      this.game.camera
    );
    renderPass.sampleLevel = 2;
    this.sceneComposer.addPass(renderPass);
    this.sceneComposer.renderToScreen = false;

    this.screenComposer = new EffectComposer(renderer);
    this.screenComposer.addPass(
      new RenderPass(this.overviewScene, this.game.camera)
    );
    this.screenComposer.addPass(new FilmPass(0.8, 0.2, 648, false));
    this.screenVisibility = new ShaderPass(VisibilityShader);
    this.screenComposer.addPass(this.screenVisibility);
    this.screenBackground = new ShaderPass(WaterBackgroundShader);
    this.screenComposer.addPass(this.screenBackground);
    this.screenComposer.addPass(new FilmPass(0.35, 0.05, 648, false));

    this.sound = new Howl({ src: [radarPingSound] });
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

  private applyShaderUniforms(
    uniforms: { [name: string]: { value: any } },
    source: WebGLRenderTarget,
    camera: OrthographicCamera
  ) {
    uniforms.SourceImage.value = source.texture;
    uniforms.PositionBounds.value.set(
      camera.position.x + camera.left,
      camera.position.y + camera.bottom,
      camera.position.x + camera.right,
      camera.position.y + camera.top
    );
    const playerPosition = this.game.player.getPosition();
    uniforms.PlayerPosition.value.set(playerPosition.x, playerPosition.y);
    uniforms.RadarPosition.value.set(this.pulseX, this.pulseY);
    uniforms.RadarTime.value = this.timer;
  }

  render(renderer: WebGLRenderer, dt: number) {
    this.overviewComposer.render(dt / 1000);
    const tempOverviewTarget1 = this.overviewTarget1;
    this.overviewTarget1 = this.overviewTarget2;
    this.overviewTarget2 = tempOverviewTarget1;

    renderer.setRenderTarget(this.overviewTarget1);
    renderer.clear();
    this.overviewTargetQuad.material.uniforms.tDiffuse.value =
      this.overviewTarget2.texture;
    this.applyShaderUniforms(
      this.overviewTargetQuad.material.uniforms,
      this.overviewComposer.readBuffer,
      this.overviewCamera
    );
    this.overviewTargetQuad.material.uniforms.TransitionAmount.value =
      getLerpFactor(radarMapTransitionSpeed, dt / 60);
    this.overviewTargetQuad.render(renderer);
    renderer.setRenderTarget(null);

    this.overviewQuad.material.map = this.overviewTarget1.texture;
    this.sceneComposer.render(dt / 1000);

    this.screenBackground.uniforms.PositionBounds.value.set(
      this.game.camera.position.x + this.game.camera.left,
      this.game.camera.position.y + this.game.camera.bottom,
      this.game.camera.position.x + this.game.camera.right,
      this.game.camera.position.y + this.game.camera.top
    );
    this.applyShaderUniforms(
      this.screenVisibility.uniforms,
      this.sceneComposer.readBuffer,
      this.game.camera
    );
    this.screenComposer.render(dt / 1000);
  }

  destructor() {
    this.overviewTarget1.dispose();
    this.overviewTarget2.dispose();
    this.overviewTargetQuad.dispose();
    this.overviewComposer.dispose();
    this.overviewQuad.geometry.dispose();
    this.sceneComposer.dispose();
    this.screenComposer.dispose();
  }
}
