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

## 테스트 훅 함수

- **`afterEach`**
  - 각 테스트 케이스가 실행된 후에 실행되는 함수입니다.
  - 테스트 환경 정리, 모킹 복원, 사이드 이펙트 제거 등에 사용됩니다.

```typescript
afterEach(() => {
  // 각 테스트 후에 실행될 코드
  vi.restoreAllMocks()
})
```

## 매처(Matchers)

- **`toBe`**
  - 기대값과 실제값이 정확히 일치하는지 검증합니다. 
  - JavaScript의 `===`와 동일한 비교를 수행합니다.

- **`toEqual`**
  - 객체, 배열, Map, Set 등의 구조적 내용이 동일한지 깊은 비교로 검증합니다.
  - 객체의 속성값이나 컬렉션의 요소들이 모두 같은지 재귀적으로 비교합니다.
  - 참조가 다르더라도 내용이 같으면 통과합니다.

- **`toThrow`**
  - 함수가 예외를 발생시키는지 검증합니다. 
  - 이 메서드는 함수를 직접 호출하면 테스트 실행 중에 예외가 발생하므로, 반드시 함수 호출을 콜백으로 감싸야 합니다.

```typescript
// 올바른 사용법: 함수 호출을 콜백으로 감싸기
expect(() => functionThatThrows()).toThrow()

// 잘못된 사용법: 테스트 실행 중에 예외가 발생하여 테스트가 실패함
expect(functionThatThrows()).toThrow()
```

- **`toThrowError`**
  - `toThrow`와 유사하지만, 에러 객체의 속성을 더 세밀하게 검사할 수 있습니다.
  - `expect.objectContaining`과 함께 사용하여 에러 객체의 특정 속성을 검증할 수 있습니다.

```typescript
await expect(fetchUser(999)).rejects.toThrowError(
  expect.objectContaining({
    message: "User fetch failed"
  })
)
```

## 목킹(Mocking) 관련 함수

### 모듈 및 함수 모킹

- **`vi.mock`**
  - 모듈을 모킹합니다. 해당 모듈의 모든 내보내기(exports)를 Vitest 모킹 함수(vi.fn())로 대체합니다.
  - 파일 최상단에 호이스팅(hoisting)되어 실행되므로, 모듈 내부에서 선언된 변수를 참조할 수 없습니다.

```typescript
// 기본 사용법
vi.mock("./path/to/module")

// 팩토리 함수를 사용한 구체적인 모킹
vi.mock("./path/to/module", () => {
  return {
    functionName: vi.fn().mockReturnValue("mocked value")
  }
})
```

- **`vi.mocked`**
  - 타입스크립트에서 모킹된 함수의 타입 안전성을 보장합니다.
  - 모킹된 함수에 대해 mock 메서드들(mockReturnValue, mockResolvedValue 등)을 타입 안전하게 사용할 수 있게 합니다.
  - 타입스크립트는 기본적으로 모킹된 함수에 mock 속성이 있다는 것을 알지 못하므로, `vi.mocked`를 사용하여 타입 정보를 제공해야 합니다.

```typescript
import { fetchUser } from "./user-service"
vi.mock("./user-service")

// 타입스크립트에서 타입 오류 발생
// Property 'mockResolvedValue' does not exist on type.
fetchUser.mockResolvedValue({ id: 1, name: "User" }) // 타입 오류

// vi.mocked 사용 - 타입 안전하게 모킹 메서드 사용
const mockedFetchUser = vi.mocked(fetchUser)
mockedFetchUser.mockResolvedValue({ id: 1, name: "User" }) // 정상 동작

// 인라인으로 사용
vi.mocked(fetchUser).mockResolvedValue({ id: 1, name: "User" }) // 정상 동작
```

- **`vi.restoreAllMocks`**
  - 모든 모킹된 함수를 원래 구현으로 복원합니다.
  - 일반적으로 `afterEach`나 `afterAll` 훅에서 사용하여 테스트 간 격리를 보장합니다.

```typescript
afterEach(() => {
  vi.restoreAllMocks()
})
```

### 모킹 함수 반환값 설정

- **`mockResolvedValue`**
  - 모킹된 함수가 지정된 값으로 해결(resolve)되는 Promise를 반환하도록 설정합니다.

```typescript
vi.mocked(fetchUser).mockResolvedValue({ id: 1, name: "User" })
```

- **`mockRejectedValue`**
  - 모킹된 함수가 지정된 에러로 거부(reject)되는 Promise를 반환하도록 설정합니다.

```typescript
vi.mocked(fetchUser).mockRejectedValue(new Error("Failed to fetch"))
```

- **`mockResolvedValueOnce`**
  - 모킹된 함수가 다음 한 번의 호출에 대해서만 지정된 값으로 해결되는 Promise를 반환하도록 설정합니다.
  - 여러 번 연속 호출하여 각각 다른 반환값을 설정할 수 있습니다.

```typescript
vi.mocked(fetchUser)
  .mockResolvedValueOnce({ id: 1, name: "User 1" })
  .mockResolvedValueOnce({ id: 2, name: "User 2" })
```

- **`mockImplementation`**
  - 모킹된 함수의 구현을 직접 제공합니다.
  - 조건부 로직이나 복잡한 동작을 모킹할 때 유용합니다.

```typescript
vi.mocked(fetchUser).mockImplementation(async (id) => {
  if (id > 100) {
    return { id, name: "Admin" }
  }
  return { id, name: "User" }
})
```

### 모킹 함수 호출 검증

- **`toHaveBeenCalledWith`**
  - 모킹된 함수가 특정 인자들로 호출되었는지 검증합니다.

```typescript
expect(fetchUser).toHaveBeenCalledWith(1)
```

## 비동기 테스트 관련

- **`rejects`**
  - Promise가 거부(reject)되는지 검증합니다.
  - `expect(promise).rejects` 형태로 사용하며, 이후에 `.toThrow()`, `.toEqual()` 등의 매처를 연결할 수 있습니다.

```typescript
await expect(fetchUser(-1)).rejects.toThrow("Invalid ID")
```

## 타이머 관련 함수

- **`vi.useFakeTimers`**
  - JavaScript의 타이머 함수(setTimeout, setInterval, clearTimeout 등)를 가짜 구현으로 대체합니다.
  - 시간 관련 동작을 테스트할 때 실제 시간이 경과하지 않고도 테스트할 수 있게 합니다.

```typescript
vi.useFakeTimers()
```

- **`vi.advanceTimersByTime`**
  - 가짜 타이머의 시간을 지정된 밀리초만큼 진행시킵니다.
  - 이 시간 동안 예약된 타이머 콜백들이 실행됩니다.

```typescript
// 500ms 진행
vi.advanceTimersByTime(500)
```

- **`vi.useRealTimers`**
  - 가짜 타이머를 실제 타이머로 복원합니다.
  - 테스트가 끝난 후 타이머 관련 설정을 원래대로 되돌릴 때 사용합니다.

```typescript
vi.useRealTimers()
```

