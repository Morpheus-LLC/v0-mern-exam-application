import { NextResponse } from "next/server"
import { headers } from "next/headers"

// In a real application, you would fetch exam results from a database
// This is a simplified example for demonstration purposes

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Generate a sample result
    const result = {
      totalQuestions: 60,
      correctAnswers: 46,
      score: 76.7,
      subjectScores: {
        math: 85,
        physics: 75,
        chemistry: 70,
      },
      date: new Date().toISOString(),
    }

    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
