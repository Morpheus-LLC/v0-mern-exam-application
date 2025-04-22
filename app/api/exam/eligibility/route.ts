import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import ExamResult from "@/models/ExamResult"
import ExamAttempt from "@/models/ExamAttempt"
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

    // Check if user has an active attempt
    const activeAttempt = await ExamAttempt.findOne({ userId: user._id, isActive: true })

    if (activeAttempt) {
      // Check if the attempt has expired
      const now = new Date()
      const endTime = new Date(activeAttempt.endTime)

      if (now > endTime) {
        // Mark the attempt as inactive
        activeAttempt.isActive = false
        activeAttempt.timeRemaining = 0
        await activeAttempt.save()
      } else {
        // Return the active attempt
        return NextResponse.json(
          {
            eligible: true,
            hasActiveAttempt: true,
            attemptId: activeAttempt._id,
          },
          { status: 200 },
        )
      }
    }

    // Check if user has already completed an exam
    const completedResults = await ExamResult.find({ userId: user._id })
    const completedAttempts = await ExamAttempt.find({
      userId: user._id,
      isActive: false,
      hasSubmitted: true,
    })

    // If examAttempts is 0 (reset by admin), allow the user to take the exam regardless of previous attempts
    if (user.examAttempts === 0) {
      return NextResponse.json({ eligible: true, hasActiveAttempt: false }, { status: 200 })
    }

    if (completedResults.length > 0 || completedAttempts.length > 0) {
      // User has already taken the exam
      return NextResponse.json({ message: "You have already taken this exam" }, { status: 403 })
    }

    // User is eligible for a new attempt
    return NextResponse.json({ eligible: true, hasActiveAttempt: false }, { status: 200 })
  } catch (error) {
    console.error("Error checking exam eligibility:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
