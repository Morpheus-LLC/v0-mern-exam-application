import { NextResponse } from "next/server"
import { headers } from "next/headers"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Question from "@/models/Question"
import ExamResult from "@/models/ExamResult"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { answers, examDuration, tabSwitchCount } = await request.json()

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ message: "Invalid answers format" }, { status: 400 })
    }

    // Extract user ID from token
    let userId
    try {
      const decoded = jwt.verify(authorization.split(" ")[1], JWT_SECRET) as { id: string }
      userId = decoded.id
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Find user
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get all questions to check answers
    const allQuestions = await Question.find({
      _id: { $in: Object.keys(answers) },
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
    const result = await ExamResult.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      totalQuestions,
      correctAnswers,
      score,
      subjectScores,
      answers,
      date: new Date(),
      examDuration: examDuration || 0,
      tabSwitchCount: tabSwitchCount || 0,
    })

    return NextResponse.json(
      {
        message: "Exam submitted successfully",
        result: {
          id: result._id,
          totalQuestions,
          correctAnswers,
          score,
          subjectScores,
          date: result.date,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error submitting exam:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
