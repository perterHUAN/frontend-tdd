import React from "react";
import useGameState from "./hooks/useGameState";
import Board from "./components/Board";
import MarsRoverControlPanel from "./components/MarsRoverControlPanel";
import FeedBack from "./components/FeedBack";
function App() {
  const [executing, setExecuting] = React.useState(false);
  const [command, setCommand] = React.useState("");

  const [gameState, resolveCommand] = useGameState(command);
  const { rows, cols } = gameState.graph;
  const marsRover = gameState.marsRover;

  function executeCommand() {
    return new Promise((r) =>
      setTimeout(() => {
        resolveCommand().then(() => {
          setCommand("");
          r();
        });
      }, 1000)
    );
  }
  async function handleClick() {
    setExecuting(true);
    await executeCommand();
    setExecuting(false);
  }
  function handleChange(event) {
    setCommand(event.target.value);
  }
  return (
    <>
      <header>
        <h1 className="text-center font-bold text-3xl my-5">
          MarsRover
        </h1>
      </header>
      <main className="flex flex-row gap-4 items-start my-5">
        <div className="flex flex-col items-center gap-4">
          <Board rows={rows} cols={cols} marsRover={marsRover} />
          <MarsRoverControlPanel
            command={command}
            handleChange={handleChange}
            handleClick={handleClick}
            executing={executing}
          />
        </div>
        <FeedBack marsRover={marsRover} />
      </main>
    </>
  );
}

export default App;
