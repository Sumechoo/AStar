import React, { useCallback } from "react";
import { TileType } from "../App";
import { AppState, Vector2, TileInfo } from "../types";

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
    />
  );
};
