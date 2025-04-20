import { NextResponse } from "next/server"
import { getAuthToken } from "@/lib/api-helpers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import Question from "@/models/Question"
import ExamResult from "@/models/ExamResult"
import ExamAttempt from "@/models/ExamAttempt"
import mongoose from "mongoose"

export async function POST(request: Request) {
  try {
    const token = getAuthToken()

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Extract user ID from token
    const tokenParts = token.split("-")
    const userId = tokenParts[2]

    // Find user
    let user
    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        user = await User.findById(userId)
      }
    } catch (error) {
      console.error("Error finding user:", error)
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

    // Get all questions to check answers
    const questionIds = activeAttempt.questions.map((q) => q.id)
    const allQuestions = await Question.find({ _id: { $in: questionIds } })

    // Create a map of question IDs to correct options
    const correctOptionsMap = new Map()
    allQuestions.forEach((question) => {
      correctOptionsMap.set(question._id.toString(), question.correctOption)
    })

    // Calculate score
    let correctAnswers = 0
    const subjectCorrect: Record<string, number> = {
      math: 0,
      physics: 0,
      chemistry: 0,
    }

    const subjectTotal: Record<string, number> = {
      math: 0,
      physics: 0,
      chemistry: 0,
    }

    // Check answers against correct options
    activeAttempt.questions.forEach((question) => {
      const correctOption = correctOptionsMap.get(question.id)
      const userAnswer = question.selectedOption

      if (question.subject) {
        subjectTotal[question.subject]++
        if (userAnswer && correctOption === userAnswer) {
          correctAnswers++
          subjectCorrect[question.subject]++
        }
      }
    })

    // Calculate subject scores
    const subjectScores: Record<string, number> = {}
    Object.keys(subjectTotal).forEach((subject) => {
      if (subjectTotal[subject] > 0) {
        subjectScores[subject] = Math.round((subjectCorrect[subject] / subjectTotal[subject]) * 100)
      } else {
        subjectScores[subject] = 0
      }
    })

    // Calculate overall score
    const totalQuestions = Object.values(subjectTotal).reduce((sum, count) => sum + count, 0)
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100 * 10) / 10 : 0

    // Save result
    const result = new ExamResult({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      totalQuestions,
      correctAnswers,
      score,
      subjectScores,
      date: new Date(),
    })

    await result.save()

    // Mark attempt as submitted and inactive
    activeAttempt.hasSubmitted = true
    activeAttempt.isActive = false
    await activeAttempt.save()

    return NextResponse.json(
      {
        message: "Exam submitted successfully",
        result,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error submitting exam:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
