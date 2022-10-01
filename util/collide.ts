import { result, findIntersection } from "segment-intersection";
import { Vector2 } from "three";

type Segment = [number, number, number, number];

export const intersect = (a: Segment, b: Segment): [number, number][] => {
  const count = findIntersection(...a, ...b);
  if (!count) return null;
  return result.slice(0, count).map(([x, y]) => [x, y]);
};

export const raycast = (
  ray: Segment,
  ...segments: Segment[]
): [number, number][] => {
  return segments
    .map((segment) => intersect(ray, segment))
    .filter((hits): hits is [number, number] => !!hits)
    .flat();
};
