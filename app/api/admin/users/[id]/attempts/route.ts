import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import ExamAttempt from "@/models/ExamAttempt"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = await headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if admin
    const tokenParts = authorization.split(" ")[1].split("-")
    const role = tokenParts[4]

    if (role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const userId = params.id

    await connectToDatabase()

    // Find all attempts for this user
    const attempts = await ExamAttempt.find({ userId }).sort({ createdAt: -1 })

    // Format the attempts for the response
    const formattedAttempts = attempts.map((attempt) => ({
      id: attempt._id,
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      hasSubmitted: attempt.hasSubmitted,
      isActive: attempt.isActive,
      createdAt: attempt.createdAt,
      updatedAt: attempt.updatedAt,
      questionsCount: attempt.questions.length,
      answeredCount: attempt.questions.filter((q: any) => q.selectedOption).length,
    }))

    return NextResponse.json({ attempts: formattedAttempts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user attempts:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
