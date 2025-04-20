import { NextResponse } from "next/server"
import { headers } from "next/headers"
import dbConnect from "@/lib/mongodb"
import ExamResult from "@/models/ExamResult"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    await dbConnect()

    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Extract user ID from token
    let userId
    try {
      const decoded = jwt.verify(authorization.split(" ")[1], JWT_SECRET) as { id: string }
      userId = decoded.id
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Find the most recent exam result for this user
    const result = await ExamResult.findOne({ userId }).sort({ date: -1 })

    if (!result) {
      // If no results found, return a placeholder
      const placeholderResult = {
        totalQuestions: 60,
        correctAnswers: 0,
        score: 0,
        subjectScores: {
          math: 0,
          physics: 0,
          chemistry: 0,
        },
        date: new Date().toISOString(),
      }
      return NextResponse.json({ result: placeholderResult }, { status: 200 })
    }

    return NextResponse.json(
      {
        result: {
          id: result._id,
          totalQuestions: result.totalQuestions,
          correctAnswers: result.correctAnswers,
          score: result.score,
          subjectScores: result.subjectScores,
          date: result.date,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
