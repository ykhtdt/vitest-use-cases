export function add(input: string): number {
  const isEmptyInput = input === ""

  if (isEmptyInput) {
    return 0
  }

  let delimiterPattern = /,|\n/
  let numbersPart = input

  const hasCustomDelimiter = input.startsWith("//")

  if (hasCustomDelimiter) {
    const multipleDelimitersMatch = input.match(/^\/\/(\[.+?\])+\n(.*)$/)
    const bracketMatch = input.match(/^\/\/\[(.+)\]\n(.*)$/)
    const simpleMatch = input.match(/^\/\/(.)\n(.*)$/)

    if (multipleDelimitersMatch) {
      const [, , rest] = multipleDelimitersMatch
      const delimiters = input.slice(2, input.indexOf("\n")).match(/\[([^\]]+)\]/g)
      if (delimiters) {
        const escapedDelimiters = delimiters.map(d => d.slice(1, -1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        delimiterPattern = new RegExp(escapedDelimiters.join("|"))
      }
      numbersPart = rest
    } else if (bracketMatch) {
      const [, delimiter, rest] = bracketMatch
      delimiterPattern = new RegExp(delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      numbersPart = rest
    } else if (simpleMatch) {
      const [, delimiter, rest] = simpleMatch
      delimiterPattern = new RegExp(delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      numbersPart = rest
    }
  }

  const numbers = numbersPart.split(delimiterPattern).map(Number)
  const negativeNumbers = numbers.filter((n) => n < 0)

  const hasNegativeNumber = negativeNumbers.length > 0

  if (hasNegativeNumber) {
    throw new Error(`negatives not allowed: ${negativeNumbers.join(", ")}`)
  }

  const total = numbers.reduce((sum, n) => {
    if (n > 1000) {
      return sum
    }

    return sum + n
  }, 0)

  return total
}
