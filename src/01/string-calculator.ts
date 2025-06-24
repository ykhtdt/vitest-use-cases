export function add(input: string): number {
  if (input === "") {
    return 0
  }

  const numbers = input.split(",").flatMap((num) => num.split("\n"))

  if (numbers.length === 1) {
    return parseInt(numbers[0])
  }

  return numbers.reduce((sum, num) => sum + parseInt(num), 0)
}
