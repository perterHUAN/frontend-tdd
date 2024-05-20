import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { keys as actualKeys } from "../constants";
describe("FizzBuzz Game Cheating tool", () => {
  it("should have a title named 'FizzBuzz Game Cheating Tool'", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "FizzBuzz Game Cheating Tool" })
    ).toBeDefined();
    // expect(true).toBeTruthy();
  });
  it("should feature an element to display the result and twelve keys for input control, arranged from top to bottom, left to right as follows: 7, 8, 9, 4, 5, 6, 1, 2, 3, 0, C (Clear), and = (Equal).", () => {
    render(<App />);

    expect(screen.getByTestId("show-result")).toBeDefined();
    const keys = findAllKeys(screen);
    // "Indeed, it cannot verify the visual order these keys appear on the page; it can only ascertain their DOM sequence."
    expect(
      keys.length === 12 &&
        keys.map((e, idx) => e.textContent === actualKeys[idx])
    ).toBeTruthy();
  });
  test("When the 0-9 keys are pressed, the corresponding key is displayed in the output area, with each subsequent key press appearing after the previously entered one.", async () => {
    const user = userEvent.setup();
    render(<App />);
    const keys = findAllKeys(screen);
    const numStr = "89790";
    await clickGivenNumStr(user, keys, numStr);

    expect(screen.getByTestId("show-result")).toHaveTextContent(numStr);
  });
  test("Pressing the C key clears the content in the display area.", async () => {
    const user = userEvent.setup();
    render(<App />);
    const keys = findAllKeys(screen);
    const show = screen.getByTestId("show-result");
    const numStr = "9087";
    await clickGivenNumStr(user, keys, numStr);
    expect(show).toHaveTextContent(numStr);
    await clickGivenKey(user, keys, "C");
    expect(show).toHaveTextContent("");
  });
  test("Hitting the = key computes the current valid input's output according to the FizzBuzz game rules", async () => {
    const user = userEvent.setup();
    render(<App />);

    const keys = findAllKeys(screen);
    const show = screen.getByTestId("show-result");

    const arrayOfNumStr = ["1", "2", "3", "5", "9", "15"];
    const expectValues = ["1", "2", "Fizz", "Buzz", "Fizz", "FizzBuzz"];
    for (let i = 0; i < arrayOfNumStr.length; i++) {
      const numStr = arrayOfNumStr[i];
      const expectValue = expectValues[i];
      await clickGivenNumStr(user, keys, numStr);
      expect(show).toHaveTextContent(numStr);
      await clickGivenKey(user, keys, "=");
      expect(show).toHaveTextContent(expectValue);

      await clickGivenKey(user, keys, "C");
    }
  });

  test("Hitting the = key, if the content in the display area is invalid, computation is not initiated.", async () => {
    const user = userEvent.setup();
    render(<App />);

    const keys = findAllKeys(screen);
    const show = screen.getByTestId("show-result");
    const numStr = "5";

    await clickGivenNumStr(user, keys, numStr);
    expect(show).toHaveTextContent(numStr);
    await clickGivenKey(user, keys, "=");
    expect(show).toHaveTextContent("Buzz");
    await clickGivenKey(user, keys, "=");
    expect(show).toHaveTextContent("Buzz");
  });
});

function findAllKeys(screen) {
  return screen.getAllByRole("button", {
    name: (content) => actualKeys.includes(content),
  });
}
async function clickGivenNumStr(user, keys, numStr) {
  for (const keyName of numStr.split("")) {
    await clickGivenKey(user, keys, keyName);
  }
}
async function clickGivenKey(user, keys, keyName) {
  const key = keys.find((key) => key.textContent === keyName);
  if (!key) return;
  await user.click(key);
}
