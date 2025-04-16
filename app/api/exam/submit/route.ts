import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { examResults, questions, users } from "@/lib/mock-db"

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

    // Find user
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Calculate score
    let correctAnswers = 0
    const subjectCorrect: Record<string, number> = {
      math: 0,
      science: 0,
      chemistry: 0,
      english: 0,
    }

    const subjectTotal: Record<string, number> = {
      math: 0,
      science: 0,
      chemistry: 0,
      english: 0,
    }

    // Check answers against correct options
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find((q) => q.id === questionId)
      if (question) {
        subjectTotal[question.subject]++
        if (question.correctOption === answer) {
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
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

    // Save result
    const result = {
      id: `result-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      totalQuestions,
      correctAnswers,
      score,
      subjectScores,
      date: new Date().toISOString(),
    }

    examResults.push(result)

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
