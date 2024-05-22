export function range(start, end, step = 1) {
  if (start === undefined) throw new Error("必须至少包含一个参数");
  if (end === undefined) {
    end = start;
    start = 0;
  }
  const res = [];
  for (let i = start; i < end; i += step) res.push(i);
  return res;
}

export function calculateNewLocationWhenMove(
  row,
  col,
  orientation,
  rows,
  cols
) {
  if (orientation === "N") return { row: Math.max(0, row - 1), col };
  else if (orientation === "S") return { row: Math.min(row + 1, rows), col };
  else if (orientation === "E") return { row, col: Math.min(cols, col + 1) };
  else if (orientation === "W") return { row, col: Math.max(col - 1, 0) };
  else
    return {
      row,
      col,
    };
}

const directions = ["N", "E", "S", "W"];
const indexOfDirections = Object.fromEntries(
  directions.map((e, idx) => [e, idx])
);
export function calculateNewOrientationWhenRote(orientation, direction) {
  const idx = indexOfDirections[orientation];
  if (direction === "L") {
    return directions[(idx - 1 + directions.length) % directions.length];
  } else if (direction === "R") {
    return directions[(idx + 1) % directions.length];
  }
  return direction;
}
