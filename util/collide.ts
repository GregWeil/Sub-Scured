import { result, findIntersection } from "segment-intersection";
import { Vector2 } from "three";

type Segment = [number, number, number, number];

export const intersect = (a: Segment, b: Segment): [number, number][] => {
  const count = findIntersection(...a, ...b);
  return result.slice(0, count).map(([x, y]) => [x, y]);
};

export const raycast = (
  ray: Segment,
  ...segments: Segment[]
): [number, number][] => {
  return segments.flatMap((segment) => intersect(ray, segment));
};
