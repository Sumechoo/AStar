import React, { useState, useCallback } from "react";
import "./styles.css";
import { PointButton } from "./components/PointButton";
import { AppState, Action, Vector2 } from "./types";
import { pointToIndex } from "./utils";

export enum TileType {
  WALL = "WALL",
  EMPTY = "EMPTY",
  START = "START",
  TOUCHED = "TOUCHED",
  END = "END"
}

const state: TileType[] = [];
state.length = 100;
state.fill(TileType.EMPTY);

state[pointToIndex({ x: 0, y: 0 })] = TileType.START;
state[pointToIndex({ x: 7, y: 7 })] = TileType.END;

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentAction: Action.SET_START,
    data: state
  });

  const setTile = useCallback(
    (p: Vector2, t: TileType = TileType.WALL) => {
      const oldData = appState.data;
      const targetIndex = pointToIndex(p);

      oldData[targetIndex] = t;

      setAppState({
        ...state,
        data: oldData
      });
    },
    [appState]
  );

  return (
    <>
      {appState.data.map((type, index) => {
        const pointRef: Vector2 = {
          x: index % 10,
          y: Math.floor(index / 10)
        };

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
    </>
  );
}
