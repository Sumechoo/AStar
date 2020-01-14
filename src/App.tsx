import React, { useState, useCallback } from "react";
import "./styles.css";
import { PointButton } from "./components/PointButton";
import { AppState, Action, Vector2 } from "./types";
import { pointToIndex, indexToPoint, getNeighborsArray } from "./utils";

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

const state: TileType[] = [];
state.length = 100;
state.fill(TileType.EMPTY);

const startPoint: Vector2 = { x: 3, y: 3 };
const endPoint: Vector2 = { x: 7, y: 7 };

state[pointToIndex(startPoint)] = TileType.START;
state[pointToIndex(endPoint)] = TileType.END;

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentAction: Action.SET_START,
    data: state,
    currentTouched: [startPoint],
    currentBounds: getNeighborsArray(startPoint)
  });

  const setTile = useCallback(
    (p: Vector2, t: TileType = TileType.WALL) => {
      const oldData = appState.data;
      const targetIndex = pointToIndex(p);
      const oldType = oldData[targetIndex];

      if (!blockedTypes.includes(oldType)) {
        oldData[targetIndex] = t;
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
        const nType = appState.data[pointToIndex(neighbor)];

        if (nType === TileType.EMPTY && !newBoundsIndexes.includes(nIndex)) {
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
      {appState.data.map((type, index) => {
        const pointRef: Vector2 = indexToPoint(index);

        return (
          <>
            <PointButton
              setTile={setTile}
              key={index}
              type={type}
              appState={appState}
              point={pointRef}
            />
            {pointRef.x === 9 && <br />}
          </>
        );
      })}
      <button onClick={aStar}>Calculate path iteration</button>
    </>
  );
}
