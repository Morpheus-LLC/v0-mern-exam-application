import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import Question from "@/models/Question"
import ExamAttempt from "@/models/ExamAttempt"
import mongoose from "mongoose"

// Create a new attempt
export async function POST(request: Request) {
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

    // Check if user already has an active attempt
    const activeAttempt = await ExamAttempt.findOne({ userId: user._id, isActive: true })
    if (activeAttempt) {
      return NextResponse.json(
        {
          message: "You already have an active exam attempt",
          attemptId: activeAttempt._id,
        },
        { status: 400 },
      )
    }

    // Get questions for the exam
    const questions = await Question.find({}).limit(60)

    if (questions.length < 60) {
      return NextResponse.json({ message: "Not enough questions available for the exam" }, { status: 400 })
    }

    // Shuffle questions and select 60
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 60)

    // Format questions for the attempt
    const formattedQuestions = shuffledQuestions.map((q) => ({
      id: q._id.toString(),
      text: q.text,
      options: q.options,
      subject: q.subject,
    }))

    // Calculate end time (60 minutes from now)
    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 60 minutes in milliseconds

    // Create new attempt
    const newAttempt = new ExamAttempt({
      userId: user._id,
      questions: formattedQuestions,
      startTime,
      endTime,
      timeRemaining: 60 * 60, // 60 minutes in seconds
      hasSubmitted: false,
      isActive: true,
    })

    await newAttempt.save()

    // Increment user's exam attempts count
    await User.findByIdAndUpdate(user._id, { $inc: { examAttempts: 1 } })

    return NextResponse.json(
      {
        message: "Exam attempt created successfully",
        attemptId: newAttempt._id,
        questions: formattedQuestions,
        timeRemaining: newAttempt.timeRemaining,
        startTime: newAttempt.startTime,
        endTime: newAttempt.endTime,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating exam attempt:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Get current attempt
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

    // Find active attempt
    const activeAttempt = await ExamAttempt.findOne({ userId: user._id, isActive: true })

    if (!activeAttempt) {
      return NextResponse.json({ message: "No active exam attempt found" }, { status: 404 })
    }

    // Calculate remaining time
    const now = new Date()
    const endTime = new Date(activeAttempt.endTime)

    // If the end time has passed, mark the attempt as inactive
    if (now > endTime) {
      activeAttempt.isActive = false
      activeAttempt.timeRemaining = 0
      await activeAttempt.save()

      return NextResponse.json({ message: "Exam attempt has expired" }, { status: 410 })
    }

    // Calculate remaining time in seconds
    const timeRemaining = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000))

    // Update the time remaining in the database
    activeAttempt.timeRemaining = timeRemaining
    await activeAttempt.save()

    return NextResponse.json(
      {
        attemptId: activeAttempt._id,
        questions: activeAttempt.questions,
        timeRemaining,
        startTime: activeAttempt.startTime,
        endTime: activeAttempt.endTime,
        hasSubmitted: activeAttempt.hasSubmitted,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching exam attempt:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
