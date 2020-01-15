import React, { useCallback } from "react";
import { TileType } from "../App";
import { AppState, Vector2, Direction, TileInfo } from "../types";
import { Arrow } from "./Arrow";

const TypeColorMap: Record<TileType, string> = {
  WALL: "grey",
  START: "lightblue",
  END: "red",
  EMPTY: "white",
  TOUCHED: "pink",
  BOUND: "blue",
  PATH: "orange"
};

interface Props {
  info: TileInfo;
  point: Vector2;
  appState: AppState;
  setTile: (p: Vector2, t: TileType) => void;
}

export const PointButton: React.FC<Props> = props => {
  const { info, setTile, point } = props;
  const onClickHandler = useCallback(() => {
    setTile(
      point,
      info.type === TileType.WALL ? TileType.EMPTY : TileType.WALL
    );
  }, [point, setTile, info]);

  return (
    <button
      onClick={onClickHandler}
      style={{
        backgroundColor: TypeColorMap[info.type],
        width: 30,
        height: 30
      }}
    >
      {info.type === TileType.TOUCHED ? (
        <Arrow direction={Direction.TOP} />
      ) : (
        <div />
      )}
    </button>
  );
};
