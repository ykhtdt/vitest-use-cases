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
 */
describe("문자열 계산기", () => {
  it("1. 빈 문자열 또는 최대 두 개의 쉼표로 구분된 숫자를 처리해야 한다.", () => {
    expect(add("")).toBe(0)
    expect(add("1")).toBe(1)
    expect(add("1,2")).toBe(3)
  })
})
