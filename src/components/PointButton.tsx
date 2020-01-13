import React, { useCallback } from "react";
import { TileType } from "../App";
import { AppState, Vector2 } from "../types";

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
  const onClickHandler = useCallback(() => {
    setTile(point, type === TileType.WALL ? TileType.EMPTY : TileType.WALL);
  }, [point, setTile, type]);

  return (
    <button
      onClick={onClickHandler}
      style={{
        backgroundColor: TypeColorMap[type],
        width: 30,
        height: 30
      }}
    />
  );
};
