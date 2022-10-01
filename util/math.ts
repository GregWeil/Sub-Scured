export const lerp = (a: number, b: number, val: number) => a + (b - a) * val;

export const unlerp = (a: number, b: number, val: number) =>
  (val - a) / (b - a);

export const getLerpFactor = (val: number, dt: number) =>
  1 - Math.pow(1 - val, dt);
