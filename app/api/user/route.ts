import { NextResponse } from "next/server"
import { getAuthToken } from "@/lib/api-helpers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import mongoose from "mongoose"

export async function GET(request: Request) {
  try {
    const token = getAuthToken()

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Extract user ID from token (in a real app, you'd verify the JWT)
    const tokenParts = token.split("-")
    const userId = tokenParts[2]
    const role = tokenParts[4] || "user"

    await connectToDatabase()

    // Find the user by ID
    let user

    try {
      // Check if userId is a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(userId)) {
        user = await User.findById(userId)
      }
    } catch (error) {
      console.error("Error finding user:", error)
    }

    if (user) {
      return NextResponse.json(
        {
          id: user._id,
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
