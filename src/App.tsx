import React, { useState, useCallback, useEffect } from "react";
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
  PATH = "PATH",
  BOUND = "BOUND"
}

const blockedTypes: Array<TileType> = [
  TileType.WALL,
  TileType.START,
  TileType.END
];

let state: TileInfo[] = [];
state.length = 100;
state = state
  .fill({
    type: TileType.EMPTY,
    index: -1
  })
  .map((info, index) => ({ ...info, index }));

const startPoint: Vector2 = { x: 0, y: 0 };
const endPoint: Vector2 = { x: 9, y: 7 };
const endIndex = pointToIndex(endPoint);

state[pointToIndex(startPoint)] = buildTileInfo(startPoint, TileType.START);
state[endIndex] = buildTileInfo(endPoint, TileType.END);

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    isPathFound: false,
    isCalculationAllowed: false,
    currentAction: Action.SET_START,
    data: state,
    currentTouched: [startPoint],
    currentBounds: [startPoint]
  });

  const setTile = useCallback(
    (p: Vector2, t: TileType = TileType.WALL, cameFromIndex?: number) => {
      const oldData = appState.data;
      const targetIndex = pointToIndex(p);
      const oldInfo = oldData[targetIndex];

      if (oldInfo && !blockedTypes.includes(oldInfo.type)) {
        oldData[targetIndex] = buildTileInfo(
          p,
          t,
          cameFromIndex || oldInfo.cameFromIndex
        );
      }

      setAppState({
        ...appState,
        data: oldData
      });
    },
    [appState]
  );

  const collectPath = useCallback(
    (cameFromIndexArg: number) => {
      const pathIndexes = [cameFromIndexArg];

      let cameFromInfo = appState.data[cameFromIndexArg];

      while (cameFromInfo.cameFromIndex) {
        pathIndexes.push(cameFromInfo.cameFromIndex);

        cameFromInfo = appState.data[cameFromInfo.cameFromIndex];
      }

      pathIndexes.forEach(index => setTile(indexToPoint(index), TileType.PATH));
      console.info("PATH:", pathIndexes);
    },
    [appState, setTile]
  );

  const aStar = useCallback(() => {
    // console.time("iteration");
    let isPathFound = appState.isPathFound;
    const { currentTouched, currentBounds } = appState;

    const pathParts: Record<number, number> = {};
    const newBoundsIndexes: number[] = [];
    const newTouched: Array<Vector2> = [...currentTouched, ...currentBounds];

    currentTouched.forEach(point => setTile(point, TileType.TOUCHED));
    currentBounds.forEach(point => {
      const currentIndex = pointToIndex(point);
      const boundsNeighbors = getNeighborsArray(point);

      boundsNeighbors.forEach(neighbor => {
        const nIndex = pointToIndex(neighbor);
        const nInfo = appState.data[pointToIndex(neighbor)];

        if (!nInfo) {
          return;
        }

        if (
          (nInfo.type === TileType.EMPTY || nInfo.type === TileType.END) &&
          !newBoundsIndexes.includes(nIndex)
        ) {
          pathParts[nIndex] = currentIndex;
          newBoundsIndexes.push(nIndex);
        }
      });
    });
    newBoundsIndexes.forEach(boundIndex => {
      if (boundIndex === endIndex) {
        collectPath(pathParts[boundIndex]);
        isPathFound = true;
      } else {
        setTile(
          indexToPoint(boundIndex),
          TileType.BOUND,
          pathParts[boundIndex]
        );
      }
    });

    setAppState({
      ...appState,
      isPathFound,
      currentTouched: newTouched,
      currentBounds: newBoundsIndexes.map(index => indexToPoint(index))
    });

    // console.timeEnd("iteration");
  }, [setTile, appState, setAppState, collectPath]);

  useEffect(() => {
    if (
      !appState.isPathFound &&
      appState.currentBounds.length > 0 &&
      appState.isCalculationAllowed
    ) {
      aStar();
    }
  }, [appState, aStar]);

  const calculate = useCallback(() => {
    setAppState({
      ...appState,
      isCalculationAllowed: true
    });
  }, [appState]);

  const showData = useCallback(() => {
    console.warn("APP STATE", appState.data);
  }, [appState]);

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
            {pointRef.x === 9 && <br key={"br" + index} />}
          </>
        );
      })}
      <button onClick={calculate}>Calculate path</button>
    </>
  );
}
