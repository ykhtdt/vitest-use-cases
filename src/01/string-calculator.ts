export function add(input: string): number {
  const isEmptyInput = input === ""

  if (isEmptyInput) {
    return 0
  }

  let delimiterPattern = /,|\n/
  let numbersPart = input

  const hasCustomDelimiter = input.startsWith("//")

  if (hasCustomDelimiter) {
    const match = input.match(/^\/\/(.+)\n(.*)$/)

    if (match) {
      const [, delimiter, rest] = match
      delimiterPattern = new RegExp(delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      numbersPart = rest
    }
  }

  const numbers = numbersPart.split(delimiterPattern).map(Number)
  const total = numbers.reduce((sum, n) => sum + n, 0)

  return total
}
