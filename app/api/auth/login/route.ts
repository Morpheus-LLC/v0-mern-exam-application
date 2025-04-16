import { NextResponse } from "next/server"
import { users } from "@/lib/mock-db"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    console.log("Login attempt for:", email)
    console.log("Available users:", users.length)

    // Find user
    const user = users.find((user) => user.email === email && user.password === password)
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // In a real application, you would generate a JWT
    // For demo purposes, we'll create a simple token
    const token = `demo-token-${user.id}-${Date.now()}-${user.role || "user"}`

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
