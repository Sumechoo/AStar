import { Vector2, NeighborsList } from "./types";

const BASE = 10;

export const pointToIndex = (point: Vector2) => {
  return point.y * BASE + point.x;
};

export function getNeighbors(point: Vector2): NeighborsList<Vector2> {
  const { x, y } = point;

  return {
    top: { x, y: y - 1 },
    right: { x: x + 1, y },
    bottom: { x, y: y + 1 },
    left: { x: x - 1, y }
  };
}
