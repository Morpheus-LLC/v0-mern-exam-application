import { NextResponse } from "next/server"
import { getAuthToken } from "@/lib/api-helpers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import ExamAttempt from "@/models/ExamAttempt"
import mongoose from "mongoose"

export async function POST(request: Request) {
  try {
    const token = getAuthToken()

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { questionId, selectedOption, timeRemaining } = await request.json()

    if (!questionId || selectedOption === undefined || timeRemaining === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Extract user ID from token
    const tokenParts = token.split("-")
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

    // Find active attempt
    const activeAttempt = await ExamAttempt.findOne({ userId: user._id, isActive: true })

    if (!activeAttempt) {
      return NextResponse.json({ message: "No active exam attempt found" }, { status: 404 })
    }

    // Check if the attempt has already been submitted
    if (activeAttempt.hasSubmitted) {
      return NextResponse.json({ message: "This exam attempt has already been submitted" }, { status: 400 })
    }

    // Update the selected option for the question
    const questionIndex = activeAttempt.questions.findIndex((q) => q.id === questionId)

    if (questionIndex === -1) {
      return NextResponse.json({ message: "Question not found in this attempt" }, { status: 404 })
    }

    // Update the question's selected option
    activeAttempt.questions[questionIndex].selectedOption = selectedOption

    // Update the time remaining
    activeAttempt.timeRemaining = timeRemaining

    await activeAttempt.save()

    return NextResponse.json(
      {
        message: "Answer updated successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating answer:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
