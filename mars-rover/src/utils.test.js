import {
  calculateNewLocationWhenMove,
  range,
  calculateNewOrientationWhenRote,
} from "./utils";
import { expect, describe, test } from "vitest";
describe("range", () => {
  test("只传递一个参数2，应该返回[0,1]", () => {
    const res = range(2);
    expect(res).toStrictEqual([0, 1]);
  });
  test("传递两个参数1、4，应该返回[1, 2, 3]", () => {
    const res = range(1, 4);
    expect(res).toStrictEqual([1, 2, 3]);
  });
  test("传递三个参数1、4、2，应该返回[1, 3]", () => {
    const res = range(1, 4, 2);
    expect(res).toStrictEqual([1, 3]);
  });
  test("不传递任何参数，应该抛出错误信息，'至少至少包含一个参数'", () => {
    expect(() => range()).toThrowError("必须至少包含一个参数");
  });
});

describe("calculateNewLocationWhenMove", () => {
  test.each([
    [2, 2, "N", 1, 2],
    [2, 2, "S", 3, 2],
    [2, 2, "E", 2, 3],
    [2, 2, "W", 2, 1],
    [0, 0, "W", 0, 0],
  ])(
    "row: %i, col: %i, orientation: %s => row: %i, col: %i",
    (a, b, c, expectA, expectB) => {
      expect(calculateNewLocationWhenMove(a, b, c, 5, 5)).toStrictEqual({
        row: expectA,
        col: expectB,
      });
    }
  );
});

describe("calculateNewOrientationWhenRotate", () => {
  test.each([
    ["N", "R", "E"],
    ["E", "R", "S"],
    ["S", "R", "W"],
    ["W", "R", "N"],
    ["N", "L", "W"],
    ["W", "L", "S"],
    ["S", "L", "E"],
    ["E", "L", "N"],
  ])("orientation: %s rotate: %s => orientation: %s", (a, b, c) => {
    expect(calculateNewOrientationWhenRote(a, b)).toBe(c);
  });
});
