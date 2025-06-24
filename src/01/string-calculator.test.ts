import {
  describe,
  it,
  expect,
} from "vitest"

import { add } from "./string-calculator"

/**
 * 문자열 계산기 (String Calculator Kata)
 * @see {@link https://kata-log.rocks/string-calculator-kata}
 * 
 * 쉼표나 줄바꿈으로 구분된 숫자 문자열을 받아 합계를 반환하는 함수에 대한 테스트 코드
 * 
 * 1. 빈 문자열 또는 최대 두 개의 쉼표로 구분된 숫자를 처리해야 한다.
 *    예: add("") => 0
 *    예: add("1") => 1
 *    예: add("1,2") => 3
 *
 * 2. 임의 개수의 숫자를 처리할 수 있어야 한다.
 *    예: add("1,2,3") => 6
 *
 * 3. 쉼표 외에 줄바꿈도 구분자로 처리해야 한다.
 *    예: add("1\n2,3") => 6
 *
 * 4. 커스텀 구분자를 지원해야 한다.
 *    예: add("//;\n1;2") => 3
 * 
 */
describe("문자열 계산기", () => {
  it("1. 빈 문자열 또는 최대 두 개의 쉼표로 구분된 숫자를 처리해야 한다.", () => {
    expect(add("")).toBe(0)
    expect(add("1")).toBe(1)
    expect(add("1,2")).toBe(3)
  })

  it("2. 임의 개수의 숫자를 처리할 수 있어야 한다.", () => {
    expect(add("1,2,3")).toBe(6)
    expect(add("1,2,3,4")).toBe(10)
    expect(add("1,2,3,4,5")).toBe(15)
  })

  it("3. 쉼표 외에 줄바꿈도 구분자로 처리해야 한다.", () => {
    expect(add("1\n2,3")).toBe(6)
  })

  it("4. 커스텀 구분자를 지원해야 한다.", () => {
    expect(add("//;\n1;2")).toBe(3)
  })
})
