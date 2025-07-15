import {
  it,
  expect,
} from "vitest"

interface User {
  id: number
  name: string
  email: string
}

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: id,
        name: "Vitest" + id,
        email: "Vitest" + id + "@test.com"
      }
      resolve(user)
    }, 100)
  })
}

it("fetch user", async () => {
  const user = await fetchUser(1)
  expect(user).toEqual({
    id: 1,
    name: "Vitest1",
    email: "Vitest1@test.com"
  })
})
