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

  startPosition?: Vector2;
  endPosition?: Vector2;
}
