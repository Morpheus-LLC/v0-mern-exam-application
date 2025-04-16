import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { users } from "@/lib/mock-db"

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authorization.split(" ")[1]

    // Extract user role from token (in a real app, you'd verify the JWT)
    const tokenParts = token.split("-")
    const userId = tokenParts[2]
    const role = tokenParts[4] || "user"

    // Find the user by ID
    const user = users.find((u) => u.id === userId)

    if (user) {
      return NextResponse.json(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
        { status: 200 },
      )
    }

    // Fallback to demo user if not found
    return NextResponse.json(
      {
        id: "1",
        name: "Demo User",
        email: "demo@example.com",
        role: "user",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
