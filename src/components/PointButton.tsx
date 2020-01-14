import React, { useCallback, useMemo } from "react";
import { TileType } from "../App";
import { AppState, Vector2, Direction } from "../types";
import { getNeighbors } from "../utils";
import { Arrow } from "./Arrow";

const TypeColorMap: Record<TileType, string> = {
  WALL: "grey",
  START: "lightblue",
  END: "red",
  EMPTY: "white",
  TOUCHED: "pink"
};

interface Props {
  type: TileType;
  point: Vector2;
  appState: AppState;
  setTile: (p: Vector2, t: TileType) => void;
}

export const PointButton: React.FC<Props> = props => {
  const { type, setTile, point } = props;
  const neighbors = useMemo(() => getNeighbors(point), [point]);
  const onClickHandler = useCallback(() => {
    setTile(point, type === TileType.WALL ? TileType.EMPTY : TileType.WALL);

    setTile(
      neighbors.left,
      type === TileType.WALL ? TileType.EMPTY : TileType.TOUCHED
    );
  }, [point, setTile, type, neighbors]);

  return (
    <button
      onClick={onClickHandler}
      style={{
        backgroundColor: TypeColorMap[type],
        width: 30,
        height: 30
      }}
    >
      {type === TileType.TOUCHED ? (
        <Arrow direction={Direction.TOP} />
      ) : (
        <div />
      )}
    </button>
  );
};
