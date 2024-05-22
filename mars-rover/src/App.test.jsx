import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { describe, expect, it, test, beforeEach } from "vitest";
describe("火星车", () => {
  let user = null;
  beforeEach(() => {
    user = userEvent.setup();
    render(<App />);
  });
  it("应该有一个二维表格，表示地图", () => {
    expect(screen.getByTestId("board")).toBeDefined();
  });
  it("应该有一个输入框，用来输入发送给火星车的命令", () => {
    expect(screen.getByTestId("command-input")).toBeDefined();
  });
  it("应该有一个按钮，用于开始执行命令", () => {
    expect(screen.getByRole("button", { name: "开始执行命令" })).toBeDefined();
  });
  test("点击开始执行按钮之后，按钮内容变成命令执行中，且此时的按钮disabled", async () => {
    const executeButton = screen.getByRole("button", { name: "开始执行命令" });
    await user.click(executeButton);
    expect(executeButton).toHaveTextContent("命令执行中...");
    expect(executeButton).toBeDisabled();
  });

  test("输入地图的大小，自动生成对应大小的二维网格", async () => {
    const rows = 6,
      cols = 6;
    const commandInput = getCommandInput(screen);
    await inputCommand(user, commandInput, `${rows} ${cols}`);
    const executeButton = getExecuteButton(screen);
    await executeCommand(user, executeButton);
    const text = `${rows - 1} ${cols - 1}`;
    await expectFor(screen, [{ isNull: false, text }]);
  });

  test("输入降落地点，朝向，地图的指定位置会出现火星车，并且朝向命令中要求的方向", async () => {
    const rows = 5,
      cols = 5;
    const startRow = 2,
      startCol = 2,
      startOrientation = "N";

    const commandInput = getCommandInput(screen);
    await initialGameState(
      user,
      commandInput,
      rows,
      cols,
      startRow,
      startCol,
      startOrientation
    );
    const executeButton = getExecuteButton(screen);
    await executeCommand(user, executeButton);
    const resultText = `loc: ${startCol} ${startRow}, ori: ${startOrientation}`;
    await expectFor(screen, [{ isNull: false, text: resultText }]);
  });
  test("输入M，火星车向其朝向移动一步", async () => {
    const rows = 5,
      cols = 5,
      startCol = 2,
      startRow = 2,
      startOrientation = "N";

    const commandInput = getCommandInput(screen);
    await initialGameState(
      user,
      commandInput,
      rows,
      cols,
      startRow,
      startCol,
      startOrientation
    );
    await issueActionCommands(user, commandInput, "M");

    const executeButton = getExecuteButton(screen);
    await executeCommand(executeButton);

    const resultText = `loc: ${
      startRow - 1
    } ${startCol}, ori: ${startOrientation}`;

    await expectFor(screen, [{ isNull: false, text: resultText }]);
  });

  test("移动的时候不能移出地图，在边界处停止", async () => {
    const rows = 5,
      cols = 5,
      startCol = 0,
      startRow = 0,
      startOrientation = "N";

    const commandInput = getCommandInput(screen);
    await initialGameState(
      user,
      commandInput,
      rows,
      cols,
      startRow,
      startCol,
      startOrientation
    );
    await issueActionCommands(user, commandInput, "M");

    const executeButton = getExecuteButton(screen);
    await executeCommand(executeButton);

    const text1 = `loc: ${startRow - 1} ${startCol}, ori: ${startOrientation}`;
    const text2 = `loc: ${startRow - 1} ${startCol}, ori: ${startOrientation}`;

    await expectFor(screen, [
      { isNull: true, text: text1 },
      { isNull: true, text: text2 },
    ]);
  });
  test("L命令让火星车左转90度", async () => {
    const rows = 5,
      cols = 5,
      startCol = 0,
      startRow = 0,
      startOrientation = "N";

    const commandInput = getCommandInput(screen);
    await initialGameState(
      user,
      commandInput,
      rows,
      cols,
      startRow,
      startCol,
      startOrientation
    );
    await issueActionCommands(user, commandInput, "L");

    const executeButton = getExecuteButton(screen);
    await executeCommand(executeButton);

    const text = generateMarsRoverStateDescription(startRow, startCol, "W");

    await expectFor(screen, [{ isNull: false, text }]);
  });

  test("R命令让火星车右转90度", async () => {
    const rows = 5,
      cols = 5,
      startCol = 2,
      startRow = 2,
      startOrientation = "N";

    const commandInput = getCommandInput(screen);
    await initialGameState(
      user,
      commandInput,
      rows,
      cols,
      startRow,
      startCol,
      startOrientation
    );
    await issueActionCommands(user, commandInput, "R");

    const executeButton = getExecuteButton(screen);
    await executeCommand(executeButton);

    const text = generateMarsRoverStateDescription(startRow, startCol, "E");

    await expectFor(screen, [{ isNull: false, text }]);
  });

  test("多次的移动或转向操作，移出地图的动作无效，直到离开边界", async () => {
    const rows = 5,
      cols = 5,
      startCol = 4,
      startRow = 1,
      startOrientation = "E";

    const commandInput = getCommandInput(screen);
    await initialGameState(
      user,
      commandInput,
      rows,
      cols,
      startRow,
      startCol,
      startOrientation
    );
    // 到达右侧边界，停止移动，之后的移动操作无效，直到调整方向，向下移动
    await issueActionCommands(user, commandInput, "M M R M\n");

    const executeButton = getExecuteButton(screen);
    await executeCommand(executeButton);

    const text = generateMarsRoverStateDescription(startRow + 1, startCol, "S");

    await expectFor(screen, [{ isNull: false, text }], 14000);
  });
  test("应该有一个显示板，用来显示火星车发送回来位置及朝向信息，还有一个罗盘指示器可以帮助我们更好的判断当前火星车的朝向", async () => {
    const rows = 5,
      cols = 5,
      startCol = 4,
      startRow = 1,
      startOrientation = "E";

    const commandInput = getCommandInput(screen);
    await initialGameState(
      user,
      commandInput,
      rows,
      cols,
      startRow,
      startCol,
      startOrientation
    );

    const executeButton = getExecuteButton(screen);
    await executeCommand(executeButton);

    await expectFor(
      screen,
      [
        "feedback-row",
        "feedback-col",
        "feedback-orientation",
        "compass-indicator",
      ].map((e) => {
        return { isNull: false, testid: e };
      })
    );
  });

  test("当已经存在地图和火星车的时候，我们可以单独发送控制火星车移动的命令", async () => {
    const rows = 5,
      cols = 5,
      startCol = 0,
      startRow = 0,
      startOrientation = "E";

    const commandInput = getCommandInput(screen);
    await initialGameState(
      user,
      commandInput,
      rows,
      cols,
      startRow,
      startCol,
      startOrientation
    );

    const executeButton = getExecuteButton(screen);
    await executeCommand(executeButton);

    await waitFor(() => expect(executeButton).not.toBeDisabled());
    await inputCommand(user, commandInput, "M\n");
    await executeCommand(executeButton);

    const text = generateMarsRoverStateDescription(
      startRow,
      startCol + 1,
      startOrientation
    );
    await expectFor(screen, [{ isNull: false, text }], 3000);
  });
  test("可以随时改变地图的大小，但是如果此时火星车已经降落，该地图的大小必须容纳火星车，否则无效", async () => {
    const rows = 5,
      cols = 5,
      startCol = 4,
      startRow = 4,
      startOrientation = "E";

    const commandInput = getCommandInput(screen);
    await initialGameState(
      user,
      commandInput,
      rows,
      cols,
      startRow,
      startCol,
      startOrientation
    );

    const executeButton = getExecuteButton(screen);
    await executeCommand(executeButton);

    await waitFor(() => expect(executeButton).not.toBeDisabled());
    await inputCommand(user, commandInput, "2 2\n");
    await executeCommand(executeButton);

    await waitFor(() => expect(executeButton).not.toBeDisabled());

    const text = generateMarsRoverStateDescription(
      startRow,
      startCol,
      startOrientation
    );
    await expectFor(screen, [{ isNull: false, text }]);

    await waitFor(() => expect(executeButton).not.toBeDisabled());
    await inputCommand(user, commandInput, "6 6\n");
    await executeCommand(executeButton);

    await waitFor(() => expect(executeButton).not.toBeDisabled());

    await expectFor(screen, [
      { isNull: false, text },
      { isNull: false, text: `5 5` },
    ]);
  });
});

function generateMarsRoverStateDescription(row, col, orientation) {
  return `loc: ${row} ${col}, ori: ${orientation}`;
}

async function expectFor(screen, des, timeout = 2000) {
  await waitFor(
    () => {
      des.forEach((e) => {
        if (e.isNull) {
          if (e.text) return expect(screen.queryByText(e.text)).toBeNull();
          if (e.testid)
            return expect(screen.queryByTestId(e.testid)).toBeNull();
        } else {
          if (e.text) return expect(screen.queryByText(e.text)).not.toBeNull();
          if (e.testid)
            return expect(screen.queryByTestId(e.testid)).not.toBeNull();
        }
      });
    },
    {
      timeout,
    }
  );
}
async function issueActionCommands(user, commandInput, actions) {
  await inputCommand(user, commandInput, actions);
}

async function initialGameState(
  user,
  commandInput,
  rows,
  cols,
  startRow,
  startCol,
  startOrientation
) {
  await initialGraph(user, commandInput, rows, cols);
  await initialMarsRover(
    user,
    commandInput,
    startRow,
    startCol,
    startOrientation
  );
}
async function initialGraph(user, commandInput, rows, cols) {
  await inputCommand(user, commandInput, `${rows} ${cols}\n`);
}
async function initialMarsRover(
  user,
  commandInput,
  startRow,
  startCol,
  startOrientation
) {
  await inputCommand(
    user,
    commandInput,
    `${startRow} ${startCol} ${startOrientation}\n`
  );
}
function getCommandInput(screen) {
  return screen.getByTestId("command-input");
}
function getExecuteButton(screen) {
  return screen.getByRole("button", { name: "开始执行命令" });
}
async function inputCommand(user, commandInput, commandStr) {
  await user.type(commandInput, commandStr);
}
async function executeCommand(user, executeButton) {
  await user.click(executeButton);
}
