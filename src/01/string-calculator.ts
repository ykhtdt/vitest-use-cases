/**
 * 문자열 계산기 (String Calculator Kata)
 * @see {@link https://kata-log.rocks/string-calculator-kata}
 * @see {@link ./string-calculator.test.ts} 전체 요구사항 및 테스트 케이스
 * 
 * @param input - 숫자가 포함된 문자열 (빈 문자열 가능)
 * @returns 구분자로 분리된 숫자들의 합 (1000 이하 숫자만)
 * @throws {Error} 음수가 포함된 경우 "negatives not allowed: [음수 목록]" 메시지와 함께 예외 발생
 */
export function add(input: string): number {
  if (isEmpty(input)) {
    return 0
  }

  const [delimiterPattern, numbersPart] = isCustomDelimiter(input) ? parseDelimiterPattern(input) : [/,|\n/, input]
  const numbers = parseNumbers(numbersPart, delimiterPattern)

  validateNumbers(numbers)

  return sumValidNumbers(numbers)
}

/**
 * 문자열이 비어있는지 확인
 * 
 * @param string - 검사할 문자열
 * @returns 문자열이 비어있으면 true, 아니면 false
 */
const isEmpty = (string: string): boolean => !string.length

/**
 * 숫자가 유효한지 확인 (1000 이하인지)
 * 
 * @param number - 검사할 숫자
 * @returns 1000 이하면 true, 아니면 false
 */
const isValidNumber = (number: number): boolean => number <= 1000

/**
 * 입력 문자열이 커스텀 구분자를 포함하는지 확인
 * 
 * @param input - 검사할 문자열
 * @returns 커스텀 구분자가 있으면 true, 아니면 false
 */
const isCustomDelimiter = (input: string): boolean => input.startsWith("//")

/**
 * 정규식 특수문자를 이스케이프 처리
 * 
 * @param string - 이스케이프할 문자열
 * @returns 이스케이프된 문자열
 */
const escapeRegex = (string: string): string => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * 커스텀 구분자 문자열에서 대괄호로 둘러싸인 구분자들을 추출
 * 
 * @param input - 커스텀 구분자가 포함된 입력 문자열
 * @returns 추출된 구분자 배열
 */
const extractDelimiters = (input: string): string[] => {
  const delimiters = input.slice(2, input.indexOf("\n")).match(/\[([^\]]+)\]/g)
  return delimiters ? delimiters.map(d => d.slice(1, -1)) : []
}

/**
 * 정규식 패턴 상수 정의
 */
const PATTERNS = {
  MULTIPLE_DELIMITERS: /^\/\/(\[.+?\])+\n(.*)$/,  // 예시: "//[*][%]\n1*2%3"
  BRACKET_DELIMITER: /^\/\/\[(.+)\]\n(.*)$/,      // 예시: "//[***]\n1***2"
  SIMPLE_DELIMITER: /^\/\/(.)\n(.*)$/             // 예시: "//;\n1;2"
}

/**
 * 여러 개의 구분자가 있는 경우 처리
 * 
 * @param input - 커스텀 구분자가 포함된 입력 문자열
 * @returns [구분자 정규식, 숫자 부분 문자열]
 */
const handleMultipleDelimiters = (input: string): [RegExp, string] => {
  const [, , rest] = input.match(PATTERNS.MULTIPLE_DELIMITERS)!
  const delimiters = extractDelimiters(input)
  const escapedDelimiters = delimiters.map(escapeRegex)
  return [new RegExp(escapedDelimiters.join("|")), rest]
}

/**
 * 대괄호로 둘러싸인 단일 구분자 처리
 * 
 * @param input - 커스텀 구분자가 포함된 입력 문자열
 * @returns [구분자 정규식, 숫자 부분 문자열]
 */
const handleBracketDelimiter = (input: string): [RegExp, string] => {
  const [, delimiter, rest] = input.match(PATTERNS.BRACKET_DELIMITER)!
  return [new RegExp(escapeRegex(delimiter)), rest]
}

/**
 * 단일 문자 구분자 처리
 * 
 * @param input - 커스텀 구분자가 포함된 입력 문자열
 * @returns [구분자 정규식, 숫자 부분 문자열]
 */
const handleSimpleDelimiter = (input: string): [RegExp, string] => {
  const [, delimiter, rest] = input.match(PATTERNS.SIMPLE_DELIMITER)!
  return [new RegExp(escapeRegex(delimiter)), rest]
}

/**
 * 입력 문자열에서 구분자 패턴과 숫자 부분을 추출
 * 
 * @param input - 커스텀 구분자가 포함된 입력 문자열
 * @returns [구분자 정규식, 숫자 부분 문자열]
 */
const parseDelimiterPattern = (input: string): [RegExp, string] => {
  if (input.match(PATTERNS.MULTIPLE_DELIMITERS)) {
    return handleMultipleDelimiters(input)
  }

  if (input.match(PATTERNS.BRACKET_DELIMITER)) {
    return handleBracketDelimiter(input)
  }

  if (input.match(PATTERNS.SIMPLE_DELIMITER)) {
    return handleSimpleDelimiter(input)
  }

  return [/,|\n/, input]
}

/**
 * 문자열을 구분자로 분리하여 숫자 배열로 변환
 * 
 * @param input - 숫자가 포함된 문자열
 * @param pattern - 구분자 정규식
 * @returns 숫자 배열 (NaN 값은 제외)
 */
const parseNumbers = (input: string, pattern: RegExp): number[] => {
  const result = input.split(pattern).map(Number)

  return result.filter(n => !isNaN(n))
}

/**
 * 숫자 배열에 음수가 포함되어 있는지 검증
 * 
 * @param numbers - 검증할 숫자 배열
 * @throws {Error} 음수가 포함된 경우 예외 발생
 */
const validateNumbers = (numbers: number[]): void => {
  const negativeNumbers = numbers.filter(n => n < 0)

  if (negativeNumbers.length > 0) {
    throw new Error(`negatives not allowed: ${negativeNumbers.join(", ")}`)
  }
}

/**
 * 유효한 숫자만 합산 (1000 이하)
 * 
 * @param numbers - 합산할 숫자 배열
 * @returns 유효한 숫자들의 합
 */
const sumValidNumbers = (numbers: number[]): number => numbers.filter(isValidNumber).reduce((sum, n) => sum + n, 0)
