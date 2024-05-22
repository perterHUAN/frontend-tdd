import React from "react";
import { GiMarsPathfinder } from "react-icons/gi";
import { range } from "../../utils";

function Board({ rows, cols, marsRover }) {
  return (
    <div
      className="flex flex-col gap-1 rounded overflow-hidden"
      data-testid="board"
    >
      {range(rows).map((row) => {
        return (
          <div key={row} className="flex flex-row items-center gap-1">
            {range(cols).map((col) => {
              const isMarsRoverLocation =
                marsRover && row === marsRover.row && col === marsRover.col;

              return (
                <div
                  data-location={`${row}-${col}`}
                  key={col}
                  className={`font-semibold w-16 h-16 grid place-content-center`}
                  style={{
                    backgroundColor: isMarsRoverLocation
                      ? "var(--bg-board-cell-light)"
                      : "var(--bg-board-cell)",
                  }}
                >
                  {isMarsRoverLocation && (
                    <GiMarsPathfinder className="text-2xl" />
                  )}
                  <span className="sr-only">
                    {isMarsRoverLocation
                      ? `loc: ${marsRover.row} ${marsRover.col}, ori: ${marsRover.orientation}`
                      : `${row} ${col}`}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
