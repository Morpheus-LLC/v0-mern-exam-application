import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import Question from "@/models/Question"
import ExamResult from "@/models/ExamResult"
import mongoose from "mongoose"

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { answers } = await request.json()

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ message: "Invalid answers format" }, { status: 400 })
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
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if user is allowed to take the exam
    if (user.examAllowed === false) {
      return NextResponse.json({ message: "You are not allowed to take this exam" }, { status: 403 })
    }

    // Check if user has already taken the exam
    const existingResults = await ExamResult.find({ userId: user._id })
    if (existingResults.length > 0 && user.examAttempts >= 1) {
      return NextResponse.json({ message: "You have already taken this exam" }, { status: 403 })
    }

    // Get all questions to check answers
    const allQuestions = await Question.find({ _id: { $in: Object.keys(answers) } })

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
    allQuestions.forEach((question) => {
      const questionId = question._id.toString()
      const userAnswer = answers[questionId]

      if (userAnswer) {
        subjectTotal[question.subject]++
        if (question.correctOption === userAnswer) {
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

    // Update user exam attempts
    await User.findByIdAndUpdate(user._id, { $inc: { examAttempts: 1 } })

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
