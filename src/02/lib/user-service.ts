export interface User {
  id: number
  name: string
  email: string
}

export async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)

  if (!response.ok) {
    throw new Error("User fetch failed")
  }

  return response.json()
}
