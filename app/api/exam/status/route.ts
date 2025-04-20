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

    let hasTakenExam = false
    let canRetakeExam = false

    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        // Check if user has already taken the exam
        const examResult = await ExamResult.findOne({ userId })

        if (examResult) {
          hasTakenExam = true
          // Check if user has been granted permission to retake
          canRetakeExam = examResult.canRetake || false
        }
      }
    } catch (error) {
      console.error("Error checking exam status:", error)
    }

    return NextResponse.json({ hasTakenExam, canRetakeExam }, { status: 200 })
  } catch (error) {
    console.error("Error checking exam status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
