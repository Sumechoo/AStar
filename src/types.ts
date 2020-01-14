import { TileType } from "./App";

export enum Action {
  SET_START,
  SET_END
}

export enum Direction {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT
}

export interface Vector2 {
  x: number;
  y: number;

  cameFrom?: Vector2;
}

export interface NeighborsList<T> {
  top: T;
  right: T;
  bottom: T;
  left: T;
}

export interface AppState {
  currentAction?: Action;
  data: Array<TileType>;
  currentBounds: Array<Vector2>;
  currentTouched: Array<Vector2>;
}
