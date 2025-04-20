import { headers } from "next/headers"

export function getAuthToken() {
  const headersList = headers()
  const authorization = headersList.get("authorization")

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null
  }

  return authorization.split(" ")[1]
}
