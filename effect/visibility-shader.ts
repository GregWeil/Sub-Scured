import { Vector2, Vector4 } from "three";

const uniforms = {
  SourceBounds: { value: new Vector4() },
  TargetBounds: { value: new Vector4() },
  PlayerPosition: { value: new Vector2() },
};

const vertexShader = `
// help
`;

const fragmentShader = `
// eee
`;

export const VisibilityShader = {
  uniforms,
  vertexShader,
  fragmentShader,
};
export default VisibilityShader;
