import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Question from "@/models/Question"

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Count questions by subject
    const mathCount = await Question.countDocuments({ subject: "math" })
    const physicsCount = await Question.countDocuments({ subject: "physics" })
    const chemistryCount = await Question.countDocuments({ subject: "chemistry" })

    // Check if we have enough questions for each subject
    const hasEnoughQuestions = mathCount >= 20 && physicsCount >= 20 && chemistryCount >= 20

    return NextResponse.json(
      {
        hasEnoughQuestions,
        counts: {
          math: mathCount,
          physics: physicsCount,
          chemistry: chemistryCount,
          total: mathCount + physicsCount + chemistryCount,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error checking questions:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
