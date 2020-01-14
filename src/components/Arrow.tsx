import React from "react";
import { Direction } from "../types";

interface Props {
  direction: Direction;
}

const directionToAngle: Record<Direction, number> = {
  [Direction.BOTTOM]: 90,
  [Direction.LEFT]: 180,
  [Direction.RIGHT]: 0,
  [Direction.TOP]: -90
};

export const Arrow: React.FC<Props> = props => {
  const { direction } = props;

  return (
    <div
      style={{
        position: "absolute",
        transform: `rotate(${directionToAngle[direction]}deg)`
      }}
    >
      >
    </div>
  );
};
