import React, { useState, useCallback } from "react";
import "./styles.css";
import { PointButton } from "./components/PointButton";
import { AppState, Action, Vector2, TileInfo } from "./types";
import {
  pointToIndex,
  indexToPoint,
  getNeighborsArray,
  buildTileInfo
} from "./utils";

export enum TileType {
  WALL = "WALL",
  EMPTY = "EMPTY",
  START = "START",
  TOUCHED = "TOUCHED",
  END = "END",
  BOUND = "BOUND"
}

const blockedTypes: Array<TileType> = [
  TileType.WALL,
  TileType.START,
  TileType.END
];

const state: TileInfo[] = [];
state.length = 100;
state.fill({
  type: TileType.EMPTY,
  index: -1
});

const startPoint: Vector2 = { x: 0, y: 0 };
const endPoint: Vector2 = { x: 9, y: 7 };

state[pointToIndex(startPoint)] = buildTileInfo(startPoint, TileType.START);
state[pointToIndex(endPoint)] = buildTileInfo(endPoint, TileType.END);

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentAction: Action.SET_START,
    data: state,
    currentTouched: [startPoint],
    currentBounds: getNeighborsArray(startPoint)
  });

  const setTile = useCallback(
    (p: Vector2, t: TileType = TileType.WALL, cameFrom?: TileInfo) => {
      const oldData = appState.data;
      const targetIndex = pointToIndex(p);
      const oldType = oldData[targetIndex];

      if (oldType && !blockedTypes.includes(oldType.type)) {
        oldData[targetIndex] = buildTileInfo(p, t, cameFrom);
      }

      setAppState({
        ...appState,
        data: oldData
      });
    },
    [appState]
  );

  const aStar = useCallback(() => {
    const { currentTouched, currentBounds } = appState;

    const newBoundsIndexes: number[] = [];
    const newTouched: Array<Vector2> = [...currentTouched, ...currentBounds];

    currentTouched.forEach(point => setTile(point, TileType.TOUCHED));
    currentBounds.forEach(point => {
      setTile(point, TileType.BOUND);

      const boundsNeighbors = getNeighborsArray(point);
      boundsNeighbors.forEach(neighbor => {
        const nIndex = pointToIndex(neighbor);
        const nInfo = appState.data[pointToIndex(neighbor)];

        if (
          nInfo &&
          nInfo.type === TileType.EMPTY &&
          !newBoundsIndexes.includes(nIndex)
        ) {
          newBoundsIndexes.push(nIndex);
        }
      });
    });

    setAppState({
      ...appState,
      currentTouched: newTouched,
      currentBounds: newBoundsIndexes.map(index => indexToPoint(index))
    });
  }, [setTile, appState, setAppState]);

  return (
    <>
      {appState.data.map((info, index) => {
        const pointRef: Vector2 = indexToPoint(index);

        return (
          <>
            <PointButton
              setTile={setTile}
              key={index}
              info={info}
              appState={appState}
              point={pointRef}
            />
            {pointRef.x === 9 && <br />}
          </>
        );
      })}
      <button onClick={aStar}>Next iteration step</button>
    </>
  );
}
