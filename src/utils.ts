import { Vector2, NeighborsList } from "./types";

const BASE = 10;

export const pointToIndex = (point: Vector2): number => {
  if (isPointBad(point)) {
    return -1;
  }

  return point.y * BASE + point.x;
};

function isCoordinateBad(coordinate: number) {
  return coordinate > BASE || coordinate < 0;
}

function isPointBad(point: Vector2) {
  return isCoordinateBad(point.x) || isCoordinateBad(point.y);
}

export const indexToPoint = (index: number): Vector2 => {
  return {
    x: index % 10,
    y: Math.floor(index / 10)
  };
};

export function getRandomPoint(): Vector2 {
  return {
    x: Math.floor(Math.random() * BASE),
    y: Math.floor(Math.random() * BASE)
  };
}

export function getNeighbors(point: Vector2): NeighborsList<Vector2> {
  const { x, y } = point;

  return {
    top: { x, y: y - 1 },
    right: { x: x + 1, y },
    bottom: { x, y: y + 1 },
    left: { x: x - 1, y }
  };
}

export function getNeighborsArray(point: Vector2): Array<Vector2> {
  const n = getNeighbors(point);
  return [n.bottom, n.left, n.right, n.top];
}
