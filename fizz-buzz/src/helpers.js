export function fizzBuzz(num) {
  let res = "";
  if (num % 3 === 0) res += "Fizz";
  if (num % 5 === 0) res += "Buzz";
  return res === "" ? num : res;
}
