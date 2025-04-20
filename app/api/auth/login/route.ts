import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user._id,
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
