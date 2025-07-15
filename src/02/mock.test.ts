import {
  vi,
  describe,
  it,
  expect,
  afterEach,
} from "vitest"

import { fetchUser } from "./lib/user-service"

vi.mock("./lib/user-service", () => {
  return {
    fetchUser: vi.fn().mockResolvedValue({
      id: 1,
      name: "Vitest",
      email: "vitest@test.com"
    })
  }
})

describe("fetch user", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("1. 정상적으로 정보를 가져오는 경우", async () => {
    const expectedUser = {
      id: 1,
      name: "Vitest",
      email: "vitest@test.com"
    }

    const user = await fetchUser(1)

    expect(user).toEqual(expectedUser)
    expect(fetchUser).toHaveBeenCalledWith(1)
  })

  it("2. 정보를 가져오는데 실패하는 경우", async () => {
    vi.mocked(fetchUser).mockRejectedValue(new Error("User fetch failed"))

    await expect(fetchUser(999)).rejects.toThrowError(
      expect.objectContaining({
        message: "User fetch failed"
      })
    )
    expect(fetchUser).toHaveBeenCalledWith(999)
  })

  it("3. 연속 호출에 대해 다른 응답을 반환하는 경우", async () => {
    vi.mocked(fetchUser).mockResolvedValueOnce({
      id: 1,
      name: "first",
      email: "first@test.com"
    })

    vi.mocked(fetchUser).mockResolvedValueOnce({
      id: 2,
      name: "second",
      email: "second@test.com"
    })

    const user1 = await fetchUser(1)
    const user2 = await fetchUser(2)

    expect(user1).toEqual({
      id: 1,
      name: "first",
      email: "first@test.com"
    })
    expect(user2).toEqual({
      id: 2,
      name: "second",
      email: "second@test.com"
    })
  })

  it("4. 지연 응답 테스트", async () => {
    vi.useFakeTimers()

    let resolved = false

    vi.mocked(fetchUser).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolved = true
          resolve({
            id: 1,
            name: "Vitest",
            email: "vitest@test.com"
          })
        }, 1000)
      })
    })

    const userPromise = fetchUser(1)

    expect(resolved).toBe(false)

    vi.advanceTimersByTime(500)
    expect(resolved).toBe(false)

    vi.advanceTimersByTime(500)

    await userPromise

    expect(resolved).toBe(true)

    const user = await userPromise
    expect(user).toEqual({
      id: 1,
      name: "Vitest",
      email: "vitest@test.com"
    })

    vi.useRealTimers()
  })
})
