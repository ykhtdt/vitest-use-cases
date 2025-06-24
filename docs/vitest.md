# Vitest 테스트 프레임워크

Vitest는 Vite 기반의 JavaScript/TypeScript 테스트 프레임워크입니다.

공식 문서: [https://vitest.dev/](https://vitest.dev/)

## 주요 함수 및 메서드

- **`describe`**
  - 관련된 테스트들을 하나로 묶는 테스트 그룹(Suite)을 정의합니다.

- **`it`**
  - 하나의 테스트 케이스를 정의합니다. `test`와 동일한 기능을 합니다.

- **`expect`**
  - 테스트 대상 코드의 결과값을 검증합니다.

- **`toBe`**
  - 기대값과 실제값이 정확히 일치하는지 검증합니다. 
  - JavaScript의 `===`와 동일한 비교를 수행합니다.

- **`toThrow`**
  - 함수가 예외를 발생시키는지 검증합니다. 
  - 이 메서드는 함수를 직접 호출하면 테스트 실행 중에 예외가 발생하므로, 반드시 함수 호출을 콜백으로 감싸야 합니다.

```typescript
// 올바른 사용법: 함수 호출을 콜백으로 감싸기
expect(() => functionThatThrows()).toThrow()

// 잘못된 사용법: 테스트 실행 중에 예외가 발생하여 테스트가 실패함
expect(functionThatThrows()).toThrow()
```

