import { TileType } from "./App";

export enum Action {
  SET_START,
  SET_END
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface AppState {
  currentAction?: Action;
  data: Array<TileType>;

  startPosition?: Vector2;
  endPosition?: Vector2;
}
