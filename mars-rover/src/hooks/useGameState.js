import React from "react";
import {
  calculateNewLocationWhenMove,
  calculateNewOrientationWhenRote,
} from "../utils";
function useGameState(command) {
  const [gameState, setGameState] = React.useState({
    graph: {
      rows: 5,
      cols: 5,
    },
    marsRover: null,
  });

  async function resolveCommand() {
    const commandLines = command
      .trim()
      .split("\n")
      .map((line) =>
        line.split(" ").map((e) => (e.match(/\d+/) ? Number(e) : e))
      );
    // if (commandLines.length >= 1) initialGraph(...commandLines[0]);
    // if (commandLines.length >= 2) initialMarsRover(...commandLines[1]);
    // if (commandLines.length >= 3) await executeActions(commandLines[2]);
    for (const commandLine of commandLines) {
      await dispatchCommand(commandLine);
    }
  }
  async function dispatchCommand(commandLine) {
    if (
      commandLine.length === 2 &&
      commandLine.every((e) => typeof e === "number" && e > 0)
    ) {
      initialGraph(...commandLine);
    } else if (
      commandLine.length === 3 &&
      commandLine.slice(0, 2).every((e) => typeof e === "number" && e >= 0) &&
      typeof commandLine[2] === "string" &&
      "NSEW".includes(commandLine[2])
    ) {
      initialMarsRover(...commandLine);
    } else if (
      commandLine.every((e) => typeof e === "string" && "MLR".includes(e))
    ) {
      await executeActions(commandLine);
    }
  }
  function initialGraph(rows, cols) {
    setGameState((state) => {
      if (
        state.marsRover &&
        (state.marsRover.row >= rows || state.marsRover.col >= rows)
      )
        return state;
      return {
        ...state,
        graph: {
          rows,
          cols,
        },
      };
    });
  }
  function initialMarsRover(row, col, orientation) {
    setGameState((state) => {
      return {
        ...state,
        marsRover: {
          row,
          col,
          orientation,
        },
      };
    });
  }
  function moveMarsRover() {
    setGameState((state) => {
      return {
        ...state,
        marsRover: {
          ...state.marsRover,
          ...calculateNewLocationWhenMove(
            state.marsRover.row,
            state.marsRover.col,
            state.marsRover.orientation,
            state.graph.rows - 1,
            state.graph.cols - 1
          ),
        },
      };
    });
  }
  function rotateMarsRover(direction) {
    setGameState((state) => {
      return {
        ...state,
        marsRover: {
          ...state.marsRover,
          orientation: calculateNewOrientationWhenRote(
            state.marsRover.orientation,
            direction
          ),
        },
      };
    });
  }
  function executeActions(actions) {
    return new Promise((r) => {
      if (actions.length === 0) return r();
      setTimeout(() => {
        const action = actions.shift();
        if (action === "M") {
          moveMarsRover();
        } else {
          rotateMarsRover(action);
        }
        executeActions(actions).then(() => r());
      }, 500);
    });
  }

  return [gameState, resolveCommand];
}
export default useGameState;
