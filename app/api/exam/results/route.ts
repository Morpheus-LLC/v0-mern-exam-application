import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
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

    // Find the most recent exam result for this user
    let userResults = []

    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        userResults = await ExamResult.find({ userId }).sort({ date: -1 }).limit(1)
      }
    } catch (error) {
      console.error("Error finding results:", error)
    }

    if (userResults.length === 0) {
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

    // Return the most recent result
    return NextResponse.json({ result: userResults[0] }, { status: 200 })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
