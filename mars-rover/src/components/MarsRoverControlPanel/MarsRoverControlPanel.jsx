import React from "react";

function MarsRoverControlPanel({
  command,
  handleChange,
  handleClick,
  executing,
}) {
  return (
    <section className="flex flex-row items-center justify-center gap-2">
      <div className="min-w-32">
        <h2 className="mb-2 font-semibold text-[#379392]">命令</h2>
        <textarea
          data-testid="command-input"
          className="p-1 rounded h-20 bg-transparent font-semibold  border-2 border-[#4c86c6] outline-[#4f86c6]"
          value={command}
          onChange={handleChange}
        ></textarea>
      </div>
      <button
        className="whitespace-nowrap px-4 py-2  rounded hover:opacity-75"
        style={{
          backgroundColor: "var(--bg-button)",
          color: "white",
        }}
        disabled={executing ? true : false}
        onClick={handleClick}
      >
        {executing ? "命令执行中..." : "开始执行命令"}
      </button>
    </section>
  );
}

export default MarsRoverControlPanel;
