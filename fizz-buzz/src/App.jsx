import "./App.css";
import { keys } from "./constants";
import React from "react";
import { fizzBuzz } from "./helpers";

function App() {
  const [showValue, setShowValue] = React.useState("");
  function handleClick(event) {
    const target = event.target.closest("[data-key]");
    console.log("target: ", target);
    if (!target) return;
    const key = target.dataset.key;
    console.log("key: ", key);
    if ("0123456789".includes(key)) {
      setShowValue(showValue + key);
    } else if (key === "C") {
      setShowValue("");
    } else if (key === "=") {
      if (showValue.match(/\d+/)) {
        const res = fizzBuzz(showValue);
        setShowValue(res);
      }
    }
  }
  return (
    <>
      <h1 className="text-2xl font-semibold mb-10 text-[#77AAAD]">
        FizzBuzz Game Cheating Tool
      </h1>
      <main className="max-w-md mx-auto rounded overflow-hidden">
        <div
          data-testId="show-result"
          className="select-none bg-[#6E7783] text-[#D8E6E7] h-14 mb-1"
        >
          {showValue}
        </div>
        <div
          className=" grid grid-cols-3 gap-1 font-semibold"
          onClick={handleClick}
        >
          {keys.map((keyName) => (
            <button
              data-key={keyName}
              key={keyName}
              className="py-2 px-4 bg-[#9DC3C1] hover:bg-[#77AAAD] select-none"
              style={{
                backgroundColor: keyName === "=" ? "#77AAAD" : "",
              }}
            >
              {keyName}
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

export default App;
