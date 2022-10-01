import { intersection, findIntersection } from "segment-intersection";
import { Vector2 } from "three";

type Segment = [number, number, number, number];

export const intersect = (a: Segment, b: Segment) => {
  const count = findIntersection(...a, ...b);
  if (!count) return null;
  return intersection.slice(0, count);
};

export const raycast=(ray:Segment, ...segments:Segments)=>{
  
}
