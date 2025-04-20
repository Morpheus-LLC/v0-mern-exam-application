import { NextResponse } from "next/server"
import { headers } from "next/headers"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    await dbConnect()

    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authorization.split(" ")[1]

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

      // Find user by ID
      const user = await User.findById(decoded.id)

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      return NextResponse.json(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
        { status: 200 },
      )
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
