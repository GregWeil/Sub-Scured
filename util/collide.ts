import { result, findIntersection } from "segment-intersection";
import { Vector2 } from "three";

type Segment = [number, number, number, number];

export const intersect = (a: Segment, b: Segment) => {
  const count = findIntersection(...a, ...b);
  if (!count) return null;
  return result.slice(0, count).map(point=>point.slice());
};

export const raycast = (ray: Segment, ...segments: Segment[]) => {
  return segments
    .map((segment) => intersect(ray, segment))
    .filter((hits) => !!hits)
    .flat();
};
