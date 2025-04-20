import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import ExamResult from "@/models/ExamResult"
import mongoose from "mongoose"

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Extract user ID from token
    const tokenParts = authorization.split(" ")[1].split("-")
    const userId = tokenParts[2]

    await connectToDatabase()

    // Find user
    let user
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        user = await User.findById(userId)
      }
    } catch (error) {
      console.error("Error finding user:", error)
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if user is allowed to take the exam
    if (user.examAllowed === false) {
      return NextResponse.json({ message: "You are not allowed to take this exam" }, { status: 403 })
    }

    // Check if user has already taken the exam
    const examResults = await ExamResult.find({ userId: user._id })
    if (examResults.length > 0) {
      return NextResponse.json({ message: "You have already taken this exam" }, { status: 403 })
    }

    // User is eligible
    return NextResponse.json({ eligible: true }, { status: 200 })
  } catch (error) {
    console.error("Error checking exam eligibility:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
